"use client";

import { useEffect, useRef } from "react";

/**
 * Custom mouse — a fixed circle that follows the pointer with
 * mix-blend-mode: difference (source-verbatim behavior).
 * Scales down on hover over interactive elements.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest(
        "a, button, [data-cursor-hover], input, textarea, [role='button'], .hud-menu-w"
      );
      cursor.classList.toggle("hover", !!interactive);
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.setProperty("--mx", `${x}px`);
      cursor.style.setProperty("--my", `${y}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div data-cursor-wrap>
      <div data-cursor ref={cursorRef} />
    </div>
  );
}
