"use server";

import { db } from "@/db/db";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

export async function getDocList() {
  const user = await getUserInfo();
  if (user == null || user.id === "") return [];
  const list = await db.docBlog.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      isStar: true,
    },
    //查询未删除的文档
    where: {
      userId: user.id,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return list || [];
}
