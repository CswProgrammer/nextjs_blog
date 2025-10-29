import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { SlashCommands } from "./slash-commands";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Columns, Column } from "./column";
import Document from "./document";
import Link from "@tiptap/extension-link";
import ImageBlock from "./image-block";
import { ImageUpload } from "./image-upload";
import { uploadImageAPI } from "@/components/editor/utils/api";
import { Table, TableCell, TableRow, TableHeader } from "./table/index";
import Selection from "./selection";

export const extensions = [
  Document,
  Columns,
  Column,
  // 使用 StarterKit，但禁用默认的 Document 扩展，从而使用自定义的 Document 扩展
  StarterKit.configure({
    document: false,
    dropcursor: false,
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
  ImageUpload,
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      files.forEach(async () => {
        const url = await uploadImageAPI();

        currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run();
      });
    },
    onPaste: (currentEditor, files) => {
      files.forEach(async () => {
        const url = await uploadImageAPI();

        return currentEditor
          .chain()
          .setImageBlockAt({
            pos: currentEditor.state.selection.anchor,
            src: url,
          })
          .focus()
          .run();
      });
    },
  }),

  Table,
  TableCell,
  TableRow,
  TableHeader,
  Placeholder.configure({
    placeholder: "输入 / 设置格式",
  }),
  SlashCommands,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
  Selection,
];
