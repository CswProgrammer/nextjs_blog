import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import emitter from "@/lib/emitter";
import { nav } from "../util";
import { IDoc } from "../type";
import { EVENT_KEY_CREATE_DOC } from "@/constants";

export default function useList(defaultList: IDoc[]) {
  const { toast } = useToast();
  const [list, setList] = useState(defaultList);

  // 创建文档
  const createDoc = useCallback(
    (parentId: string | null = null) => {
      const newId = uuid();

      // 更新列表
      setList([
        ...list,
        {
          id: newId,
          title: "",
          parentId,
        },
      ]);

      // 跳转
      nav(newId, "create");

      // 异步创建
      fetch("/api/doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: newId, parentId }),
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
    },
    [list, toast],
  );

  // 创建文档 - 绑定自定义事件
  useEffect(() => {
    function handleCreate(payload: any) {
      const { parentId = null } = payload || {};
      createDoc(parentId);
    }
    emitter.on(EVENT_KEY_CREATE_DOC, handleCreate);
    return () => {
      emitter.off(EVENT_KEY_CREATE_DOC, handleCreate); //及时清除自定义事件
    };
  }, [createDoc]);

  return { list, createDoc };
}
