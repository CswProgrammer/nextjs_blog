"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { getDocList } from "./@directory/action";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

export async function getDoc(id: string) {
  const user = await getUserInfo();
  if (user == null) return null;

  try {
    const doc = await db.docBlog.findUnique({
      where: { id, userId: user.id, isDeleted: false },
    });
    return doc;
  } catch (ex) {
    return null;
  }
}

export async function updateDoc(
  id: string,
  data: { title?: string; content?: string },
) {
  try {
    await db.docBlog.update({
      where: { id: id },
      data,
    });

    revalidatePath(`/blog_update/${id}`);
  } catch (ex) {
    console.error(ex);
  }
}

export async function del(uid: string) {
  // 删除
  await db.docBlog.delete({
    where: {
      id: uid,
    },
  });

  const list = await getDocList();
  const uidList = list.map((doc) => doc.id);
  const otherUid = uidList.find((id) => id !== uid);

  redirect(`/blog_update/${otherUid}`); // 删除以后，定位到其他文档
}
