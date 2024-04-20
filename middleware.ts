import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createJWT ,authJWT,setCookie,decodeJWT} from '@/lib/auth'

import { USER_TOKEN } from '@/lib/constants'
export const config = {
  matcher: [ '/api/openai/:path*' ,'/'],
}
const base_url= process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI
export async function middleware(req: NextRequest) {
  // validate the user is authenticated
  // console.log("middleware.req",req)
  let token = req.cookies.get(USER_TOKEN)?.value
  if(!token){
    console.log("token不在重新登陆")    
    return NextResponse.redirect(new URL('/login?from=wecom', req.url))   
  }
  //判断token 是否将要到期,如果是,则设置一个新的
  const decodeJWTToken = await decodeJWT(token)
  
  const {exp,userId,corpId} =  decodeJWTToken
  
  // console.log("decodeJWTToken",decodeJWTToken)
  if (decodeJWTToken && (exp! - Math.floor(Date.now()/1000) < 5)) {
    console.log("token 还剩5秒到期")    
    const Users =  await fetch(`${base_url}/api/users/${userId}`) ;
    const dd = await Users.json()
    // console.log("Users",dd)
    if(!dd.success) {
      // console.log("登陆不成功",req)      
      if (req.method==='POST'){        
        return new Response('401 Unauthorized', {
          status: 401,
          headers: {
            'content-type': 'text/event-stream',
          },
        })          
      }
      return NextResponse.redirect(new URL('/login', req.url))
      
    }else
     {      
      token = await createJWT({corpId,userId})
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
      return NextResponse.redirect(new URL('/login?from=wecom', req.url))
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
  const response = NextResponse.next()
  const res= await setCookie(response,token)
  return res
  
}
