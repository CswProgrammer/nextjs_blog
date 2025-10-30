import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from "@/app/api/utils/gen-res-data";
import { NextRequest } from "next/server";
import { MAX_DOC_COUNT } from "@/constants";

// 创建 doc
export async function POST(request: Request) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  // 当前文档数量
  const docCount = await db.docBlog.count({
    where: {
      userId: user.id,
      isDeleted: false || null,
    },
  });
  if (docCount > MAX_DOC_COUNT) {
    return Response.json(genErrorData(`最多只能创建 ${MAX_DOC_COUNT} 个文档`));
  }

  const body = await request.json();
  let {
    originId,
    id = undefined,
    title = "",
    content = "",
    parentId = null,
  } = body;

  console.log("【后端】创建文档前", id, parentId, user.id);

  // 从 originId 复制一个
  if (originId) {
    const originDoc = await db.docBlog.findUnique({
      where: { id: originId },
    });
    if (originDoc == null) {
      return Response.json(genErrorData("Origin doc not found"));
    }

    title = originDoc.title + " 复制";
    content = originDoc.content;
    parentId = originDoc.parentId;
  }

  // 创建 doc
  try {
    const doc = await db.docBlog.create({
      data: {
        id, // 用前端传来的 id
        title,
        content,
        parentId,
        category: "默认分类",
        userId: user.id!,
      },
    });
    console.log("【后端】创建文档后", id, parentId, user.id);
    return Response.json(genSuccessData(doc));
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

  // 是否软删除
  const isDeletedParam = searchParams.get("isDeleted"); // '0' 或 '1'
  let isDeleted: boolean | null = null;
  if (isDeletedParam === "0") isDeleted = false;
  if (isDeletedParam === "1") isDeleted = true;

  // 彻底删除 回收站 30 天之前的文档
  if (isDeleted) {
    await deleteDocsBefore30Days();
  }

  // 是否收藏
  let isStarParam = searchParams.get("isStar"); // '0' 或 '1'
  let isStar: boolean | null = null;
  if (isStarParam === "0") isStar = false;
  if (isStarParam === "1") isStar = true;

  // 搜索关键字
  const keyword = searchParams.get("keyword") || null;

  // where
  const whereOpt: any = {};
  if (isDeleted != null) {
    if (isDeleted) {
      whereOpt.isDeleted = true;
    } else {
      whereOpt.isDeleted = false || null;
    }
  }
  if (isStar != null) {
    if (isStar) {
      whereOpt.isStar = true;
    } else {
      whereOpt.isStar = false || null;
    }
  }
  if (keyword != null) {
    whereOpt.title = {
      contains: keyword,
    };
  }

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
      ...whereOpt,
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

// 回收站 30 天之前的文档，彻底删除
async function deleteDocsBefore30Days() {
  const user = await getUserInfo();
  if (user == null) return;

  const now = new Date();
  const before30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  await db.docBlog.deleteMany({
    where: {
      userId: user.id,
      isDeleted: true,
      updatedAt: {
        lt: before30Days,
      },
    },
  });
}
