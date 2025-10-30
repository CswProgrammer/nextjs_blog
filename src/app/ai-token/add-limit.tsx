"use client";

import { Button } from "@/components/ui/button";
import { post } from "@/lib/ajax";

export default function AddLimit() {
  async function handleClick() {
    const res = await post("/api/gpt/token-usage/add-limit", {});
    if (res.errno !== 0) {
      alert(res.msg);
      return;
    }
    alert("领取成功");
    location.reload(); // 刷新页面
  }

  return (
    <Button size="sm" onClick={handleClick}>
      领取 token
    </Button>
  );
}
