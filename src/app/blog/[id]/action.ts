"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { getDocList } from "./@directory/action";
import { redirect } from "next/navigation";

export async function getDoc(uid: string) {
  try {
    const doc = await db.docBlog.findUnique({
      where: { uid },
    });
    return doc;
  } catch (ex) {
    return null;
  }
}

export async function updateDoc(
  uid: string,
  data: { title?: string; content?: string },
) {
  try {
    await db.docBlog.update({
      where: { uid },
      data,
    });

    revalidatePath(`/blog/${uid}`);
  } catch (ex) {
    console.error(ex);
  }
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
