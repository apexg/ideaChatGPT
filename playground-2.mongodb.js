/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('ideaChatGpt');
db.requestlogs.aggregate([
    {
        $match: {
            corpid: 'wxa31c5a6be71ee9b7', // 添加corpid过滤条件
            request_time: {
                $gte: new Date(Date.now() - 60 * 60 *24* 1000) // 获取最近1小时的时间范围
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
        $sort: { count: -1 } // 按照访问次数降序排列
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



