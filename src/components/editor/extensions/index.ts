import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { SlashCommands } from "./slash-commands";
import { Columns, Column } from "./column";
import Document from "./document";
import Link from "@tiptap/extension-link";
import ImageBlock from "./image-block";

export const extensions = [
  Document,
  Columns,
  Column,
  // 使用 StarterKit，但禁用默认的 Document 扩展，从而使用自定义的 Document 扩展
  StarterKit.configure({
    document: false,
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  SubScript,
  Superscript,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Link.configure({
    openOnClick: false,
  }),
  ImageBlock,
  Placeholder.configure({
    placeholder: "输入 / 设置格式",
  }),
  SlashCommands,
];
