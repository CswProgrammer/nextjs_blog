"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Item from "./item";
import emitter from "@/lib/emitter";
import { IDoc } from "./type";
import { EVENT_KEY_NAV_DOC, EVENT_KEY_CREATE_DOC } from "@/constants";
import useList from "./hooks/useList";

interface ListProps {
  defaultParamId: string;
  defaultList: IDoc[];
}

export default function List({ defaultParamId, defaultList }: ListProps) {
  const [paramId, setParamId] = useState(defaultParamId);

  // 切换文档，重新设置 paramId
  useEffect(() => {
    function handler(payload: any) {
      const { id } = payload || {};
      if (!id) return;
      setParamId(id);
    }
    emitter.on(EVENT_KEY_NAV_DOC, handler);

    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, handler); // 及时清理自定义事件
    };
  });
  const { list } = useList(defaultList, paramId);

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
        onClick={() => emitter.emit(EVENT_KEY_CREATE_DOC)}
      >
        <Plus className="h-4 w-4 mr-1" />
        创建文档
      </Button>
    </>
  );
}
