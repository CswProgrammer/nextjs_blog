"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Item from "./item";
import { useToast } from "@/components/ui/use-toast";
import emitter from "@/lib/emitter";

interface ListProps {
  defaultParamId: string;
  list: Array<{ id: string; title: string; parentId: string | null }>;
}

export default function List({ defaultParamId, list }: ListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paramId, setParamId] = useState(defaultParamId);
  useEffect(() => {
    const eventKey = "NAV_DOC";
    function handler(payload: any) {
      const { id } = payload || {};
      if (!id) return;
      setParamId(id);
    }
    emitter.on(eventKey, handler);
    return () => {
      emitter.off(eventKey, handler); // 及时清理自定义事件
    };
  });

  function createDoc() {
    const id = uuid();
    const data = { id };

    // 创建
    fetch("/api/doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errno !== 0) {
          toast({
            variant: "destructive",
            description: resData.msg || "创建失败",
          });
          return;
        }
      });

    // 直接跳转 不用等后端创建完成
    router.push(`/blog_update/${id}`);
  }

  return (
    // <div className="h-[1000px]">
    <>
      {/* render list */}
      {list
        .filter((i) => i.parentId == null) // 顶级目录
        .map((doc) => {
          const { id, title } = doc;
          return (
            <Item
              key={id}
              id={id}
              defaultTitle={title}
              paramId={paramId}
              list={list}
            />
          );
        })}

      {/* create button */}
      <Button
        className="w-full justify-start px-0.5 font-bold"
        variant="ghost"
        onClick={createDoc}
      >
        <Plus className="h-4 w-4 mr-1" />
        创建文档
      </Button>
    </>
  );
}
