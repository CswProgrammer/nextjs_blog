"use client";

import { useState } from "react";
import { post } from "@/lib/ajax";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const res = await post("/api/user/invitation-code", { code });
    if (res.errno !== 0) {
      alert(res.msg || "验证失败");
      setLoading(false);
      return;
    }

    alert("验证成功");
    location.href = "/";
  }

  return (
    <div className="flex space-x-2 w-60 mx-auto">
      <Input
        placeholder="请输入邀请码"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={onClick} disabled={loading}>
        提交
      </Button>
    </div>
  );
}
