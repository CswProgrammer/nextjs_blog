"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IDoc } from "./[id]/@directory/type";
import { timeAgo } from "@/lib/dt";
import { getDescendantsIds } from "./[id]/@directory/util";
import { getDoc, updateParentId } from "./[id]/(content)/client-action";
import { get, patch, del as ajaxDelete } from "@/lib/ajax";

export default function Trash() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2  h-8" variant="ghost">
          <Trash2 className="h-4 w-4" />
          &nbsp;&nbsp;回收站
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>回收站</DialogTitle>
          <DialogDescription asChild>
            <TrashTable />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function TrashTable() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IDoc[]>([]);

  // 加载数据
  const load = useCallback(async () => {
    const url = `/api/doc?isDeleted=1`;
    const { data: list } = await get(url);
    return list;
  }, []);

  useEffect(() => {
    load().then((l) => {
      setList(l);
      setLoading(false);
    });
  }, [load]);

  // 搜索关键字
  const [keyword, setKeyword] = useState("");
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
  }

  // 恢复
  async function restore(id: string, parentId: string | null) {
    // 判断 parentId 文档是否还存在，可能被删除了
    if (parentId) {
      const parentDoc = await getDoc(parentId);
      if (parentDoc == null) {
        // 未找到 parentDoc ，则先设置 parentId 未 null
        await updateParentId(id, null);
      }
    }

    // 所有下级文档
    const descendantsIds = getDescendantsIds(id, list);
    const ids = [...descendantsIds, id];

    const { errno, msg } = await patch("/api/doc", {
      ids,
      data: { isDeleted: null },
    });
    if (errno === 0) {
      router.push(`/work/${id}`);
    } else {
      toast({
        variant: "destructive",
        description: msg || "执行失败",
      });
    }
  }

  // 彻底删除
  function del(id: string) {
    if (!confirm("是否彻底删除该文档？删除后不可恢复")) return;
    const descendantsIds = getDescendantsIds(id, list);
    const ids = [...descendantsIds, id];

    // 异步删除
    ajaxDelete("/api/doc", { ids });

    // 更新列表
    setList(list.filter((d) => !ids.includes(d.id)));
  }

  if (loading) {
    return (
      <div className="h-96">
        <p className="mt-10 text-center text-muted-foreground">loading...</p>
      </div>
    );
  }

  if (!loading && list.length === 0) {
    return (
      <div className="h-96">
        <p className="mt-10 text-center text-muted-foreground">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="h-96 overflow-y-auto">
      <div className="my-2">
        <Input
          value={keyword}
          onChange={handleChange}
          maxLength={20}
          placeholder="搜索标题..."
          className="focus-visible:ring-transparent"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">标题</TableHead>
            <TableHead>删除时间</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list
            .filter((i) => i.title.includes(keyword))
            .map((doc) => (
              <TableRow key={doc.id} className="group">
                <TableCell>
                  <p className="w-48 overflow-hidden truncate">
                    {doc.title || "<无标题>"}
                  </p>
                </TableCell>
                <TableCell>{timeAgo(doc.updatedAt || "")}</TableCell>
                <TableCell>
                  <div className="inline-flex space-x-1 invisible group-hover:visible">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => restore(doc.id, doc.parentId)}
                    >
                      恢复
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => del(doc.id)}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
