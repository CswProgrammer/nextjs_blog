import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateIsStar } from "@/app/blog_update/[id]/(content)/client-action";
import emitter from "@/lib/emitter";
import { EVENT_KEY_CHANGE_IS_STAR } from "@/constants";
import { useToast } from "@/components/ui/use-toast";

interface IProps {
  id: string;
  defaultIsStar?: boolean;
  className?: string;
}

export default function StarDocButton(props: IProps) {
  const { id, defaultIsStar = false, className = "" } = props;
  const { toast } = useToast();

  // 监听 isStar 状态
  const [isStar, setIsStar] = useState(defaultIsStar);
  useEffect(() => {
    function handler(payload: any) {
      const { isStar = false, id: docId = "" } = payload;
      if (docId === id) setIsStar(isStar);
    }
    emitter.on(EVENT_KEY_CHANGE_IS_STAR, handler);
    return () => emitter.off(EVENT_KEY_CHANGE_IS_STAR, handler); // 及时销毁自定义事件
  }, [id]);

  async function handleUpdateIsStar() {
    const newIsStar = !isStar;

    // 异步更新数据库
    const res = await updateIsStar(id, newIsStar);
    if (res.errno !== 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: res.msg,
      });
      return;
    }

    // 广播事件
    emitter.emit(EVENT_KEY_CHANGE_IS_STAR, { isStar: newIsStar, id });
  }

  return (
    <Button
      variant={isStar ? "secondary" : "ghost"}
      size="sm"
      onClick={handleUpdateIsStar}
      className={cn("focus-visible:ring-transparent", className)}
    >
      <Star className="h-4 w-4 mr-1" />
      {isStar ? "已收藏" : "收藏"}
    </Button>
  );
}
