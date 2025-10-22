"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FileText, Ellipsis, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { del } from "./action";
import emitter from "@/lib/emitter";

// 存储修改过的标题的
const changedTitleObj: { [key: string]: string } = {}; // { id, changedTitle }
// 获取标题
function getTitle(id: string, curTitle: string) {
  let res = "<无标题>";
  if (curTitle) res = curTitle;
  const changedTitle = changedTitleObj[id];
  if (changedTitle) res = changedTitle; // 如果有 changedTitle ，则用这个
  return res;
}

interface IProps {
  id: string;
  title: string;
  isCurrent: boolean;
}

export default function Item(props: IProps) {
  const { id, title, isCurrent } = props;
  const titleSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 修改标题时触发事件
    const eventKey = `CHANGE_DOC_TITLE_${id}`;
    emitter.on(eventKey, (payload) => {
      const newTitle = payload as string;
      changedTitleObj[id] = newTitle; // 记录下
      if (titleSpanRef.current) {
        titleSpanRef.current!.textContent = newTitle; // 修改 DOM
      }
    });
  }, [id]);

  return (
    <div
      className={cn(
        "flex justify-between w-full p-2 cursor-pointer hover:text-secondary-foreground group",
        isCurrent ? "bg-card" : "hover:bg-card",
      )}
    >
      <Link href={`/blog_update/${id}`} className="inline-flex items-center">
        <FileText className="h-4 w-4 mr-1" />
        <span ref={titleSpanRef}>{getTitle(id, title)}</span>
      </Link>

      <div className="inline-flex items-center invisible group-hover:visible">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => del(id)}
            >
              <Trash2 className="h-4 w-4" />
              &nbsp;删除
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>其他操作</DropdownMenuItem>
            <DropdownMenuItem>其他操作</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
