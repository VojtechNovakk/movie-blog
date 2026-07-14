"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    let cursorRafId: number;

    if (
      window.matchMedia("(pointer: fine)").matches &&
      cursorDot &&
      cursorRing
    ) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      };

      const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        cursorRafId = requestAnimationFrame(renderCursor);
      };

      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(".ticket") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest("button") ||
          target.closest(".poster-container") ||
          target.closest("a")
        ) {
          cursorDot.classList.add("hover");
          cursorRing.classList.add("hover");
        }
      };

      const onMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(".ticket") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest("button") ||
          target.closest(".poster-container") ||
          target.closest("a")
        ) {
          cursorDot.classList.remove("hover");
          cursorRing.classList.remove("hover");
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseover", onMouseOver);
      document.body.addEventListener("mouseout", onMouseOut);
      cursorRafId = requestAnimationFrame(renderCursor);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseover", onMouseOver);
        document.body.removeEventListener("mouseout", onMouseOut);
        cancelAnimationFrame(cursorRafId);
      };
    }
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed top-0 left-0 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black transition-[width,height,opacity] duration-200"
      ></div>
      <div
        ref={cursorRingRef}
        className="cursor-ring fixed top-0 left-0 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-black/25 transition-[width,height,border-color,background-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      ></div>
    </>
  );
}
