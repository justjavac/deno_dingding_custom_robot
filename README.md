# deno_dingding_custom_robot

钉钉自定义机器人

## 使用

```bash
deno run --allow-net --allow-env https://raw.githubusercontent.com/justjavac/deno_dingding_custom_robot/main/mod.ts helloworld
```

或者短域名版：

```bash
deno run --allow-net --allow-env https://git.io/JWRiD helloworld
```

如果你访问 github 不流畅，可以使用 jsdelivr 的 CDN 加速服务：

```bash
deno run --allow-net --allow-env https://cdn.jsdelivr.net/ghjustjavac/deno_dingding_custom_robot/mod.ts helloworld
```

如果后面没有参数，则进入交互模式：

```bash
$ deno run --allow-net --allow-env https://git.io/JWRiD
请输入你想要发送的内容，按回车键结束：
hello<回车>
send success 👌
```

## 核心代码

```ts
const access_token = Deno.env.get("ACCESS_TOKEN");
const secret = Deno.env.get("SECRET");

const url = new URL("https://oapi.dingtalk.com/robot/send");
url.searchParams.append("access_token", access_token);

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": " application/json" },
  body: JSON.stringify({
    msgtype: "text",
    text: { content: "这是一条来自自定义机器人的消息" },
  }),
});

if (!response.ok) {
  console.error(response.statusText);
  Deno.exit(1);
}

const body = await response.json();

if (body.errcode !== 0) {
  console.error(body.errmsg);
  Deno.exit(1);
}

console.log("send success 👌");
```
