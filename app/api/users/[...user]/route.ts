import { NextRequest } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import { MongoUser } from "../../../../models/User";
import { jsonResponse } from "@/lib/utils";

async function handler(
  req: NextRequest,
  { params }: { params: { user: string[]} },
) {
  const username = params.user[0];
  const userCode = params.user[1]; 
  
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        // console.log({"username":username})
        const user = await MongoUser.findOne({ username: username ,userCode:userCode});
        // console.log("MongoUser.findOne",user)
        if (!user) {
          return jsonResponse(400, { success: false });
        }
        return jsonResponse(200, { success: true, data: user });
      } catch (error) {
        return jsonResponse(400, { success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await MongoUser.findByIdAndUpdate(
          username,
          await req.json(),
          {
            new: true,
            runValidators: true,
          },
        );
        if (!user) {
          return jsonResponse(400, { success: false });
        }
        return jsonResponse(200, { success: true, data: user });
      } catch (error) {
        return jsonResponse(400, { success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedUser = await MongoUser.deleteOne({ _id: username });
        if (!deletedUser) {
          return jsonResponse(400, { success: false });
        }
        return jsonResponse(200, { success: true, data: {} });
      } catch (error) {
        return jsonResponse(400, { success: false });
      }
      break;

    default:
      return jsonResponse(400, { success: false });
      break;
  }
}

export const GET = handler;
export const DELETE = handler;
export const PUT = handler;
