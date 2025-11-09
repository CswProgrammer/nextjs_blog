import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import emitter from "@/lib/emitter";
import { IDoc } from "../type";
import { nav, getDescendantsIds } from "../util";
import {
  EVENT_KEY_CREATE_DOC,
  EVENT_KEY_DEL_DOC,
  EVENT_KEY_CHANGE_IS_STAR,
  EVENT_KEY_CHANGE_DOC_TITLE,
} from "@/constants";

import { IAjaxRes, patch, post } from "@/lib/ajax";

export default function useList(defaultList: IDoc[], paramId: string) {
  const { toast } = useToast();
  const [list, setList] = useState(defaultList);

  console.log("useList emitter", emitter);
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
      post("/api/doc", { id: newId, parentId }).then((resData: IAjaxRes) => {
        if (resData.errno === 0) return;
        toast({
          variant: "destructive",
          description: resData.msg || "创建失败",
        });
        setTimeout(() => {
          location.href = "/blogs/0";
        }, 1500);
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

  // 删除文档
  const deleteDoc = useCallback(
    (id: string) => {
      try {
        console.log("【前端】即将 PATCH", "/api/doc", { id });

        console.log("【debug】deleteDoc list:", list);
        console.log("【debug】getDescendantsIds 函数:", getDescendantsIds);
        const descendantsIds = getDescendantsIds(id, list);
        console.log("【debug】descendantsIds 结果:", descendantsIds);
        // 找到所有下级节点 ids

        // 要删除的所有 ids ，包括当前节点
        const ids = [...descendantsIds, id];
        console.log("【前端】最终删除 ids:", ids);

        // 异步执行软删除
        patch("/api/doc", { ids, data: { isDeleted: true } }).then(
          (resData: IAjaxRes) => {
            if (resData.errno !== 0) {
              toast({
                variant: "destructive",
                description: resData.msg || "删除失败",
              });
              return;
            }
            toast({
              description: `已删除 ${ids.length} 个文档，放在回收站`,
            });
          },
        );
        console.log("【前端】fetch 已调用，等待响应...");

        // 更新 list
        const remainList = list.filter((i) => !ids.includes(i.id));
        setList(remainList);

        // 跳转页面
        if (id === paramId) {
          const length = remainList.length;
          if (length === 0) nav("0");
          else nav(remainList[length - 1].id);
        }

        console.log("【前端】deleteDoc 执行完成");
      } catch (err) {
        console.error("❌ deleteDoc 报错:", err);
      }
    },
    [list, toast, paramId],
  );

  // 删除文档 - 绑定自定义事件（调试版）
  useEffect(() => {
    function handleDel(payload: any) {
      // 1) 原始 payload 打印（完整对象）
      console.log("🔔 [debug] handleDel payload:", payload);

      const { id } = payload || {};
      console.log("🔔 [debug] received id:", id, "typeof id:", typeof id);

      // 2) 打印 deleteDoc 的类型与是否相等于全局引用（检测是否被覆盖）
      console.log("🔔 [debug] deleteDoc typeof:", typeof deleteDoc);
      try {
        // 如果是函数，打印函数源码前 80 字符（便于排查是否为 stub）
        if (typeof deleteDoc === "function") {
          console.log(
            "🔔 [debug] deleteDoc preview:",
            deleteDoc.toString().slice(0, 200),
          );
        }
      } catch (e) {
        console.warn("🔔 [debug] preview deleteDoc failed", e);
      }

      // 3) 明确检查 id 有效性并强制调用（try/catch）
      if (!id) {
        console.error(
          "⚠️ [debug] invalid id, will NOT call deleteDoc",
          payload,
        );
        return;
      }

      // 4) 直接尝试同步调用并捕获异常
      try {
        console.log("🔔 [debug] calling deleteDoc synchronously now...");
        deleteDoc(id);
        console.log("🔔 [debug] after sync deleteDoc call");
      } catch (err) {
        console.error("❌ [debug] deleteDoc threw synchronously:", err);
      }

      // 5) 再试一个异步调用（setTimeout 帮助避开同一事件循环的问题）
      setTimeout(() => {
        try {
          console.log("🔔 [debug] calling deleteDoc via setTimeout...");
          deleteDoc(id);
          console.log("🔔 [debug] after async deleteDoc call");
        } catch (err) {
          console.error("❌ [debug] async deleteDoc threw:", err);
        }
      }, 0);
    }

    emitter.on(EVENT_KEY_DEL_DOC, handleDel);
    return () => {
      emitter.off(EVENT_KEY_DEL_DOC, handleDel);
    };
  }, [deleteDoc]);

  // 监听 isStar 状态变化
  useEffect(() => {
    function handler(payload: any) {
      const { isStar = false, id: docId = "" } = payload;
      if (!docId) return;
      setList((prevList) => {
        return prevList.map((i) => {
          if (i.id === docId) return { ...i, isStar };
          return i;
        });
      });
    }
    emitter.on(EVENT_KEY_CHANGE_IS_STAR, handler);

    return () => emitter.off(EVENT_KEY_CHANGE_IS_STAR, handler); // 及时销毁自定义事件
  }, []);

  // 监听修改标题
  useEffect(() => {
    function handler(payload: any) {
      const { newTitle = "<无标题>", id: docId = "" } = payload;
      if (!docId) return;
      setList((prevList) => {
        return prevList.map((i) => {
          if (i.id === docId) {
            const newDoc = { ...i, title: newTitle };
            return newDoc;
          }
          return i;
        });
      });
    }
    emitter.on(EVENT_KEY_CHANGE_DOC_TITLE, handler);

    return () => emitter.off(EVENT_KEY_CHANGE_DOC_TITLE, handler); // 及时销毁自定义事件
  }, []);

  return { list };
}
