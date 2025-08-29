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
  });
  return list || [];
}
