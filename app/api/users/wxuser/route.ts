import { NextRequest, NextResponse } from "next/server";
import { request } from "@/lib/utils";

import dbConnect from "@/lib/dbConnect";
import { MongoUser } from "@/models/User";
import { createJWT, setCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const corpId = process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID;
  const secret = process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_SECRET;
  const body = await req.json();
  const { userCode } = body;
  if (!userCode) {
    return NextResponse.json({ massege: "用户code为空" }, { status: 500 });
  }

  await dbConnect();

  //获得access token
  const access = await request({
    url: "https://qyapi.weixin.qq.com/cgi-bin/gettoken",
    data: { corpid: corpId, corpsecret: secret },
  });

  //获得用户基本信息
  if (!access.access_token) {
    return NextResponse.json(access, { status: 500 });
  }
  if (access.access_token) {
    const userinfo = await request({
      url: "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo",
      data: { access_token: access.access_token, code: userCode },
    });
    if (!userinfo.userid) {
      return NextResponse.json(userinfo, { status: 500 });
    }
    if (userinfo.userid) {
      const res = await request({
        url: "https://qyapi.weixin.qq.com/cgi-bin/user/get",
        data: { access_token: access.access_token, userid: userinfo.userid },
      });

      if (!res.name) {
        return NextResponse.json(res, { status: 500 });
      }
      if (res.name) {
        const user = {
          corpid: corpId,
          username: res.userid,
          alias_name: res.name,
          mobile: "",
          email: "",
        };

        //保持到数据库
        const tmp = await MongoUser.findOneAndUpdate(
          { username: user.username },
          { $set: user },
          { upsert: true, returnNewDocument: true },
        );
        // console.log("保存用户到数据库",user)
        //设置token
        const token = await createJWT({
          corpId: corpId!,
          userId: user.username,
        });
        return await setCookie(jsonResponse(200, { success: true,token }), token);

        
      }
    }
  }

  return NextResponse.json({}, { status: 500 });
}
