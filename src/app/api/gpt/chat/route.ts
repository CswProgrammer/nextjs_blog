import { type NextRequest } from "next/server";
import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import { genErrorData, genUnAuthData } from "../../utils/gen-res-data";

const ORIGIN = process.env.GPT_API_PROXY_ORIGIN || "";
const TOKEN = process.env.GPT_API_PROXY_AUTH_TOKEN || "";

export async function GET(request: NextRequest) {
  const user = await getUserInfo();
  if (user == null) return Response.json(genUnAuthData());

  // 检查 token limit
  const tokenUsage = await db.tokenUsage.findUnique({
    where: { userId: user.id },
  });
  if (tokenUsage == null)
    return Response.json(genErrorData("tokenUsage not found"));
  const { tokensLimit } = tokenUsage;
  if (tokensLimit <= 0) return Response.json(genErrorData("No token left"));

  // 转发请求
  if (ORIGIN) {
    const url = new URL("/api/gpt/chat", ORIGIN);
    const searchParams = request.nextUrl.searchParams;

    for (const [key, value] of searchParams) {
      url.searchParams.set(key, value);
    }
    url.searchParams.set("x-auth-token", TOKEN); // Add auth token
    return Response.redirect(url); // 302 redirect
  }

  return Response.json(genErrorData("GPT_API_PROXY_ORIGIN is not set"));
}
