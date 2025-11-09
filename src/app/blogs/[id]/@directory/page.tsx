import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "auth";

import { getDocList } from "./action";
import List from "./list";

export default async function Directory({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const userId = session?.user?.id ?? "system"; // 兜底系统用户

  const list = await getDocList();
  console.log("Directory list:", list);
  return <List defaultList={list} defaultParamId={params.id} />;
}
