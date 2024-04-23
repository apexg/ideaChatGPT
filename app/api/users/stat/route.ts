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
      const data = await req.json();
      
      try {
        // 执行聚合查询
        const result = await MongoRequest.aggregate([
          {
              $match: {
                  corpid: `${data.corpid}`, // 添加corpid过滤条件
                  request_time: {
                      $gte: new Date(Date.now() - parseInt(`${data.period}`)) // 获取最近1小时的时间范围
                  }
              }
          },
          {
              $lookup: {
                  from: "users",
                  localField: "username",
                  foreignField: "username",
                  as: "user"
              }
          },
          {
              $unwind: "$user"
          },
          {
              $group: {
                  _id: "$user.alias_name",
                  count: { $sum: 1 },
                  latest_request_timestamp: { $max: "$request_time" }
              }
          },
          {
              $addFields: {
                  latest_request_time: {
                      $dateToString: {
                          format: "%Y-%m-%d %H:%M:%S",
                          date: {
                              $toDate: "$latest_request_timestamp"
                          },
                          timezone: "Asia/Shanghai"
                      }
                  }
              }
          },
          {
              $sort: { count: -1,_id:1 } // 按照访问次数降序排列
          },
          {
              $project: {
                  _id: 0,
                  alias_name: "$_id",
                  count: 1,
                  latest_request_time: 1
              }
          }
      ])
        return jsonResponse(201, { success: true, data: result });
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
