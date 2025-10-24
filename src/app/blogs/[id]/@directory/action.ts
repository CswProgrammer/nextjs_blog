"use server";

import { db } from "@/db/db";
import { getUserInfo } from "@/lib/session";
import { redirect } from "next/navigation";

export async function getDocList() {
  const user = await getUserInfo();
  if (user == null) return [];

  const list = db.docBlog.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
    },
    //查询未删除的文档
    where: {
      userId: user.id || "",
      isDeleted: false || null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return list || [];
}
