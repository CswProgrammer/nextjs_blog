"use client";

import { Popover } from "@/components/ui/popover";

interface IProps {
  id: string;
}

export default function TopBarHandlers(props: IProps) {
  const { id } = props;

  return <Popover></Popover>;
}
