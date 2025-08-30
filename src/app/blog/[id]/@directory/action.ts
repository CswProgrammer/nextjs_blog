"use server";

import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function create() {
  const newDoc = await db.docBlog.create({
    data: {
      title: "新建Blog " + Date.now().toString().slice(-4),
      content: "",
      category: "",
    },
  });
  redirect(`/blog/${newDoc.uid}`);
}

export async function getDocList() {
  const list = db.docBlog.findMany({
    select: {
      id: true,
      uid: true,
      title: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  return list || [];
}

export async function del(uid: string) {
  // 删除
  await db.docBlog.delete({
    where: {
      uid,
    },
  });

  const list = await getDocList();
  const uidList = list.map((doc) => doc.uid);
  const otherUid = uidList.find((id) => id !== uid);

  redirect(`/blog/${otherUid}`); // 删除以后，定位到其他文档
}
