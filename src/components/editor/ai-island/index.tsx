"use client";
import { Editor } from "@tiptap/react";

import { useState, useRef, useEffect, useMemo } from "react";
import { Sparkles, CornerDownLeft, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CONTENT_WIDTH, EVENT_KEY_FOCUS_AI } from "@/constants";

import emitter from "@/lib/emitter";
import { send } from "./api";
import { cn } from "@/lib/utils";
import {
  MessagesType,
  genSystemMessage,
  genSelectedContentMessages,
} from "./messages";

import {
  MenusWhenSelectionIsEmpty,
  MenusWhenSelectionIsNotEmpty,
} from "./menus";

import ResultPanel from "./result-panel";

export default function AIIsland(props: { editor: Editor | null }) {
  const { editor } = props;
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [isSelectionEmpty, setIsSelectionEmpty] = useState(true);
  const [AIResult, setAIResult] = useState("");

  function genMessages(instruction: string): MessagesType {
    let messages: MessagesType = [];

    if (!instruction.trim()) return messages;
    if (editor == null) return messages;

    // system message
    messages.push(genSystemMessage());

    // selected content message
    if (!isSelectionEmpty) {
      messages = messages.concat(genSelectedContentMessages(editor));
    }
    // current message
    messages.push({ role: "user", content: instruction });

    return messages;
  }

  function handleClick() {
    const messages = genMessages(instruction);
    requestAI(messages);
  }

  // 监听全局事件，聚焦输入框
  //React.KeyboardEvent<HTMLInputElement>
  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = event;
    if (key === "Enter") {
      const messages = genMessages(instruction);
      requestAI(messages);
    }
    if (key === "Escape") {
      inputRef.current?.blur();
      editor?.commands.focus();
    }
    if (key === "Backspace" && !instruction) {
      inputRef.current?.blur();
      editor?.commands.focus();
    }
  }
  // 监听 input focus blur
  useEffect(() => {
    if (!inputRef.current) return;
    function handleFocus() {
      setIsFocus(true);
      setAIResult("");

      // 判断是否有选中内容
      if (editor == null) return;
      const { empty } = editor.state.selection;
      setIsSelectionEmpty(empty);
    }
    function handleBlur() {
      setTimeout(() => setIsFocus(false), 150);
    }
    inputRef.current.addEventListener("focus", handleFocus);
    inputRef.current.addEventListener("blur", handleBlur);

    return () => {
      if (!inputRef.current) return;
      inputRef.current.removeEventListener("focus", handleFocus);
      inputRef.current.removeEventListener("blur", handleBlur);
    };
  }, [inputRef, editor]);

  // 监听空格输入，focus AI island
  useEffect(() => {
    if (!editor) return;

    if (editor == null) return;
    function fn(event: KeyboardEvent) {
      if (event.key !== " " && event.code !== "Tab") return;
      if (editor == null) return;
      const selection = editor.state.selection;
      if (!selection.empty) return;
      const node = selection.$anchor.node();
      if (node && node.isTextblock && node.textContent.trim() === "") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    editor.view.dom.addEventListener("keydown", fn);
    return () => editor.view.dom.removeEventListener("keydown", fn);
  }, [editor]);

  function requestAI(messages: MessagesType) {
    if (loading) return;
    setLoading(true);
    setAIResult("");

    inputRef.current?.blur();
    // 发送请求
    send(
      messages,

      // 请求中，插入内容

      (content: string) => {
        if (!content) return;
        if (isSelectionEmpty) {
          // 未选中内容，直接插入到编辑器中
          if (content.indexOf("\n") < 0) {
            // 没有换行符，直接插入内容
            editor?.commands.insertContent(content);
            return;
          }
          // 有换行符，则需要考虑换行
          const arr = content.split("\n");
          arr.forEach((c, index) => {
            if (c) editor?.commands.insertContent(c);
            if (index < arr.length - 1) {
              editor?.commands.enter(); // 换行
            }
          });
        } else {
          // 有选中内容，则另外显示
          setAIResult((r) => r + content);
        }
      },
      (done: boolean) => {
        setLoading(false);
        if (isSelectionEmpty) {
          setInstruction("");
          if (done) editor?.commands.enter();
          editor?.commands.focus();
        }
      },
    );
  }

  // 监听编辑器 text-menu 中 Ask AI 菜单按钮
  useEffect(() => {
    function fn() {
      if (isFocus) return;
      inputRef.current?.focus();
    }
    emitter.on(EVENT_KEY_FOCUS_AI, fn);
    return () => emitter.off(EVENT_KEY_FOCUS_AI, fn); // 及时清除自定义事件
  }, [inputRef, isFocus]);

  // placeholder
  const placeholder = useMemo(() => {
    if (!isFocus) return "使用 AI 写作";
    if (isSelectionEmpty) return "输入 AI 指令，如：根据标题写大纲";
    else return "针对选中内容，输入 AI 指令，如：扩展一下这段内容";
  }, [isFocus, isSelectionEmpty]);

  if (!editor) return null;

  return (
    <div
      className="absolute bottom-0 bg-background"
      style={{
        width: `${CONTENT_WIDTH}px`,
        marginLeft: `-${CONTENT_WIDTH / 2}px`,
        left: "50%",
      }}
    >
      {/* 显示 AI 输出结果 （当有选中内容时，不直接插入到编辑器） */}
      {AIResult && (
        <ResultPanel
          editor={editor}
          loading={loading}
          result={AIResult}
          setResult={setAIResult}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 菜单，isSelectionEmpty 时 */}
      {isFocus && !loading && isSelectionEmpty && !AIResult && (
        <MenusWhenSelectionIsEmpty
          editor={editor}
          onRequestAI={requestAI}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 菜单，isSelectionEmpty === false 时 */}
      {isFocus && !loading && !isSelectionEmpty && !AIResult && (
        <MenusWhenSelectionIsNotEmpty
          editor={editor}
          onRequestAI={requestAI}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 指令输入框 */}
      <div
        className={cn(
          "rounded-2xl p-2 pl-4 border shadow flex items-center justify-start",
          isFocus && "border-blue-600",
        )}
      >
        <Sparkles
          size={24}
          className={cn(
            isFocus ? "text-blue-600" : "opacity-50",
            loading && "animate-pulse",
          )}
        />

        <div className="flex-auto flex items-center justify-start">
          <Input
            placeholder={placeholder}
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
            className={cn(isFocus ? "text-blue-600" : "opacity-50")}
            onClick={handleClick}
            disabled={!instruction}
          >
            {!loading && <CornerDownLeft size={24} />}

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
