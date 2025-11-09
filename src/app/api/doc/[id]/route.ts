import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from "@/app/api/utils/gen-res-data";
import { error } from "console";

// 获取单个 doc 内容
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUserInfo();
  // if (user == null) return Response.json(genUnAuthData());

  const { id } = params;
  const doc = await db.docBlog.findUnique({
    // where: { id, userId: user.id, isDeleted: false },
    where: { id, isDeleted: false },
  });

  if (doc == null) {
    return Response.json(genErrorData("Doc not found"));
  }
  return Response.json(genSuccessData(doc));
}

// 更新单个 doc 内容
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const { id } = params;
  const body = await request.json();
  console.log("【后端】收到更新", id); // ← 必须打印

  try {
    await db.docBlog.update({
      where: { id, userId: user.id, isDeleted: false },

      data: body,
    });

    return Response.json(genSuccessData());
  } catch (ex) {
    console.error("Update doc error", ex);
    return Response.json(genErrorData("更新失败"));
  }
}
