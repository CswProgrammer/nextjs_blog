// src/app/me/page.tsx
export default function MePage() {
  return (
    <main className="max-w-2xl mx-auto p-8 text-slate-800 dark:text-slate-200">
      <h1 className="text-4xl font-extrabold mb-8">About Me</h1>

      <section className="space-y-6">
        {/* 个人简介 */}
        <p className="text-lg leading-relaxed">
          我是一名全栈开发者，热爱用简洁的代码解决复杂的问题。
        </p>

        {/* 后端 */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Backend</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Java & Spring Boot</li>
            <li>Hono.js</li>
          </ul>
        </div>

        {/* 前端 */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Frontend</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>React / Next.js 14</li>
            <li>Vue 3 + Vite</li>
          </ul>
        </div>

        {/* 数据库 */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Database</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>MySQL & Oracle</li>
            <li>Redis</li>
          </ul>
        </div>

        {/* 部署 */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Deployment</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>阿里云 ECS / CDN</li>
            <li>Vercel</li>
            <li>宝塔面板</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
