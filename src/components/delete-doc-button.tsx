import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import emitter from "@/lib/emitter";
import { EVENT_KEY_DEL_DOC } from "@/constants";

interface IProps {
  id: string;
  className?: string;
}

export default function DocDeleteButton(props: IProps) {
  const { id, className = "" } = props;

  // 删除文档
  function delDocHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log("点击删除按钮：", id);
    emitter.emit(EVENT_KEY_DEL_DOC, { id });
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-2 px-1 h-8 text-destructive",
        className,
      )}
      onClick={delDocHandler}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      删除
    </Button>
  );
}
