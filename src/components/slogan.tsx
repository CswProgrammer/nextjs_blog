"use client";
import Typed from "typed.js";
import { useEffect, useRef } from "react";

export default function Slogan() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["欢迎来到我的博客，这里分享我在编程、技术和生活中的点滴。"],
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      cursorChar: " _",
      loop: true, // 开启循环
      loopCount: Infinity, // 无限循环
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
      <span ref={el}>&nbsp;</span>
    </p>
  );
}
