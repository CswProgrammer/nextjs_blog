import Content from "./(content)/content";
import { getDoc } from "./action";
import AIIsland from "@/components/editor/ai-island/index";

import { CONTENT_WIDTH } from "@/constants";

export default async function BlogWork({ params }: { params: { id: string } }) {
  const id = params.id;

  const doc = await getDoc(id);
  const notFound = !doc;
  const { title = "", content = "", isStar = false } = doc || {};
  const fullWidth = CONTENT_WIDTH + 80; // 两边留白 40px

  return (
    <Content
      defaultId={id}
      defaultTitle={title}
      defaultContent={content}
      defaultNotFound={notFound}
      defaultIsStar={isStar}
    />
  );
}
