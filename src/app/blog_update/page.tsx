import { db } from "@/db/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

export default async function Work() {
  let pathname = "/blog_update/0";

  const user = await getUserInfo();
  if (user && user.id) {
    const firstDoc = await db.docBlog.findFirst({
      where: { userId: user.id, isDeleted: false || null },
      orderBy: {
        updatedAt: "desc",
      },
    });
    if (firstDoc != null) pathname = `/blog_update/${firstDoc?.id}`; // 找到第一篇文档，然后跳转过去
  }

  redirect(pathname);
}
