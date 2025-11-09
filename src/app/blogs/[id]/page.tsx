import Content from "./(content)/content";
import { getDoc } from "./action";
import AIIsland from "@/components/editor/ai-island/index";

export default async function BlogWork({ params }: { params: { id: string } }) {
  const id = params.id;

  const doc = await getDoc(id);
  const notFound = !doc;
  const { title = "", content = "", isStar = false } = doc || {};

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
