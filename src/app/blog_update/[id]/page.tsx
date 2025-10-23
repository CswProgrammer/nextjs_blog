import Content from "./(content)/content";
import { getDoc } from "./action";

export default async function BlogWork({ params }: { params: { id: string } }) {
  const id = params.id;

  const doc = await getDoc(id);
  const notFound = !doc;
  const { title = "", content = "" } = doc || {};

  return (
    <>
      <div className="max-w-[980px] mx-auto my-10">
        <Content
          defaultId={id}
          defaultTitle={title}
          defaultContent={content}
          defaultNotFound={notFound}
        />
      </div>
    </>
  );
}
