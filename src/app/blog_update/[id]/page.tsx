import Content from "./(content)/content";
import { getDoc } from "./action";

export default async function BlogWork({ params }: { params: { id: string } }) {
  const id = params.id;

  const doc = await getDoc(id);
  if (!doc)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文档...</p>
      </div>
    );

  return (
    <>
      <div className="max-w-[980px] mx-auto my-10">
        <Content
          id={id}
          defaultTitle={doc.title}
          defaultContent={doc.content}
        />
      </div>
    </>
  );
}
