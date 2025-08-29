"use client";
import Logo from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";
import ChangeTheme from "./changetheme";

export default function HomeNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-12 px-2 bg-white dark:bg-black text-black dark:text-white shadow-sm overflow-visible">
      <nav className="flex items-center h-full space-x-2">
        {/* Logo */}
        <div className="flex-none">
          <Logo />
        </div>
        {/* 三个按钮：深色背景也纯黑，hover 用深灰 */}
        {["Blog", "Project", "Me"].map((label, i) => {
          const href = label === "Blog" ? "/blog/1" : `/${label.toLowerCase()}`;
          return (
            <Button
              key={i}
              asChild
              variant="ghost"
              className="flex-1 text-lg font-bold
                 text-black dark:text-white
                 bg-white dark:bg-black
                 hover:bg-gray-100 dark:hover:bg-gray-900
                 rounded-none"
            >
              <Link href={href}>{label}</Link>
            </Button>
          );
        })}
        {/* GitHub & 主题切换 */}
        <div className="flex-none flex items-center space-x-2">
          <ChangeTheme />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-black dark:text-white bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <a
              href="https://github.com/yourname"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
