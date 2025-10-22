// middleware.ts
export { auth as middleware } from "auth";

// ⚠️ 注意这里的正则要严格排除 /api/**
export const config = {
  matcher: [
    "/((?!api/|_next/|favicon.ico).*)", // ✅ 这样才能真正排除 /api/*
  ],
};
