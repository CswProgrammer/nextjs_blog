"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import debounce from "lodash.debounce";

export default function Content(props: { uid: string; content: string }) {
  const [content, setContent] = useState(props.content || "");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value;
    setContent(newContent);
  }

  return (
    <Textarea
      readOnly
      value={content}
      className="border-none p-0 text-base focus-visible:ring-transparent resize-none bg-transparent"
      style={{ width: "100%", height: "600px" }}
    />
  );
}
