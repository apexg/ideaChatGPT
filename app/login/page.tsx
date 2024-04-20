"use client";
import * as ww from "@wecom/jssdk";
import { loadUserInfo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default async function login() {
  const router = useRouter();

  let wwLogin: any;
  const wwLoginOptions: any = {
    el: "#ww_login",
    params: {
      login_type: "CorpApp",
      appid: process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID, //"ww3d958fa2c53f1e60",
      agentid: process.env.NEXT_PUBLIC_AUTH_WECHAT_AGENT_ID, //"1000047",
      redirect_uri: process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI, //"https://ai.idea-group.cn:7850",
      state: "ChatBot",
      panel_size: "small",
      redirect_type: "callback",
    },
    onCheckWeComLogin(data: any) {
      console.log(data.isWeComLogin);
    },
    async onLoginSuccess(data: any) {
      wwLogin.unmount();
      // console.log("微信code",data.code)
      const user = await loadUserInfo(data.code);
      // console.log("user",user)
      router.push("/");
    },
    onLoginFail(err: any) {
      console.log(err);
      //   !!wwLogin && wwLogin.unmount();
    },
  };

  useEffect(() => {
    wwLogin = ww.createWWLoginPanel(wwLoginOptions);
  }, []);

  return <div id="ww_login" />;
}
