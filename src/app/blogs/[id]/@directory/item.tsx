"use client";

import Link from "next/link";
import { FileText, Ellipsis, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps {
  id: string;
  title: string;
  isCurrent: boolean;
}

export default function Item(props: IProps) {
  const { id, title, isCurrent } = props;

  return (
    <div
      className={cn(
        "flex justify-between w-full p-2 cursor-pointer hover:text-secondary-foreground group",
        isCurrent ? "bg-card" : "hover:bg-card",
      )}
    >
      <Link href={`/blogs/${id}`} className="inline-flex items-center">
        <FileText className="h-4 w-4" />
        &nbsp;{title || "<无标题>"}
      </Link>
    </div>
  );
}
