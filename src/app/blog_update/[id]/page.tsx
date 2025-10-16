import { ScrollArea } from "@/components/ui/scroll-area";
import Content from "./content";
import { getDoc } from "./action";
import Title from "./title";

export default async function BlogWork({ params }: { params: { id: string } }) {
  const id = params.id;

  const doc = await getDoc(id);

  if (doc == null)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文档...</p>
      </div>
    );

  return (
    <>
      <div className="max-w-[900px] mx-auto my-10">
        <Title id={id} title={doc.title} />
        <Content id={id} content={doc.content} />
      </div>
    </>
  );
}
