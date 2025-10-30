"use client";
import { Editor } from "@tiptap/react";

import { useState, useRef, useEffect } from "react";

import { CONTENT_WIDTH, EVENT_KEY_FOCUS_AI } from "@/constants";

import emitter from "@/lib/emitter";
import useRequestAI from "./useRequestAI";

import CustomInput from "./custom-input";
import Info from "./info";

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
  const [tokenLimit, setTokenLimit] = useState(-1);

  const { requestAI, abortRequestAI } = useRequestAI({
    editor,
    isSelectionEmpty,
    loading,
    setAIResult,
    setLoading,
    setInstruction,
    tokenLimit,
    setTokenLimit,
  });
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

  // 监听编辑器 text-menu 中 Ask AI 菜单按钮
  useEffect(() => {
    function fn() {
      if (isFocus) return;
      inputRef.current?.focus();
    }
    emitter.on(EVENT_KEY_FOCUS_AI, fn);
    return () => emitter.off(EVENT_KEY_FOCUS_AI, fn); // 及时清除自定义事件
  }, [inputRef, isFocus]);

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
      <ResultPanel
        editor={editor}
        loading={loading}
        result={AIResult}
        setResult={setAIResult}
        setInstruction={setInstruction}
      />
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
      <CustomInput
        ref={inputRef}
        isFocus={isFocus}
        loading={loading}
        editor={editor}
        isSelectionEmpty={isSelectionEmpty}
        onRequestAI={requestAI}
        onAbortRequestAI={abortRequestAI}
        instruction={instruction}
        setInstruction={setInstruction}
      />
      <p className="text-sm text-center my-1 text-muted-foreground opacity-50">
        注意，AI 可能会生成错误信息，请自行检查判断
      </p>
      <Info tokenLimit={tokenLimit} setTokenLimit={setTokenLimit} />
    </div>
  );
}
