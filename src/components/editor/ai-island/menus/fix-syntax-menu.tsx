import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import {
  MessagesType,
  genSystemMessage,
  genSelectedContentMessages,
} from "../messages";

interface IProps {
  editor: Editor | null;
  onRequestAI: (message: MessagesType) => void;
  setInstruction: (instruction: string) => void;
}

export default function FixSyntaxMenu(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props;

  function genMessages(instruction: string): MessagesType {
    if (editor == null) return [];

    // messages
    let messages: MessagesType = [];
    messages.push(genSystemMessage()); // system message

    // selected content message
    messages = messages.concat(genSelectedContentMessages(editor));

    // current message
    messages.push({ role: "user", content: instruction });
    return messages;
  }

  function handleClick() {
    if (editor == null) return;

    const { empty } = editor.state.selection;
    if (empty) return;

    const instruction = "修复这段话的语法和表达错误，并重新输出";
    const messages = genMessages(instruction);

    setInstruction(instruction);
    onRequestAI(messages);
  }

  if (editor == null) return null;

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
    >
      修复语法错误
      <MoveUpRight className="h-4 w-4" />
    </Button>
  );
}
