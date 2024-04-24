<div align="center">
<img src="./docs/images/icon.svg" alt="预览"/>

<h1 align="center">NextChat</h1>

一键免费部署你的私人 ChatGPT 网页应用，支持 GPT3, GPT4 & Gemini Pro 模型。

[演示 Demo](https://chat-gpt-next-web.vercel.app/) / [反馈 Issues](https://github.com/Yidadaa/ChatGPT-Next-Web/issues) / [加入 Discord](https://discord.gg/zrhvHCr79N)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/ZBUEFA)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

![主界面](./docs/images/cover.png)

</div>

## 部署
1. 修改.env.product 文件,仅需要修改如下行:
   ```
      #替换为你公司的id
      NEXT_PUBLIC_AUTH_WECHAT_APP_ID="wxa31c5a6be71ee9b7"
      #替换为你应用的密文
      NEXT_PUBLIC_AUTH_WECHAT_APP_SECRET="DJd2sxEjxpQdqjcgi_Bit05Ex9Upx-ZJ7l3hqNTR5vo"
      #替换为你公司应用的id
      NEXT_PUBLIC_AUTH_WECHAT_AGENT_ID="5"
      #替换为你公司应用的域名
      NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI="https://apexg1000.idea-group.cn"
      #替换为你公司组织通讯录里面的显示名称,在这个清单里面的都是管理员,可以查看在线统计
      NEXT_PUBLIC_Admin= ["camin","张晓刚",'Zxg']
   ```
2. 修改你企业微信的应用主页,的地址,记住手机和电脑端都设为一样的
   ``` 
   https://open.weixin.qq.com/connect/oauth2/authorize?appid=你的公司id&redirect_uri=https://你的应用域名/api/users/wecom&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect
3. 在vercel 部署,设置openai  的 环境变量:OPENAI_API_KEY,多个key可以使用逗号分割
   ```
   sk-xxx,sk-yyy,sk-zzz

4. mongodb简单使用
   - vs code 安装 MongoDB for VS Code 插件
   - 配置链接到华为云mongodb服务
     ```
      增加mongodb链接
      mongodb://idea:QAZwsx123@124.71.215.126:21010/ideaChatGpt?authSource=admin
   - 现在,你就可以在工具栏左侧看到mongodb的数据库了:ideaChatGpt
     ```
      数据结构 ,只有users表和requestlogs 两个表:
      users:保存用户id,用户名,公司id等
            {
      "_id": {
         "$oid": "6624ed9297779ba6f547ffe8"
      },
      "username": "zxg",
      "__v": 0,
      "alias_name": "Zxg",
      "corpid": "wxa31c5a6be71ee9b7",
      "email": "",
      "loginTime": {
         "$date": "2024-04-21T10:42:26.419Z"
      },
      "mobile": "",
      "userCode": "jVvkpWECeMYCHUkz7uExyMBBF7nlU_Qu4hHTOJXs0-M"
      }

      requestlogs:保存用户提问时间戳
      {
      "_id": {
         "$oid": "662502e498fa54a49486abdc"
      },
      "corpid": "wxa31c5a6be71ee9b7",
      "username": "zxg",
      "request_time": {
         "$date": "2024-04-21T12:13:24.626Z"
      },
      "__v": 0
       }
      ```

5. 查询最近一段时间的在线情况,返回用户名\最近一次提问时间\提问次数,如下脚本可以在vscode插件的playgrounds 中执行
       
    ```
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



   

## 开始使用

1. 准备好你的 [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. 点击右侧按钮开始部署：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&env=GOOGLE_API_KEY&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)，直接使用 Github 账号登录即可，记得在环境变量页填入 API Key 和[页面访问密码](#配置页面访问密码) CODE；
3. 部署完毕后，即可开始使用；
4. （可选）[绑定自定义域名](https://vercel.com/docs/concepts/projects/domains/add-a-domain)：Vercel 分配的域名 DNS 在某些区域被污染了，绑定自定义域名即可直连。

## 保持更新

如果你按照上述步骤一键部署了自己的项目，可能会发现总是提示“存在更新”的问题，这是由于 Vercel 会默认为你创建一个新项目而不是 fork 本项目，这会导致无法正确地检测更新。
推荐你按照下列步骤重新部署：

- 删除掉原先的仓库；
- 使用页面右上角的 fork 按钮，fork 本项目；
- 在 Vercel 重新选择并部署，[请查看详细教程](./docs/vercel-cn.md#如何新建项目)。

### 打开自动更新

> 如果你遇到了 Upstream Sync 执行错误，请手动 Sync Fork 一次！

当你 fork 项目之后，由于 Github 的限制，需要手动去你 fork 后的项目的 Actions 页面启用 Workflows，并启用 Upstream Sync Action，启用之后即可开启每小时定时自动更新：

![自动更新](./docs/images/enable-actions.jpg)

![启用自动更新](./docs/images/enable-actions-sync.jpg)

### 手动更新代码

如果你想让手动立即更新，可以查看 [Github 的文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) 了解如何让 fork 的项目与上游代码同步。

你可以 star/watch 本项目或者 follow 作者来及时获得新功能更新通知。

## 配置页面访问密码

> 配置密码后，用户需要在设置页手动填写访问码才可以正常聊天，否则会通过消息提示未授权状态。

> **警告**：请务必将密码的位数设置得足够长，最好 7 位以上，否则[会被爆破](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/518)。

本项目提供有限的权限控制功能，请在 Vercel 项目控制面板的环境变量页增加名为 `CODE` 的环境变量，值为用英文逗号分隔的自定义密码：

```
code1,code2,code3
```

增加或修改该环境变量后，请**重新部署**项目使改动生效。

## 环境变量

> 本项目大多数配置项都通过环境变量来设置，教程：[如何修改 Vercel 环境变量](./docs/vercel-cn.md)。

### `OPENAI_API_KEY` （必填项）

OpanAI 密钥，你在 openai 账户页面申请的 api key，使用英文逗号隔开多个 key，这样可以随机轮询这些 key。

### `CODE` （可选）

访问密码，可选，可以使用逗号隔开多个密码。

**警告**：如果不填写此项，则任何人都可以直接使用你部署后的网站，可能会导致你的 token 被急速消耗完毕，建议填写此选项。

### `BASE_URL` （可选）

> Default: `https://api.openai.com`

> Examples: `http://your-openai-proxy.com`

OpenAI 接口代理 URL，如果你手动配置了 openai 接口代理，请填写此选项。

> 如果遇到 ssl 证书问题，请将 `BASE_URL` 的协议设置为 http。

### `OPENAI_ORG_ID` （可选）

指定 OpenAI 中的组织 ID。

### `AZURE_URL` （可选）

> 形如：https://{azure-resource-url}/openai/deployments/{deploy-name}

Azure 部署地址。

### `AZURE_API_KEY` （可选）

Azure 密钥。

### `AZURE_API_VERSION` （可选）

Azure Api 版本，你可以在这里找到：[Azure 文档](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions)。

### `GOOGLE_API_KEY` (optional)

Google Gemini Pro 密钥.

### `GOOGLE_URL` (optional)

Google Gemini Pro Api Url.

### `ANTHROPIC_API_KEY` (optional)

anthropic claude Api Key.

### `ANTHROPIC_API_VERSION` (optional)

anthropic claude Api version.

### `ANTHROPIC_URL` (optional)

anthropic claude Api Url.

### `HIDE_USER_API_KEY` （可选）

如果你不想让用户自行填入 API Key，将此环境变量设置为 1 即可。

### `DISABLE_GPT4` （可选）

如果你不想让用户使用 GPT-4，将此环境变量设置为 1 即可。

### `ENABLE_BALANCE_QUERY` （可选）

如果你想启用余额查询功能，将此环境变量设置为 1 即可。

### `DISABLE_FAST_LINK` （可选）

如果你想禁用从链接解析预制设置，将此环境变量设置为 1 即可。

### `WHITE_WEBDEV_ENDPOINTS` (可选)

如果你想增加允许访问的webdav服务地址，可以使用该选项，格式要求：
- 每一个地址必须是一个完整的 endpoint
> `https://xxxx/xxx`
- 多个地址以`,`相连

### `CUSTOM_MODELS` （可选）

> 示例：`+qwen-7b-chat,+glm-6b,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo` 表示增加 `qwen-7b-chat` 和 `glm-6b` 到模型列表，而从列表中删除 `gpt-3.5-turbo`，并将 `gpt-4-1106-preview` 模型名字展示为 `gpt-4-turbo`。
> 如果你想先禁用所有模型，再启用指定模型，可以使用 `-all,+gpt-3.5-turbo`，则表示仅启用 `gpt-3.5-turbo`

用来控制模型列表，使用 `+` 增加一个模型，使用 `-` 来隐藏一个模型，使用 `模型名=展示名` 来自定义模型的展示名，用英文逗号隔开。

## 开发

点击下方按钮，开始二次开发：

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

在开始写代码之前，需要在项目根目录新建一个 `.env.local` 文件，里面填入环境变量：

```
OPENAI_API_KEY=<your api key here>

# 中国大陆用户，可以使用本项目自带的代理进行开发，你也可以自由选择其他代理地址
BASE_URL=https://b.nextweb.fun/api/proxy
```

### 本地开发

1. 安装 nodejs 18 和 yarn，具体细节请询问 ChatGPT；
2. 执行 `yarn install && yarn dev` 即可。⚠️ 注意：此命令仅用于本地开发，不要用于部署！
3. 如果你想本地部署，请使用 `yarn install && yarn build && yarn start` 命令，你可以配合 pm2 来守护进程，防止被杀死，详情询问 ChatGPT。

## 部署

### 容器部署 （推荐）

> Docker 版本需要在 20 及其以上，否则会提示找不到镜像。

> ⚠️ 注意：docker 版本在大多数时间都会落后最新的版本 1 到 2 天，所以部署后会持续出现“存在更新”的提示，属于正常现象。

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   yidadaa/chatgpt-next-web
```

你也可以指定 proxy：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   --net=host \
   -e PROXY_URL=http://127.0.0.1:7890 \
   yidadaa/chatgpt-next-web
```

如果你的本地代理需要账号密码，可以使用：

```shell
-e PROXY_URL="http://127.0.0.1:7890 user password"
```

如果你需要指定其他环境变量，请自行在上述命令中增加 `-e 环境变量=环境变量值` 来指定。

### 本地部署

在控制台运行下方命令：

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

⚠️ 注意：如果你安装过程中遇到了问题，请使用 docker 部署。

## 鸣谢

### 捐赠者

> 见英文版。

### 贡献者

[见项目贡献者列表](https://github.com/Yidadaa/ChatGPT-Next-Web/graphs/contributors)

### 相关项目

- [one-api](https://github.com/songquanpeng/one-api): 一站式大模型额度管理平台，支持市面上所有主流大语言模型

## 开源协议

[MIT](https://opensource.org/license/mit/)
