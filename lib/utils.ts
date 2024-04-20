import { NextResponse } from 'next/server'

/**
 * Returns a Response object with a JSON body
 */
export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  })
}




// 公共的用于后端的请求方法，同步调用(await request(...))
export async function request(options: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
}) {
  try {
    let opt: Record<string, any> = {
      method: options.method || "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };

    if (options.headers) {
      opt.headers = Object.assign(opt.headers, options.headers);
    }
    if (options.data) {
      if (['GET', 'HEAD'].includes(opt.method.toUpperCase())) {
        options.url = `${options.url}${options.url.includes('?') ? '&' : '?'}${new URLSearchParams(options.data).toString()}`;
      } else {
        opt.body = JSON.stringify(options.data);
      }
    }
    // console.log("options.url",options.url)
    return await fetch(options.url, opt).then((res) => res.json());
  } catch (err) {
    console.error(err);
    return {
      error: true,
      msg: JSON.stringify(err),
    };
  }
}

// 根据企业微信code获取用户信息
export  function  loadUserInfo(userCode: string) {
  return request({
    url: '/api/users/wxuser',
    method: "POST",
    data: { userCode },
  })
}