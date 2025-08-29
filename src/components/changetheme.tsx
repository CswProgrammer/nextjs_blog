"use client";
import { Sun, Moon } from "lucide-react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ChangeTheme() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          aria-label="切换主题"
          style={{
            padding: 8,
            border: "none",
            borderRadius: "50%",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
          }}
        >
          <Icon size={20} />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content
          sideOffset={4}
          style={{
            background: "white",
            color: "black",
            border: "1px solid #ddd",
            zIndex: 9999,
            borderRadius: 6,
            minWidth: 0,
            width: "24px", // 约 2/3 的 36px
            padding: "4px 0", // 上下留空隙
          }}
        >
          {(["light", "dark", "system"] as const).map((t) => (
            <Dropdown.Item
              key={t}
              onClick={() => setTheme(t)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "6px 0",
                fontSize: 16, // icon 大小
              }}
            >
              {t === "light" && "☀️"}
              {t === "dark" && "🌙"}
              {t === "system" && "🖥"}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
