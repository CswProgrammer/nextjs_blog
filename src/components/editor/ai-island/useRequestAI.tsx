import { Editor } from "@tiptap/react";
import throttle from "lodash/throttle";
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { genGPTUrl } from "./util";
import { MessagesType } from "./messages";
import { post } from "@/lib/ajax";

interface IParams {
  editor: Editor | null;
  isSelectionEmpty: boolean;
  loading: boolean;
  setAIResult: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInstruction: React.Dispatch<React.SetStateAction<string>>;
  tokenLimit: number;
  setTokenLimit: React.Dispatch<React.SetStateAction<number>>;
}

export default function useRequestAI(params: IParams) {
  const {
    editor,
    isSelectionEmpty,
    loading,
    setAIResult,
    setLoading,
    setInstruction,
    tokenLimit,
    setTokenLimit,
  } = params;

  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const { toast } = useToast();

  // eslint-disable-next-line
  const editorScrollIntoView = useCallback(
    throttle(() => editor?.commands.scrollIntoView(), 500),
    [editor],
  );

  function insertCount(content: string) {
    if (isSelectionEmpty) {
      // 未选中内容，直接插入到编辑器中
      if (content.indexOf("\n") < 0) {
        // 没有换行符，直接插入内容
        editor?.commands.insertContent(content);
        editorScrollIntoView();
        return;
      }
      // 有换行符，则需要考虑换行
      const arr = content.split("\n");
      arr.forEach((c, index) => {
        if (c) {
          editor?.commands.insertContent(c);
          editorScrollIntoView();
        }
        if (index < arr.length - 1) {
          editor?.commands.enter(); // 换行
        }
      });
    } else {
      // 有选中内容，则另外显示
      setAIResult((r: string) => r + content);
    }
  }

  function onSuccess() {
    setLoading(false);
    if (isSelectionEmpty) {
      setInstruction("");
      editor?.commands.enter();
      editor?.commands.focus();
    }
    editor?.setEditable(true);
  }

  function onError(msg: string) {
    setLoading(false);
    toast({
      variant: "destructive",
      title: "发生错误，请稍后再试",
      description: msg,
      action: <ToastAction altText="知道了">知道了</ToastAction>,
    });
    editor?.setEditable(true);
  }

  function requestAI(messages: MessagesType) {
    // console.log('messages ', messages)
    if (!messages || messages.length === 0) return;
    if (loading) return;

    if (tokenLimit <= 0) {
      onError("AI tokens 使用量已超出限制，请先领取或购买");
      return;
    }

    setLoading(true);
    setAIResult("");
    // inputRef.current?.blur()

    editor?.setEditable(true);
    setEventSource(null); // 重置
    const url = genGPTUrl(messages);
    const es = new EventSource(url);
    es.onopen = () => {
      setEventSource(es); // 保存
    };
    es.onerror = (event) => {
      console.error("event-source error ", event);
      onError("AI 接口请求失败，请稍后再试...");
      es.close(); // 关闭连接
    };
    // 🟢 修改开始：处理后端 JSON 数据
    es.onmessage = (event) => {
      console.log("🔍 浏览器原始流数据", event.data);

      const raw = event.data;
      if (!raw || raw === "[DONE]") {
        console.log("✅ 流结束");
        onSuccess();
        es.close();
        return;
      }

      // 错误提示格式
      if (raw.startsWith("[ERROR]")) {
        onError(`AI 接口错误 ${raw}`);
        es.close();
        return;
      }

      try {
        // 尝试解析 JSON
        const obj = JSON.parse(raw);
        console.log("📦 解析后的对象：", obj);

        // 如果是 usage 信息就跳过
        if (obj.usage) {
          console.log("📊 当前 usage 数据：", obj.usage);
          return;
        }
        const { c: content = "", usage } = obj as any;

        console.log("📝 拿到的 content：", content);

        if (content) {
          insertCount(content);
        } else {
          console.log("⚠️ content 为空，跳过");
        }
        if (usage) {
          const {
            prompt_tokens = 0,
            completion_tokens = 0,
            total_tokens = 0,
          } = usage;
          // console.log('usage', prompt_tokens, completion_tokens, total_tokens)

          // 更新客户端
          setTokenLimit((n) => {
            if (n <= total_tokens) return 0;
            return n - total_tokens;
          });
          // 更新服务端数据
          post("/api/gpt/token-usage", { total_tokens });
        }
      } catch (e) {
        // 如果不是 JSON，直接插入
        console.warn("⚠️ 非 JSON 数据，直接插入：", raw);
        insertCount(raw);
      }
    };
    // 🔴 修改结束
  }

  function abortRequestAI() {
    // console.log('abortRequestAI...', eventSource)
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setLoading(false);
      // console.log('abort done~ ')
    }
  }

  return { requestAI, abortRequestAI };
}
