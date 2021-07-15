import { readLines } from "https://deno.land/std/io/mod.ts";
import hmacSha256 from "https://cdn.skypack.dev/crypto-js/hmac-sha256?dts";
import base64 from "https://cdn.skypack.dev/crypto-js/enc-base64?dts";

// deno-lint-ignore camelcase
const access_token = Deno.env.get("ACCESS_TOKEN") ?? "2366c533ad78c5c6970961c5ceda21a7a146ffe66b3e8896595bee889e3c8811";
const secret = Deno.env.get("SECRET") ?? "SEC75d54a01c0d3a19f59989de2818357395bcf85fb8b49f80032c057b26dc0b360";

if (access_token === undefined) {
  console.error("请在环境变量中设置 ACCESS_TOKEN");
  Deno.exit(1);
}

// 发送的内容
let content = Deno.args.join(" ");
if (Deno.args.length === 0) {
  console.log("请输入你想要发送的内容，按回车键结束：");
  for await (content of readLines(Deno.stdin)) {
    if (content !== "") break;
  }
}

/** 钉钉接口的返回类型 */
interface Result {
  /** 错误码，`0` 表示成功 */
  errcode: number;
  /** 错误描述 */
  errmsg: string;
}

const url = new URL("https://oapi.dingtalk.com/robot/send");
url.searchParams.append("access_token", access_token);

// 如果设置了 secret，则使用“加签”验证方式
if (secret !== undefined) {
  const timestamp = Date.now();
  // 1. 使用 HmacSHA256 算法计算签名
  const hash = hmacSha256(`${timestamp}\n${secret}`, secret);
  // 2. 使用 base64 进行编码
  const digit = base64.stringify(hash);
  // 3. 将参数使用 urlEncode 编码
  const sign = encodeURIComponent(digit);
  // 把 timestamp 和 sign 附加到请求上
  url.searchParams.append("timestamp", String(timestamp));
  url.searchParams.append("sign", sign);
}

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": " application/json" },
  body: JSON.stringify({
    msgtype: "text",
    text: { content },
  }),
});

if (!response.ok) {
  console.error(response.statusText);
  Deno.exit(1);
}

const body: Result = await response.json();

if (body.errcode !== 0) {
  console.error(body.errmsg);
  Deno.exit(1);
}

console.log("send success 👌");
