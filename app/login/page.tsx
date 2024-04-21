'use client'
import * as ww from "@wecom/jssdk";
import { loadUserInfo } from "@/lib/utils";
// import { redirect } from 'next/navigation'
import {  useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { useSearchParams } from "next/navigation";
// import querystring from "querystring";
export default async function login(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | undefined };
  }
) {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const code = searchParams?.code;
  const state = searchParams?.state
  const from = searchParams?.from
  console.log("from",from)
  console.log("state",state)
  console.log("code",code)
  
  
  // if (code && state === "redirect") {
  //   //如果已经有code了,则调用user info 获取相关信息并定向到home
  //   // async function f(code:any) {
  //     const Users = await loadUserInfo(code);
  //   // }
  //   // f(code)
  //   // const dd = await Users.json()
    
  //   // if(dd.success){
  //   //   console.log("企业微信url获取的code",code,dd)
  //   //   return redirect("/");
  //   // }
  //   // else{
  //   //   console.log("cookie token设置失败",dd)
  //   // }
  // }
  //如果是企业微信app过来的
  // if (!code)
  // // {
  // const redirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI}/`);
  // // const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base&state=redirect#wechat_redirect`;
  // const url = `https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=${process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID}&agentid=${process.env.NEXT_PUBLIC_AUTH_WECHAT_AGENT_ID}&redirect_uri=${redirectUrl}&state=redirect`;
  // // console.log(url)
  // redirect(url);
  // }
  // redirect(`${process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI}/`);
  if (code){
    const user = await loadUserInfo(code);
  }else  {
  let wwLogin: any;
    const wwLoginOptions: any = {
      el: "#ww_login",
      params: {
        login_type: "CorpApp",
        appid: process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID, //"ww3d958fa2c53f1e60",
        agentid: process.env.NEXT_PUBLIC_AUTH_WECHAT_AGENT_ID, //"1000047",
        redirect_uri: process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI, //"https://ai.idea-group.cn:7850",
        state: "redirect",
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
    
    useEffect(()=>{
      wwLogin = ww.createWWLoginPanel(wwLoginOptions);
    },[])
    
    
  }
  
  return <div id="ww_login" />;
}
