import { AI_RES_MAX_TOKENS } from "@/constants";
import { MessagesType } from "./messages";

const ORIGIN = process.env.NEXT_PUBLIC_GPT_API_PROXY_ORIGIN || "";
const TOKEN = process.env.NEXT_PUBLIC_GPT_API_PROXY_AUTH_TOKEN || "";

//这就是拼接url的函数
function sanitize(str: string) {
  return str.replace(/[\uD800-\uDFFF]/g, "");
}

function genUrl(messages: MessagesType) {
  let url = "/api/gpt/chat?a=1";

  if (ORIGIN) {
    url = ORIGIN + url + `&x-auth-token=${TOKEN}`;
  }

  const option = {
    messages,
    max_tokens: AI_RES_MAX_TOKENS,
  };

  let optionStr = JSON.stringify(option);
  optionStr = sanitize(optionStr);

  try {
    url = url + `&option=${encodeURIComponent(optionStr)}`;
  } catch (e) {
    console.error("encodeURIComponent 出错，原始字符串：", optionStr);
    throw e;
  }

  return url;
}

// 这是发送请求并处理 SSE 流的函数
//这里的callback是结束时的回调函数
//回调函数没有参数也没有返回值，只是通知调用者“结束了”
export function send(
  messages: MessagesType,
  onData: (content: string) => void,
  callback: (done: boolean) => void,
) {
  // console.log('messages', messages)
  if (!messages || messages.length === 0) {
    callback(false);

    return;
  }
  const url = genUrl(messages);

  console.log("🔍 浏览器即将连接 EventSource", url); // 🔍 新增调试

  //EventSource 用于接收服务器发送的事件流
  const es = new EventSource(url);

  // 🔍 新增调试：连接生命周期
  es.onopen = () => console.log("🔍 浏览器 EventSource 已连接");
  es.onerror = (e) => console.error("🔍 浏览器 EventSource 错误", e);

  es.onmessage = (event) => {
    console.log("🔍 浏览器原始流数据", event.data); // 🔍 新增调试

    const data = event.data || "";
    if (data === "[DONE]") {
      es.close();
      // 结束时调用回调函数
      callback(true);
      return;
    }

    try {
      const obj = JSON.parse(data);
      console.log("🔍 解析后的对象：", obj); // 🧩 再加这一行

      // const content = obj.choices?.[0]?.delta?.content;
      const content =
        obj.c ??
        obj.content ??
        obj.choices?.[0]?.delta?.content
          .replace(/[\uD800-\uDFFF]/g, "") // 🚫 去掉非法代理对字符
          .replace(/\r\n|\r|\n/g, " ") // 去掉换行
          .replace(/"/g, '\\"') // 转义双引号
          .trim();
      console.log("🔍 拿到的 content：", content); // 🧩 再加这一行

      // if (content == null) {
      //   es.close();
      //   callback();
      //   return;
      // }

      if (!content) {
        // 没有内容就跳过，但继续接收下一条
        console.log("🔍 content 为空，跳过");

        //换行
        callback(true);

        return;
      }
      console.log("🔍 即将写入编辑器", content); // 🔍 新增调试

      onData(content); // 写入到编辑器
    } catch (err) {
      console.error("🔍 浏览器解析数据错误", err);
      es.close();
      callback(false);

      return;
    }
  };
}
