"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import TextMenu from "./menus/text-menu";
import { extensions } from "./extensions";

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

  const editor = useEditor({
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

  return (
    <>
      <EditorContent editor={editor} />
      <TextMenu editor={editor} />
    </>
  );
};

export default TiptapEditor;
