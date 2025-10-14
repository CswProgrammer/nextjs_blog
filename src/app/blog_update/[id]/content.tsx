"use client";

import { useState } from "react";
import debounce from "lodash.debounce";
import { updateDoc } from "./action";
import TiptapEditor from "@/components/editor";

const saveContent = debounce((id: string, content: string) => {
  updateDoc(id, { content });
}, 1000);

export default function Content(props: { id: string; content: string }) {
  const [content, setContent] = useState(props.content || "");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value;
    setContent(newContent);
    saveContent(props.id, newContent);
  }

  return <TiptapEditor />;
}
