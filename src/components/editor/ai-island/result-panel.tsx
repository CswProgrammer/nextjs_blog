import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { X, Sparkle, BetweenHorizonalStart, Replace } from "lucide-react";
import { useEffect, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import emitter from "@/lib/emitter";
import { EVENT_KEY_FOCUS_AI } from "@/constants";

interface IProps {
  editor: Editor | null;
  isSelectionEmpty: boolean;
  loading: boolean;
  result: string;
  setResult: (result: string) => void;
  setInstruction: (instruction: string) => void;
}

export default function ResultPanel(props: IProps) {
  const {
    editor,
    isSelectionEmpty,
    loading,
    result = "",
    setResult,
    setInstruction,
  } = props;

  const menuRef = useRef<HTMLDivElement>(null);
  const resList = result.split("\n"); // 考虑换行

  // 插入编辑器，考虑换行
  function insertResultToEditor() {
    resList.forEach((c, index) => {
      if (c.trim() === "") return;
      editor?.commands.insertContent(c);
      if (index < resList.length - 1) {
        editor?.commands.enter(); // 换行
      }
    });
    editor?.commands.scrollIntoView();
  }
  useEffect(() => {
    if (menuRef.current == null) return;
    // 如果内容太多，需要持续滚动，保证一直能看到菜单
    scrollIntoView(menuRef.current!, {
      scrollMode: "if-needed",
      behavior: "smooth",
      block: "center",
    });
  }, [result]);

  // 替换
  function onReplace() {
    if (editor == null) return;
    insertResultToEditor();

    editor.commands.focus();
    setResult("");
    setInstruction("");
  }

  // 插入
  function onInsert() {
    if (editor == null) return;
    const { to } = editor.state.selection;
    editor.commands.focus(to);
    editor.commands.enter();
    insertResultToEditor();

    setResult("");
    setInstruction("");
  }

  // 重新生成 AI 结果
  function onRegenerate() {
    setResult("");
    emitter.emit(EVENT_KEY_FOCUS_AI);
  }

  // 关闭
  function onClose() {
    setResult("");
    setInstruction("");
    editor?.commands.focus();
  }

  if (editor == null) return null;
  if (isSelectionEmpty) return null;
  if (!result && !loading) return null;

  return (
    <div className="border-2 border-blue-600 rounded-lg shadow p-4 pb-2 mb-2">
      <div className="max-h-72 overflow-y-auto">
        {!result && (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              AI 生成中......
            </span>
          </div>
        )}
        {result && (
          <div>
            {resList.map((l, index) => {
              if (l.trim() === "") return null;
              return (
                <p key={index} className="text-sm my-2 first:mt-0">
                  {l}
                </p>
              );
            })}
          </div>
        )}
        <div className="flex justify-center mt-1" ref={menuRef}>
          {/* 处理 AI 结果的菜单：替换，插入，重新生成，取消 */}
          <Button
            onClick={onReplace}
            disabled={loading}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <Replace className="h-4 w-4 mr-1" />
            替换
          </Button>
          <Button
            onClick={onInsert}
            disabled={loading}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <BetweenHorizonalStart className="h-4 w-4 mr-1" />
            插入
          </Button>
          <Button
            onClick={onRegenerate}
            disabled={loading}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <Sparkle className="h-4 w-4 mr-1" />
            重新生成
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="ghost"
            className="p-2 text-red-500 hover:bg-inherit hover:text-red-400"
            tabIndex={-1}
          >
            <X className="h-4 w-4 mr-1" />
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
