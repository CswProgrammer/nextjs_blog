"use client";

import { useState, useRef, useEffect } from "react";

import {
  Sparkles,
  MoveUpRight,
  SquareArrowUp,
  LoaderCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CONTENT_WIDTH,
  EVENT_KEY_FOCUS_AI,
  EVENT_KEY_AI_EDIT,
} from "@/constants";

import emitter from "@/lib/emitter";
import { send } from "./api";
import { cn } from "@/lib/utils";

export default function AIIsland() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [instruction, setInstruction] = useState("");

  // 监听全局事件，聚焦输入框
  //React.KeyboardEvent<HTMLInputElement>
  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = event;
    if (key === "Enter") {
      requestAI();
    }
    if (key === "Escape") {
      inputRef.current?.blur();
      emitter.emit(EVENT_KEY_AI_EDIT, { type: "focus" });
    }
    if (key === "Backspace" && !instruction) {
      inputRef.current?.blur();
      emitter.emit(EVENT_KEY_AI_EDIT, { type: "focus" });
    }
  }

  function requestAI() {
    if (loading) return;
    setLoading(true);
    inputRef.current?.blur();

    send(instruction, () => {
      setLoading(false);
      setInstruction("");
      setTimeout(() => inputRef.current?.focus(), 100); // 延迟 focus 等待 input enable
    });
  }

  // 监听编辑器唤起 AI
  useEffect(() => {
    function handler() {
      if (loading) return;
      if (!inputRef.current) return;
      inputRef.current.focus();
    }
    emitter.on(EVENT_KEY_FOCUS_AI, handler);
    return () => emitter.off(EVENT_KEY_FOCUS_AI, handler);
  });

  // 监听 input focus blur
  useEffect(() => {
    if (!inputRef.current) return;
    function handleFocus() {
      setIsFocus(true);
    }
    function handleBlur() {
      setIsFocus(false);
    }
    inputRef.current.addEventListener("focus", handleFocus);
    inputRef.current.addEventListener("blur", handleBlur);

    return () => {
      if (!inputRef.current) return;
      inputRef.current.removeEventListener("focus", handleFocus);
      inputRef.current.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div
      className="absolute bottom-0 bg-background"
      style={{
        width: `${CONTENT_WIDTH}px`,
        marginLeft: `-${CONTENT_WIDTH / 2}px`,
        left: "50%",
      }}
    >
      {isFocus && !loading && (
        <div className="ml-11">
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            续写
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            头脑风暴
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            写大纲
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            总结
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            更多...
          </Button>
        </div>
      )}
      <div
        className={cn(
          "rounded-2xl p-2 pl-4 border shadow flex items-center justify-start",
          isFocus && "border-primary",
        )}
      >
        <Sparkles
          size={24}
          className={cn(
            isFocus ? "" : "opacity-50",
            loading && "animate-pulse",
          )}
        />
        <div className="flex-auto flex items-center justify-start">
          <Input
            placeholder="请输入 AI 指令，如：根据标题写大纲"
            value={instruction}
            maxLength={300}
            disabled={loading}
            ref={inputRef}
            onKeyDown={handleKeydown}
            onChange={(e) => setInstruction(e.target.value)}
            className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-inherit hover:text-muted-foreground"
            onClick={requestAI}
            disabled={!instruction}
          >
            {!loading && <SquareArrowUp size={24} />}
            {loading && <LoaderCircle size={24} className="animate-spin" />}
          </Button>
        </div>
      </div>
      <p className="text-sm text-center my-1 text-muted-foreground opacity-50">
        注意，AI 可能会生成错误信息，请自行检查判断
      </p>
    </div>
  );
}
