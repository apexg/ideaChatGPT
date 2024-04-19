import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerSideConfig } from "@/app/config/server";


export const config = {
  matcher: [ '/api/openai/v1/:path*'],
}


export async function middleware(req: NextRequest) {
  const serverConfig = getServerSideConfig();
  // validate the user is authenticated
  // console.log("middleware.req",req)
//   console.log("middleware",req.headers)
//   console.log("******************serverConfig.apikey",serverConfig.apiKey)
  return NextResponse.next()
  
}
