import { ScrollArea } from "@radix-ui/react-scroll-area";
import Title from "./title";
import Content from "./content";
import { getDoc } from "./action";

export default async function BlogRead({ params }: { params: { id: string } }) {
  const uid = params.id;
  const doc = await getDoc(uid);
  if (doc == null)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文档...</p>
      </div>
    );
  return (
    <>
      <ScrollArea className="h-[calc(100vh-46px)]">
        <div className="max-w-[900px] mx-auto my-10">
          <Title uid={uid} title={doc.title} />
          <Content uid={uid} content={doc.content} />
        </div>
      </ScrollArea>
    </>
  );
}
