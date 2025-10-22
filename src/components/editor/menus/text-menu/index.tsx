"use client";

import { BubbleMenu, Editor } from "@tiptap/react";
import ContentTypeMenu from "./content-type";
import BasicMenu from "./basic-menu";

import AlignMenu from "./align-menu";
import MoreMenu from "./more-menu";
import HighlightMenu from "./highlight-menu";
import { isTextSelected } from "@/components/editor/utils/isTextSelected";
import Wrapper from "../bubble-menu-wrapper";
import SetLinkMenu from "./set-link-menu";

interface IProps {
  editor: Editor | null;
}

export default function TextMenu(props: IProps) {
  const { editor } = props;
  if (editor == null) return;
  function shouldShow(editor: Editor) {
    // 某些类型，不显示文本菜单
    const customTypes = [
      "codeBlock",
      "imageBlock",
      "imageUpload",
      "horizontalRule",
      "link",
    ];
    if (customTypes.some((type) => editor.isActive(type))) return false;

    // 其他，看是否选中了文本
    return isTextSelected({ editor });
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      updateDelay={100}
      shouldShow={() => shouldShow(editor)}
    >
      <Wrapper>
        <ContentTypeMenu editor={editor} />
        <BasicMenu editor={editor} />
        <SetLinkMenu editor={editor} />
        <HighlightMenu editor={editor} />
        <AlignMenu editor={editor} />
        <MoreMenu editor={editor} />
      </Wrapper>
    </BubbleMenu>
  );
}
