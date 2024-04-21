'use client'
import * as ww from "@wecom/jssdk";
import { loadUserInfo } from "@/lib/utils";
// import { redirect } from 'next/navigation'
import {  useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { USER_TOKEN,MAX_AGE } from '@/lib/constants'
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
  
  async function tmp(code:any) {
    const user = await loadUserInfo(code);
    const token = await user.json()
    console.log("生成的token:",token)
    // if(token.token){
    //   localStorage.setItem(USER_TOKEN, token.token);
    // }
    return token
  }
  if (code){   
    const token= await tmp(code)
    //因为一个code 只能用一次,如果可以正常返回token ,说明是首次使用code并成功了,这时候跳转到主页聊天开始,
    //否则说明是再次向后台请求,这个时候,需要重新扫码产生新的code,所以跳转到/login
    if(token.success){
      router.push("/");    
    }else{
      router.push("/login");
    }    
    
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
        tmp(data.code);
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
