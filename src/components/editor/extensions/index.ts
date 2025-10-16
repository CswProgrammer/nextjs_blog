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

export const extensions = [
  StarterKit,
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
  Placeholder.configure({
    // Use different placeholders depending on the node type:
    // placeholder: ({ node }) => {
    //   if (node.type.name === 'heading') {
    //     return 'What’s the title?'
    //   }

    //   return 'Can you add some further context?'
    // },
    placeholder: "输入 / 设置格式",
  }),
  SlashCommands,
];
