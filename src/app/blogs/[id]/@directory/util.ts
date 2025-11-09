// 判断是否展示子节点
import emitter from "@/lib/emitter";
import { EVENT_KEY_NAV_DOC } from "@/constants";
import { IDoc } from "./type";

// 判断一个节点，是否是另一个节点的下级
export function isDescendant(id: string, descendantId: string, list: IDoc[]) {
  let curId = descendantId;
  while (curId) {
    curId = list.find((i) => i.id === curId)?.parentId || ""; // 父节点
    if (curId === id) return true;
  }
  return false;
}

// 跳转链接 切换文档
export function nav(id: string, type: "nav" | "create" = "nav") {
  const url = `/blogs/${id}`;
  emitter.emit(EVENT_KEY_NAV_DOC, { id, type });

  emitter.emit("NAV_DOC", { id, type });
  history.pushState({ docId: id }, "", url);
}
if (typeof window !== "undefined") {
  const handlePopState = (event: PopStateEvent) => {
    emitter.emit(EVENT_KEY_NAV_DOC, { id: event.state.docId });
  };
  window.addEventListener("popstate", handlePopState); // 只能绑定一次
}

export function getDescendantsIds(rootId: string, list: IDoc[]) {
  const map = new Map(list.map((i) => [i.id, i]));
  const res: string[] = [];

  function dfs(id: string) {
    for (const doc of list) {
      if (doc.parentId === id) {
        res.push(doc.id);
        dfs(doc.id); // 递归找子
      }
    }
  }

  dfs(rootId); // 从根开始
  return res; // 不含 rootId 自身
}
