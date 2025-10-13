"use server";

import { db } from "@/db/db";
import { redirect } from "next/navigation";

export async function create(formData: FormData) {
  const userId = formData.get("userId") as string;
  if (!userId) {
    throw new Error("未登录");
  }
  const newDoc = await db.docBlog.create({
    data: {
      title: "新建Blog " + Date.now().toString().slice(-4),
      content: "",
      category: "",
      user: {
        connect: { id: userId }, // 或已存在的用户
      },
    },
  });
  redirect(`/blog_update/${newDoc.id}`);
}

export async function getDocList() {
  const list = db.docBlog.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      id: "asc",
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
  const otherId = idList.find((id) => id !== id);

  redirect(`/blog_update/${otherId}`); // 删除以后，定位到其他文档
}
