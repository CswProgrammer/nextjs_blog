"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

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

export async function getDoc(id: string) {
  try {
    const doc = await db.docBlog.findUnique({
      where: { id },
    });
    return doc;
  } catch (ex) {
    return null;
  }
}
