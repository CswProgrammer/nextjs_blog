"use server";

import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function getDocList() {
  const list = db.docBlog.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return list || [];
}

export async function del(id: string) {
  // 删除
  await db.docBlog.delete({
    where: {
      id,
    },
  });

  const list = await getDocList();
  const idList = list.map((doc) => doc.id);
  const otherId = idList.find((i) => i !== id);

  redirect(`/blog_update/${otherId}`); // 删除以后，定位到其他文档
}
