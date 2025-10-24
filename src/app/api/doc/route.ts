import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from "@/app/api/utils/gen-res-data";
import { NextRequest } from "next/server";

// 创建 doc
export async function POST(request: Request) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const body = await request.json();
  const { id = undefined, title = "", content = "", parentId = null } = body;

  try {
    await db.docBlog.create({
      data: {
        title,
        content,
        parentId,
        category: "默认分类",
        userId: user.id!,
      },
    });
    return Response.json(genSuccessData());
  } catch (ex) {
    console.error("Create doc error", ex);
    return Response.json(genErrorData("Create doc error"));
  }
}

// 软删除 多个 docs
console.log("【后端】PATCH 路由命中");
export async function PATCH(request: Request) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const body = await request.json();
  const { ids = [], data = {} } = body;

  console.log("【后端】收到删除", ids); // ← 必须打印

  try {
    const res = await db.docBlog.updateMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
      data,
    });
    return Response.json(genSuccessData());
  } catch (ex) {
    console.error("Delete docs error", ex);
    return Response.json(genErrorData("Delete docs error"));
  }
}

// 获取多个 docs
export async function GET(request: NextRequest) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const searchParams = request.nextUrl.searchParams;
  const isDeleted = searchParams.get("isDeleted"); // 是否软删除

  const list = await db.docBlog.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      userId: user.id || "",
      isDeleted: !!isDeleted,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.json(genSuccessData(list || []));
}

// 删除多个 docs
export async function DELETE(request: NextRequest) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const body = await request.json();
  const { ids = [] } = body;

  try {
    // 真实删除
    await db.docBlog.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    });
    console.log("【后端】update条件", { ids, userId: user.id });
  } catch (ex) {
    console.error("Delete docs error", ex);
    return Response.json(genErrorData("Delete docs error"));
  }
}
