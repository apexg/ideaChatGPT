import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createJWT ,authJWT,decodeJWT} from '@/lib/auth'
import { loadUserInfo } from "@/lib/utils";
import { USER_TOKEN,MAX_AGE } from '@/lib/constants'
// import {useSystemStore} from '@/app/store/useSystemStore'
export const config = {
  matcher: [ '/api/openai/:path*' ,'/','/api/users/stat'],
}
const base_url= process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI
export async function middleware(req: NextRequest) {
  // const { setLoginStore } = useSystemStore();
  const code = req.nextUrl.searchParams.get('code')
  // const state = req.nextUrl.searchParams.get('state')  
  // validate the user is authenticated
  // console.log("middleware.req",req)
  let token = req.cookies.get(USER_TOKEN)?.value
  //如果没有拿到token ,则使用code 请求一个新token
  if(!token && code ){
    const r= await loadUserInfo(code)
    if(r.status===200) {
      const r1= await r.json()
      token = r1.token
    }  
  }
  const response = NextResponse.next()
  if (token){
    //设置cookie    
    response.cookies.set(USER_TOKEN, token, {
      // httpOnly: true,
      maxAge: MAX_AGE, // 2 hours in seconds     
    })
  }
  // const cookies = response.cookies.get(USER_TOKEN)
  
  // console.log("cookie token:",cookies)
  
  if(!token){
    console.log("token不在重新登陆")    
    if (req.method==='POST'){        
      return new Response('401 Unauthorized', {
        status: 401,
        headers: {
          'content-type': 'text/event-stream',
        },
      })          
    }
      // console.log("req.url",req.url)
      return NextResponse.redirect(new URL('/login', req.url))         
  }
  //判断token 是否将要到期,如果是,则设置一个新的
  const decodeJWTToken = await decodeJWT(token)
  
  type UserJwtPayload ={
    jti: string;
    iat: number;
    exp: number;
    userId:string;
    corpId:string;
    userCode:string;
    alias_name:string;
  }
  const {exp,userId,corpId,alias_name,userCode} = <UserJwtPayload> decodeJWTToken
  
  // console.log("{exp,userId,corpId,alias_name,userCode}",{exp,userId,corpId,alias_name,userCode})
  //设置zustant
  // setLoginStore({
  //   corpid: corpId,
  //   username: userId,
  //   alias_name: alias_name,  
  //   mobile: '',
  //   email: '',  
  //   userCode:userCode
  // })
  
  if (decodeJWTToken && (exp! - Math.floor(Date.now()/1000) < 5)) {
    console.log("token 还剩5秒到期")   
    //根据userid和code查找用户,如果能找到,是合法,否则是非法或者在另外一个地方登陆也为非法 
    const Users =  await fetch(`${base_url}/api/users/${userId}/${userCode}`) ;
    const dd = await Users.json()
    // console.log("Users",dd)
    if(!dd.success) {
      //清除token        
      let response = NextResponse.next()
      response.cookies.delete(USER_TOKEN);
      return response
    }else
    {      
      token = await createJWT({
        corpId:corpId, 
        userId:userId,
        userCode:userCode,
        alias_name:alias_name})

       //设置cookie    
      response.cookies.set(USER_TOKEN, token, {
        // httpOnly: true,
        maxAge: MAX_AGE, // 2 hours in seconds     
      })
    }
  }
  const verifiedToken = await authJWT(token) 
  // console.log("verifiedToken",verifiedToken)
  if (!verifiedToken) {
    // if this an API request, respond with JSON
    if (req.nextUrl.pathname.startsWith('/api/openai')) {
      return new Response('401 Unauthorized', {
        status: 401,
        headers: {
          'content-type': 'text/event-stream',
        },
      })          
    }
    // otherwise, redirect to the set token page
    else {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  //记录请求日志
  if (req.nextUrl.pathname.startsWith('/api/openai')) {
    // 定义请求的 URL
    const url = `${base_url}/api/users/request`;
    // 准备请求的数据
    const data = {
      username: userId,
      corpid: corpId
    };
    // console.log("请求data",data)
    // 配置 Fetch 请求
    const options = {
      method: 'POST',  // 指定请求方法为 POST
      headers: {
        'Content-Type': 'application/json'  // 指定请求头为 JSON 格式
      },
      body: JSON.stringify(data)  // 将数据转换为 JSON 字符串
    };

    // 发起 Fetch 请求
    const r= await fetch(url, options)
    // console.log(await r.json())
  }
    return response
}
