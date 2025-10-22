import { FileText } from "lucide-react";
import CreateSubmitButton from "./createsubmitbutton";
import { create, getDocList } from "./action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Item from "./item";
import { auth } from "auth";

export default async function Directory({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const userId = session?.user?.id ?? "system"; // 兜底系统用户

  const list = await getDocList();

  return (
    <>
      {list.map((doc) => {
        const { id, title } = doc;
        let isCurrent = false;
        if (id === params.id) isCurrent = true;

        return <Item key={id} id={id} title={title} isCurrent={isCurrent} />;
      })}

      <form action={create}>
        <input type="hidden" name="userId" value={userId} />
        <CreateSubmitButton />
      </form>
    </>
  );
}
