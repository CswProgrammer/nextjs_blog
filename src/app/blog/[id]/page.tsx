// src/app/blog/page.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/db/db";
import Content from "./content";
import { getDoc } from "./action";
import Title from "./title";

export default async function BlogWork({ params }: { params: { id: string } }) {
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
        <div className="max-w-[900px] mx-auto my-10 h-[2000px]">
          <Title uid={uid} title={doc.title} />
          <Content uid={uid} content={doc.content} />
        </div>
      </ScrollArea>
    </>
  );
}
