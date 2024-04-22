import  { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify,decodeJwt } from 'jose'
import { USER_TOKEN,TOKEN_EXP,MAX_AGE, getJwtSecretKey } from './constants'
import { UserType}from '@/app/store/type'

export type UserJwtPayload ={
  jti: string;
  iat: number;
  exp: number;
  userId:string;
  corpId:string;
  userCode:string;
  alias_name:string;
}

export class AuthError extends Error {}

/* create token */
export function createJWT({ corpId, userId,userCode,alias_name }: { corpId: any, userId: any,userCode:any,alias_name:any }) {
  const token =  new SignJWT({corpId:corpId,userId:userId,userCode:userCode,alias_name:alias_name})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXP)
    .sign(new TextEncoder().encode(getJwtSecretKey()))

  return token

}


/**
 * auth token
 */
export async function decodeJWT(token: string)   {
  
  return await decodeJwt(token)
   
}


/**
 * auth token
 */
export async function authJWT(token: string) :Promise<UserJwtPayload | null>  {
  // const token = req.cookies.get(USER_TOKEN)?.value
  // console.log("token",token)
  if (!token) return null
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    )
    return verified.payload as UserJwtPayload
  } catch (err) {
    throw new AuthError('Your token has expired.')
  } 
}

// /* set cookie */
// export const setCookie =(res: NextResponse, token: string) =>{  
//   if (!res) {
//     throw new Error('Response object is undefined');
//   }
//   // console.log("res",res)

//   res.cookies.set(USER_TOKEN, token, {
//     httpOnly: true,
//     maxAge: MAX_AGE, // 2 hours in seconds
//     sameSite:"none",
//     secure:true
//   })
//   return res
// }

/* clear cookie */
// export const clearCookie = (res: NextResponse) => {
//   res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
//   console.log("token清除成功!")
//   return res
// };

