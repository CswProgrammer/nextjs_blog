"use server";

import { db } from "@/db/db";
import { redirect } from "next/navigation";

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
