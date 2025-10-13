"use client";

import { Button } from "@/components/ui/button";
import { post } from "@/lib/ajax";

export default function SignOutButton({
  children,
  className,
  size,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "lg";
  variant?:
    | "secondary"
    | "ghost"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | null;
}) {
  async function onClick() {
    const c = confirm("是否退出登录？");
    if (!c) return;

    try {
      await post("/api/user/sign-out", {}); //后端登出
    } catch (e) {}
    console.log("sign out");
    location.href = "/"; //前端登出跳转主页
  }
  return (
    <div className="w-full">
      <Button
        className={className}
        size={size}
        variant={variant}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
}
