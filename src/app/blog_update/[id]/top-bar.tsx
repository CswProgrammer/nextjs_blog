"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/logo";
import ChangeTheme from "@/components/changetheme";
import { Button } from "@/components/ui/button";
import { Forward, Star } from "lucide-react";
import DocHandlers from "@/components/doc-handlers";
import emitter from "@/lib/emitter";
import { EVENT_KEY_NAV_DOC } from "@/constants";

interface IProps {
  defaultId: string;
}

export default function TopBar(props: IProps) {
  const { defaultId } = props;

  const [id, setId] = useState(defaultId);

  useEffect(() => {
    function handler(payload: any) {
      const { id } = payload || {};
      if (!id) return;
      setId(id);
    }
    emitter.on(EVENT_KEY_NAV_DOC, handler);
    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, handler); // 及时销毁自定义事件
    };
  }, []);

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1 border-b">
      <div className="text-start inline-flex items-center">
        <Logo />
      </div>
      <div className="flex-1 text-end">
        {/* 后续再拆分组件 */}
        <div className="inline-flex items-center">
          {/* <Button variant="ghost" size="sm">
            <Forward className="h-4 w-4" />
            &nbsp;分享
          </Button> */}
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-1" />
            收藏
          </Button>
          <DocHandlers
            id={id}
            triggerButtonClassName="px-3 h-9 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md"
          />
          <ChangeTheme />
        </div>
      </div>
    </div>
  );
}
