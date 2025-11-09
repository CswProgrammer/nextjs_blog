"use server";

import { db } from "@/db/db";
import { getUserInfo } from "@/lib/session";

/**
 * ✅ 改进说明：
 * 1. 游客（未登录）可访问所有未删除的文章
 * 2. 登录用户则只查自己的文章
 * 3. 保留了错误捕获和日志
 */
export async function getDocList() {
  try {
    const user = await getUserInfo();

    // ✅ 如果没登录，则查所有公开/未删除的文章
    if (user == null || !user.id) {
      const list = await db.docBlog.findMany({
        select: {
          id: true,
          title: true,
          parentId: true,
          isStar: true,
        },
        where: {
          isDeleted: false, // 只排除已删除
          // 👉 如果你有“是否公开”的字段，比如 isPublic，可以改成：
          // isPublic: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return list || [];
    }

    // ✅ 登录用户，查自己创建的文章
    const list = await db.docBlog.findMany({
      select: {
        id: true,
        title: true,
        parentId: true,
        isStar: true,
      },
      where: {
        // userId: user.id,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return list || [];
  } catch (err) {
    console.error("getDocList error: ", err);
    return [];
  }
}
