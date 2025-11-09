import { db } from "@/db/db";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/session";

export default async function Work() {
  let user = null;

  try {
    user = await getUserInfo();
  } catch (e) {
    user = null;
  }

  // ✅ 如果登录，则跳转到自己最近编辑的文档
  if (user && user.id) {
    const firstDoc = await db.docBlog.findFirst({
      where: { userId: user.id, isDeleted: false },
      orderBy: { updatedAt: "desc" },
    });

    if (firstDoc) {
      redirect(`/blogs/${firstDoc.id}`);
      return;
    }

    const count = await db.docBlog.count({
      where: { userId: user.id },
    });

    if (count > 0) {
      redirect(`/blogs/0`);
      return;
    }
  }

  // ✅ 未登录：显示所有公开文章
  const allBlogs = await db.docBlog.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">全部文章</h1>
      {allBlogs.length === 0 ? (
        <p className="text-center text-gray-500">还没有任何文章。</p>
      ) : (
        <ul className="space-y-4">
          {allBlogs.map((blog) => (
            <li key={blog.id} className="border-b border-gray-200 pb-2">
              <a
                href={`/blogs/${blog.id}`}
                className="text-blue-600 hover:underline text-lg font-medium"
              >
                {blog.title}
              </a>
              <p className="text-sm text-gray-500 mt-1">
                作者：{blog.user?.name || "匿名"}｜更新于{" "}
                {new Date(blog.updatedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="text-center mt-8">
        <a
          href="/api/auth/signin"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          登录后查看自己的博客 →
        </a>
      </div>
    </div>
  );
}
