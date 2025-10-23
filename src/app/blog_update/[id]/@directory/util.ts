// 判断是否展示子节点
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
