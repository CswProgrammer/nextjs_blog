import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genErrorData,
  genSuccessData,
  genUnAuthData,
} from "../../utils/gen-res-data";

// 验证邀请码
export async function POST(request: Request) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());
  // @ts-ignore
  if (user.isInvited) return Response.json(genErrorData("已经被邀请"));

  const { email } = user;
  const body = await request.json();
  const { code } = body;

  // 根据 email 和 code 查找
  try {
    const res = await db.invitationCode.findFirst({
      where: { code },
    });
    // 未找到邀请码
    if (res == null) {
      return Response.json(genErrorData("邀请码无效"));
    }
  } catch (err) {
    return Response.json(genErrorData("获取邀请码错误"));
  }

  // 更新用户信息
  await db.user.update({
    where: { email: email || "" },
    data: { isInvited: true },
  });

  return Response.json(genSuccessData());
}
