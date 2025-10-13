import "server-only"; // 标记只在服务端使用（客户端组件引入会报错）
import { auth } from "auth";

export async function getUserInfo() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user; // 格式如 { id, name, email, image }
}
