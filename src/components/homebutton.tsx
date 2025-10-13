"use client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Link href="/" passHref>
      <Button
        variant="ghost"
        className="w-full justify-start px-2 text-muted-foreground hover:text-secondary-foreground"
      >
        <Home className="h-4 w-4 mr-2" />
        首页
      </Button>
    </Link>
  );
}
