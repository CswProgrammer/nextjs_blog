"use client";

import { useState, useEffect, useCallback } from "react";
import Logo from "@/components/logo";
import ChangeTheme from "@/components/changetheme";
import { Forward, Check, PencilLine } from "lucide-react";

import TopBarHandlers from "./top-bar-handlers";

import emitter from "@/lib/emitter";
import { EVENT_KEY_NAV_DOC } from "@/constants";

import DocUpdateStatus from "./doc-blog-status";
import StarDocButton from "@/components/star-doc-button";

interface IProps {
  defaultId: string;
}

export default function TopBar(props: IProps) {
  const { defaultId } = props;

  const [id, setId] = useState(defaultId);

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1 border-b">
      <div className="text-start inline-flex items-center">
        <Logo />
        <DocUpdateStatus id={id} />
      </div>
      <div className="flex-1 text-end">
        {/* 后续再拆分组件 */}
        <div className="inline-flex items-center">
          {/* <Button variant="ghost" size="sm">
            <Forward className="h-4 w-4" />
            &nbsp;分享
          </Button> */}
          <StarDocButton id={id} />

          <TopBarHandlers id={id} />
          <ChangeTheme />
        </div>
      </div>
    </div>
  );
}
