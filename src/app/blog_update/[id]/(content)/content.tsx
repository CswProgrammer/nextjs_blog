"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/editor";
import { getDoc, updateContent, updateTitle } from "./client-action";
import emitter from "@/lib/emitter";
import {
  EVENT_KEY_CHANGE_DOC_TITLE,
  EVENT_KEY_NAV_DOC,
  EVENT_KEY_CREATE_DOC,
  EVENT_KEY_CHANGE_UPDATING,
} from "@/constants";

interface IProps {
  defaultId: string;
  defaultTitle: string;
  defaultContent: string;
  defaultNotFound: boolean;
}

export default function Content(props: IProps) {
  const { defaultId, defaultTitle, defaultContent, defaultNotFound } = props;

  const [id, setId] = useState(defaultId);

  // loading
  const [loading, setLoading] = useState(false);

  // 找不到文章
  const [notFound, setNotFound] = useState(defaultNotFound);

  // 标题
  const [title, setTitle] = useState(defaultTitle);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // 更新数据库
    emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: true }); // 标记“修改中”
    updateTitle(id, newTitle);

    // 触发事件，以更新左侧列表的文章标题
    emitter.emit(EVENT_KEY_CHANGE_DOC_TITLE, newTitle);
  }

  // 编辑器内容
  const [editorContent, SetEditorContent] = useState(defaultContent);
  function handleUpdate(content: string) {
    emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: true }); // 标记“修改中”

    updateContent(id, content);
  }

  // 获取文章内容
  useEffect(() => {
    function load(payload: any) {
      const { id, type } = payload || {};
      if (!id) return;
      setId(id); // id改变触发更新 切换 id ，重要！
      setNotFound(false);

      setLoading(true);

      // 刚创建的新文档，不用查询内容（查也是空的）
      if (type === "create") {
        // 用 setTimeout 模拟 loading 效果（还有，不用 setTimeout 无法彻底清除编辑器之前的内容）
        setTimeout(() => {
          setTitle("");
          SetEditorContent("");
          setLoading(false);
        }, 200);
        return;
      }

      getDoc(id).then((data: any) => {
        // 通过 id 找不到 doc
        if (data == null) {
          setNotFound(true);
          return;
        }
        setTitle(data.title);
        SetEditorContent(data.content);
        setLoading(false);
      });
    }
    emitter.on(EVENT_KEY_NAV_DOC, load);

    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, load); // 及时销毁自定义事件
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>
          找不到文档，
          <span
            className="underline cursor-pointer"
            onClick={() => emitter.emit(EVENT_KEY_CREATE_DOC)} //发送消息 事件总线
          >
            创建新文档
          </span>
        </p>{" "}
      </div>
    );
  }

  return (
    <>
      <div className="mx-10 mb-6 pb-4 border-b">
        <Input
          placeholder="请输入标题..."
          value={title}
          maxLength={100}
          onChange={handleChange}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
        />
        {/* 可能还会再增加其他功能，例如设置 Icon 、背景等 */}
      </div>
      <TiptapEditor rawContent={editorContent} handleUpdate={handleUpdate} />
    </>
  );
}
