import emitter from "@/lib/emitter";
import { EVENT_KEY_AI_EDIT } from "@/constants"; // 在这里获取内容宽度，不要直接使用数字

const ORIGIN = process.env.NEXT_PUBLIC_GPT_API_PROXY_ORIGIN || "";
const TOKEN = process.env.NEXT_PUBLIC_GPT_API_PROXY_AUTH_TOKEN || "";

function genUrl(instruction: string) {
  let url = "/api/gpt/chat?a=1";

  if (ORIGIN) {
    url = ORIGIN + url + `&x-auth-token=${TOKEN}`;
  }

  const option = {
    messages: [{ role: "user", content: instruction }],
  };
  const optionStr = JSON.stringify(option);

  url = url + `&option=${encodeURIComponent(optionStr)}`;

  return url;
}

export function send(instruction: string, callback: () => void) {
  if (!instruction) return;

  const url = genUrl(instruction);
  console.log("🔍 浏览器即将连接 EventSource", url); // 🔍 新增调试

  const es = new EventSource(url);

  // 🔍 新增调试：连接生命周期
  es.onopen = () => console.log("🔍 浏览器 EventSource 已连接");
  es.onerror = (e) => console.error("🔍 浏览器 EventSource 错误", e);

  es.onmessage = (event) => {
    console.log("🔍 浏览器原始流数据", event.data); // 🔍 新增调试

    const data = event.data || "";
    if (data === "[DONE]") {
      es.close();
      callback();
      return;
    }

    try {
      const obj = JSON.parse(data);
      console.log("🔍 解析后的对象：", obj); // 🧩 再加这一行

      const content = obj.c ?? obj.content ?? obj.choices?.[0]?.delta?.content;
      console.log("🔍 拿到的 content：", content); // 🧩 再加这一行

      // if (content == null) {
      //   es.close();
      //   callback();
      //   return;
      // }

      if (!content) {
        // 没有内容就跳过，但继续接收下一条
        console.log("🔍 content 为空，跳过");

        return;
      }
      console.log("🔍 即将写入编辑器", content); // 🔍 新增调试

      emitter.emit(EVENT_KEY_AI_EDIT, { content });
    } catch (err) {
      console.error("🔍 浏览器解析数据错误", err);
      es.close();
      callback();
      return;
    }
  };
}
