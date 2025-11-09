"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import TextMenu from "./menus/text-menu";
import { extensions } from "./extensions";
import ContentMenu from "./menus/content-menu";

import ColumnsMenu from "./menus/columns-menu";
import LinkMenu from "./menus/link-menu";
import ImageBlockMenu from "./menus/image-block-menu";
import { TableRowMenu, TableColMenu } from "./menus/table-menu";
import emitter from "@/lib/emitter";
import { EVENT_KEY_CHANGE_CHAR_COUNT, RIGHT_PANEL_DOM_ID } from "@/constants";
import { useEditor, EditorContent } from "@tiptap/react";

interface IProps {
  id: string;
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
  const { id, rawContent, handleUpdate } = props;

  const menuContainerRef = useRef(null);

  const editor = useEditor({
    editable: false, // 👈 关键：不可编辑

    immediatelyRender: false, // 👈 加这一行
    extensions,
    content: gen_content(rawContent),
    onUpdate: ({ editor }) => {
      const data = editor.getJSON();
      handleUpdate(JSON.stringify(data));
      updateCharacterCount();
    },
    editorProps: {
      attributes: {
        class:
          "min-h-96 prose dark:prose-invert lg:prose-lg focus:outline-none max-w-none",
      },
    },
  });

  const updateCharacterCount = useCallback(() => {
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    };
    emitter.emit(EVENT_KEY_CHANGE_CHAR_COUNT, {
      count: characterCount.characters(),
      id,
    });
    // characterCount.words() 可统计英文单词数量，但不适用于中文
  }, [id, editor]);

  useEffect(updateCharacterCount);

  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRightPanelDiv(document.getElementById(RIGHT_PANEL_DOM_ID));
  }, []);

  return (
    <>
      <div ref={menuContainerRef}>
        <EditorContent editor={editor} />
        {/* <ContentMenu editor={editor} /> */}
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </>
  );
};

export default TiptapEditor;
