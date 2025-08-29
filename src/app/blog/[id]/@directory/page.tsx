import { FileText } from "lucide-react";
import CreateSubmitButton from "./createsubmitbutton";
import { create, getDocList } from "./action";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Directory({
  params,
}: {
  params: { id: string };
}) {
  const list = await getDocList();

  return (
    <div>
      {list.map((doc) => {
        const { uid, title } = doc;
        let isCurrent = false;
        if (uid === params.id) isCurrent = true;

        return (
          <Link
            href={`/blog/${uid}`}
            key={uid}
            className={cn(
              "inline-flex items-center w-full p-2 py-1 cursor-pointer hover:text-secondary-foreground",
              isCurrent ? "bg-card" : "hover:bg-card",
            )}
          >
            <FileText className="h-4 w-4" />
            &nbsp;{title}
          </Link>
        );
      })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  );
}
