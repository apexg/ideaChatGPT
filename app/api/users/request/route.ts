import { type NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { MongoRequest } from "@/models/RequestLog";
import { jsonResponse } from "@/lib/utils";
async function handler(req: NextRequest) {
  const { method } = req;

  await dbConnect();
  // console.log("global.mongoose",global.mongoose)
  switch (method) {
    case "GET":
      break;
    case "POST":
      try {
        const data = await req.json();
        // console.log("req.body",ddd)
        // const requstlog = await MongoRequest.findOneAndUpdate({"username":data.username}, {$set: data}, {upsert: true,returnNewDocument: true})
        const requstlog = await MongoRequest.create(data);
        return jsonResponse(201, { success: true, data: requstlog });
      } catch (error) {
        return jsonResponse(400, { success: false });
      }
      break;
    default:
      return jsonResponse(400, { success: false });
      break;
  }
}

export const POST = handler;
export const GET = handler;
