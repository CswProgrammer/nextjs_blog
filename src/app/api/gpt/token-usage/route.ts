import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from "@/app/api/utils/gen-res-data";
import { isSameMonth } from "@/lib/dt";
import { AI_DEFAULT_TOKEN_LIMIT } from "@/constants";

export async function GET(request: Request) {
  const user = await getUserInfo();
  if (user == null || !user.id) return Response.json(genUnAuthData());

  let tokenUsage = await db.tokenUsage.findUnique({
    where: {
      userId: user.id,
    },
  });

  // 如果没有记录，创建一个
  if (tokenUsage == null) {
    tokenUsage = await db.tokenUsage.create({
      data: {
        userId: user.id,
      },
    });
  }
  const { tokensLimit, updateLimitAt } = tokenUsage;

  // 是否月初需要重置？
  if (!isSameMonth(updateLimitAt) && tokensLimit < AI_DEFAULT_TOKEN_LIMIT) {
    tokenUsage = await db.tokenUsage.update({
      where: { id: tokenUsage.id },
      data: { tokensLimit: AI_DEFAULT_TOKEN_LIMIT, updateLimitAt: new Date() },
    });
  }

  return Response.json(genSuccessData(tokenUsage));
}

export async function POST(request: Request) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  const body = await request.json();
  const { total_tokens } = body || {};

  const tokenUsage = await db.tokenUsage.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (tokenUsage == null)
    return Response.json(genErrorData("tokenUsage not found"));

  const { tokensLimit, totalTokens } = tokenUsage;
  const newTotalTokens = totalTokens + total_tokens;
  let newTokensLimit = tokensLimit - total_tokens;
  if (newTokensLimit < 0) newTokensLimit = 0;

  await db.tokenUsage.update({
    where: {
      userId: user.id,
    },
    data: {
      totalTokens: newTotalTokens,
      tokensLimit: newTokensLimit,
    },
  });
  return Response.json(genSuccessData());
}
