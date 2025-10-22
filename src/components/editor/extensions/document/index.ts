import { Document as TiptapDocument } from "@tiptap/extension-document";
//放宽松绑，允许columns作为顶级节点
export const Document = TiptapDocument.extend({
  content: "(block|columns)+",
});

export default Document;
