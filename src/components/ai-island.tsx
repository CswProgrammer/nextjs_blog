"use client";

import { useState } from "react";
import { Sparkles, CornerDownLeft, MoveUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CONTENT_WIDTH, EVENT_KEY_AI_EDIT } from "@/constants"; // 在这里获取内容宽度，不要直接使用数字
import emitter from "@/lib/emitter";

export default function AIIsland() {
  const [instruction, setInstruction] = useState("");

  function handleClick() {
    emitter.emit(EVENT_KEY_AI_EDIT, { content: instruction });
    setInstruction("");
  }

  return (
    <div
      className={`
      absolute bottom-6 w-[${CONTENT_WIDTH}px] left-1/2 ml-[-${CONTENT_WIDTH / 2}px]
      rounded-2xl p-2 pl-4 border shadow bg-background
      flex items-center justify-start
      `}
    >
      <Sparkles size={24} />
      <div className="flex-auto flex items-center justify-start">
        <Input
          placeholder="请输入 AI 指令，如：根据标题写大纲"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-inherit hover:text-muted-foreground"
          onClick={handleClick}
          disabled={!instruction}
        >
          <CornerDownLeft size={24} />
        </Button>
      </div>
      <div className="ml-6 opacity-50">
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          续写
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          头脑风暴
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          总结
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          更多...
        </Button>
      </div>
    </div>
  );
}
