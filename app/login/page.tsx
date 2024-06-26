'use client'
import * as ww from "@wecom/jssdk";
// import { loadUserInfo } from "@/lib/utils";
// import { redirect } from 'next/navigation'
import {  useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { USER_TOKEN,MAX_AGE } from '@/lib/constants'
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
  // const code = searchParams?.code;
  // const state = searchParams?.state
  // const from = searchParams?.from
  // console.log("from",from)
  // console.log("state",state)
  // console.log("code",code)
  
  // async function tmp(code:any) {
  //   const r= await loadUserInfo(code)
  //   if(r.status===200) {
  //     const r1= await r.json()
  //     const token = r1.token
  //     return token
  //   }  
  //   return null
  // }

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
        // console.log(data.isWeComLogin);
      },
      async onLoginSuccess(data: any) {
        wwLogin.unmount();
        // console.log("微信code",data.code)
        // tmp(data.code);
        // console.log("user",user)
        router.push(`/?code=${data.code}`);
      },
      onLoginFail(err: any) {
        console.log(err);
        //   !!wwLogin && wwLogin.unmount();
      },
    };
    
    useEffect(()=>{
      wwLogin = ww.createWWLoginPanel(wwLoginOptions);
    },[])
    
    
  
  
  return <div id="ww_login" />;
}
