// 判断是否展示子节点
import emitter from "@/lib/emitter";

export function isShowChildren(
  id: string,
  paramId: string,
  list: Array<{ id: string; parentId: string | null }>,
) {
  let curId = paramId;
  while (curId) {
    curId = list.find((i) => i.id === curId)?.parentId || ""; // 父节点
    if (curId === id) return true;
  }
  return false;
}

// 跳转链接 切换文档
export function nav(id: string) {
  const url = `/blog_update/${id}`;
  emitter.emit("NAV_DOC", { id });
  history.pushState({ docId: id }, "", url);
}
if (typeof window !== "undefined") {
  const handlePopState = (event: PopStateEvent) => {
    emitter.emit("NAV_DOC", { id: event.state.docId });
  };
  window.addEventListener("popstate", handlePopState); // 只能绑定一次
}
