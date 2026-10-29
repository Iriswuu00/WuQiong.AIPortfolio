"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling — the source site uses Lenis (lenis class
 * on <html>, .lenis-smooth wrapper). Initialize once at app root.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", () => {
      // keep any scroll-driven state in sync
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    // anchor handling: smooth-scroll both "#id" and "/#id" (same-page hash)
    const scrollToHash = (hash: string) => {
      const id = hash.slice(1);
      if (!id) return false;
      const el = document.getElementById(id);
      if (el) {
        lenis.scrollTo(el, { offset: 0, duration: 1.2 });
        return true;
      }
      return false;
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      let hash = "";
      if (href.startsWith("#")) {
        hash = href;
      } else {
        const idx = href.indexOf("#");
        if (idx >= 0) {
          const path = href.slice(0, idx);
          if (path === "/" || path === "") hash = href.slice(idx);
        }
      }
      if (hash && scrollToHash(hash)) {
        e.preventDefault();
      }
    };
    document.addEventListener("click", onClick);

    // on mount: honor an incoming hash (e.g. navigating back to /#about)
    if (typeof window !== "undefined" && window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
