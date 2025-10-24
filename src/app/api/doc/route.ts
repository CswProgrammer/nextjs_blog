import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from "@/app/api/utils/gen-res-data";

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
  const { ids = [] } = body;
  console.log("【后端】收到删除", ids); // ← 必须打印

  try {
    const res = await db.docBlog.updateMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
      data: {
        isDeleted: true,
      },
    });
    console.log("【后端】update条件", { ids, userId: user.id });
    console.log("【后端】软删除影响行数", res.count); // 应该 > 0

    return Response.json(genSuccessData({ affected: res.count }));
  } catch (ex) {
    console.error("Delete docs error", ex);
    return Response.json(genErrorData("Delete docs error"));
  }
}
