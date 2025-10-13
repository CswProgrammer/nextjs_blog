"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { redirect } from "next/navigation";

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
