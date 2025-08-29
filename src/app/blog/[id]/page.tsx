// src/app/blog/page.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/db/db";

async function getDoc(uid: string) {
  try {
    const doc = await db.docBlog.findUnique({
      where: { uid },
    });
    return doc;
  } catch (ex) {
    return null;
  }
}

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
        <div className="max-w-[900px] mx-auto my-7 h-[2000px]">
          <h1 className="scroll-m-20 font-bold tracking-tight lg:text-5xl">
            {doc.title}
          </h1>
          <div>Blog Page, uid: {params.id}</div>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {doc.content || "<无内容>"}
          </p>
        </div>
      </ScrollArea>
    </>
  );
}
