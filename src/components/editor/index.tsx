"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import TextMenu from "./menus/text-menu";
import { extensions } from "./extensions";
import ContentMenu from "./menus/content-menu";
import { useEffect, useRef } from "react";

import ColumnsMenu from "./menus/columns-menu";
import LinkMenu from "./menus/link-menu";
import ImageBlockMenu from "./menus/image-block-menu";
import { TableRowMenu, TableColMenu } from "./menus/table-menu";
import emitter from "@/lib/emitter";
import { EVENT_KEY_AI_EDIT, EVENT_KEY_FOCUS_AI } from "@/constants";

interface IProps {
  rawContent: string;
  handleUpdate: (content: string) => void;
}

// 生成 JSON 内容
function gen_content(rawContent: string) {
  try {
    return JSON.parse(rawContent);
  } catch (error) {
    return undefined;
  }
}

const TiptapEditor = (props: IProps) => {
  const { rawContent, handleUpdate } = props;

  const menuContainerRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false, // 👈 加这一行
    extensions,
    content: gen_content(rawContent),
    onUpdate: ({ editor }) => {
      const data = editor.getJSON();
      handleUpdate(JSON.stringify(data));
    },
    editorProps: {
      attributes: {
        class:
          "min-h-96 prose dark:prose-invert lg:prose-lg focus:outline-none max-w-none",
      },
    },
  });

  // 监听 AI island 事件
  useEffect(() => {
    function handler(payload: any) {
      if (editor == null) return;

      const { content = "", type = "" } = payload || {};
      if (!content && !type) return;
      // 🔧 新增调试：确认事件到达
      console.log("🔍 编辑器收到事件", payload);

      // 🔧 真正插入
      if (type === "insert") {
        editor.commands.insertContent(content);
        return;
      }
      if (type === "enter") {
        editor.commands.enter();
        return;
      }
      if (type === "focus") {
        editor.commands.focus();
        return;
      }
    }

    emitter.on(EVENT_KEY_AI_EDIT, handler);
    return () => emitter.off(EVENT_KEY_AI_EDIT, handler); // 及时清除自定义事件
  }, [editor]);

  // 监听空格输入，focus AI island
  useEffect(() => {
    if (editor == null) return;
    function fn(event: KeyboardEvent) {
      if (event.key !== " " && event.code !== "Tab") return;
      if (editor == null) return;
      const selection = editor.state.selection;
      if (!selection.empty) return;
      const node = selection.$anchor.node();
      if (node && node.isTextblock && node.textContent.trim() === "") {
        event.preventDefault();
        emitter.emit(EVENT_KEY_FOCUS_AI);
      }
    }
    editor.view.dom.addEventListener("keydown", fn);
    return () => editor.view.dom.removeEventListener("keydown", fn);
  }, [editor]);

  return (
    <div ref={menuContainerRef}>
      <EditorContent editor={editor} />
      <ContentMenu editor={editor} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      <TableRowMenu editor={editor} appendTo={menuContainerRef} />
      <TableColMenu editor={editor} appendTo={menuContainerRef} />
    </div>
  );
};

export default TiptapEditor;
