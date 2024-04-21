import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')  

  if (code && state === "STATE") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI}/?from=wecom&code=${code}`);
  }
//   } else {
//     const redirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI}/api/wecom`);
//     const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
//     return NextResponse.redirect(url);
//   }
}
