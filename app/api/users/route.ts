import { type NextRequest } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { MongoUser } from "../../../models/User";
import { jsonResponse } from "@/lib/utils";

async function handler(req: NextRequest) {
  const { method } = req;

  await dbConnect();
  // console.log("global.mongoose",global.mongoose)
  switch (method) {
    case "GET":
      try {
        const Users = await MongoUser.find(
          {},
        ); /* find all the data in our database */
        return jsonResponse(200, { success: true, data: Users });
      } catch (error) {
        return jsonResponse(400, { success: false });
      }
      break;
    case "POST":
      try {
        const data = await req.json();
        // console.log("req.body",ddd)
        const user = await MongoUser.findOneAndUpdate(
          { username: data.username },
          { $set: data },
          { upsert: true, returnNewDocument: true },
        );
        // const user = await MongoUser.create(
        //   await req.json(),
        // ); /* create a new model in the database */
        return jsonResponse(201, { success: true, data: user });
        // res.status(201).json({ success: true, data: user });
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
