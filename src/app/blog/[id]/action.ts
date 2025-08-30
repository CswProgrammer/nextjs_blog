"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";

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

    if (data.title) {
      // 修改 title 时，重新生成页面
      revalidatePath(`/blog/${uid}`);
    }
  } catch (ex) {
    console.error(ex);
  }
}
