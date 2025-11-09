"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { getDocList } from "./@directory/action";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

// ✅【修改1】：getDoc 不再强制要求登录，
// 未登录时直接返回公开文章（isDeleted=false 的即可）
export async function getDoc(id: string) {
  try {
    const doc = await db.docBlog.findFirst({
      where: { id, isDeleted: false },
    });
    return doc;
  } catch (err) {
    console.error("getDoc error: ", err);
    return null;
  }
}

// ✅【保持不变】：更新文档仍需登录才能调用
export async function updateDoc(
  id: string,
  data: { title?: string; content?: string },
) {
  try {
    const user = await getUserInfo();
    if (user == null) throw new Error("未登录用户无法更新文档");

    await db.docBlog.update({
      where: { id: id },
      data,
    });

    revalidatePath(`/blogs/${id}`);
  } catch (ex) {
    console.error(ex);
  }
}

// ✅【保持不变】：删除仍需登录（安全）
export async function del(uid: string) {
  const user = await getUserInfo();
  if (user == null) {
    redirect("/user-info"); // 未登录跳登录页
    return;
  }

  // 删除
  await db.docBlog.delete({
    where: { id: uid },
  });

  const list = await getDocList();
  const uidList = list.map((doc) => doc.id);
  const otherUid = uidList.find((id) => id !== uid);

  redirect(`/blogs/${otherUid}`); // 删除以后，定位到其他文档
}
