"use client";

import { useEffect } from "react";

/**
 * ScrollFX — global scroll-driven text reveal system.
 * Mirrors the source site's GSAP ScrollTrigger + SplitText setup:
 *
 *  - `[split-text]`  → splits text into per-word spans (wrapped in
 *    overflow-hidden), each word starts translateY(110%) and slides
 *    up with a small stagger once the element enters the viewport.
 *  - `[stagger-scroll]` → element fades/rises into view (adds
 *    `.is-inview`, CSS drives the transition).
 *
 * Runs client-side only; SSR output stays plain text, so there is
 * no hydration mismatch.
 */
export default function ScrollFX() {
  useEffect(() => {
    const doc = document;
    let raf = 0;
    const jobs: {
      el: HTMLElement;
      words: HTMLElement[];
      fired: boolean;
    }[] = [];

    // 1. split [split-text] elements into words
    const splitEls = Array.from(
      doc.querySelectorAll<HTMLElement>("[split-text]")
    );
    for (const el of splitEls) {
      // hsc words are managed by ClosingSection — skip
      if (el.closest("[hsc-track]")) continue;
      // labels inside [stagger-el] links are char-split by SplitWords
      // (hover lift) — skip so this pass doesn't overwrite the .chars
      if (el.closest("[stagger-el]")) continue;
      // StrictMode double-mount: if already split on the remount pass,
      // re-claim the existing words so their reveal still triggers.
      const existing = Array.from(
        el.querySelectorAll<HTMLElement>(":scope > .word")
      );
      if (existing.length) {
        jobs.push({ el, words: existing, fired: false });
        continue;
      }
      const text = el.textContent || "";
      if (!text.trim()) continue;
      el.setAttribute("aria-label", text.trim());
      el.classList.add("sfx");
      el.textContent = "";
      const words: HTMLElement[] = [];
      const frag = doc.createDocumentFragment();
      for (const w of text.split(/(\s+)/)) {
        if (!w) continue;
        const span = doc.createElement("span");
        span.className = "word" + (/^\s+$/.test(w) ? " word-sp" : "");
        span.textContent = w;
        words.push(span);
        frag.appendChild(span);
      }
      el.appendChild(frag);
      jobs.push({ el, words, fired: false });
    }

    // 2. stagger-scroll elements handled via .is-inview class
    const staggerEls = Array.from(
      doc.querySelectorAll<HTMLElement>("[stagger-scroll]")
    );

    const check = () => {
      const vh = window.innerHeight;
      // word-split reveals
      for (const job of jobs) {
        if (job.fired) continue;
        const r = job.el.getBoundingClientRect();
        // trigger when the element's top enters the viewport
        // (source site uses ScrollTrigger start "top bottom")
        if (r.top < vh) {
          job.fired = true;
          job.words.forEach((w, i) => {
            w.style.transition =
              "transform .8s cubic-bezier(.16,1,.3,1), opacity .8s ease";
            w.style.transitionDelay = `${Math.min(i * 0.018, 0.45)}s`;
            w.style.transform = "translateY(0)";
            w.style.opacity = "1";
          });
        }
      }
      // stagger-scroll elements (no split-text)
      for (const el of staggerEls) {
        if (el.classList.contains("is-inview")) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh) {
          el.classList.add("is-inview");
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };

    // initial paint + small delay so preloader doesn't fight it
    const t = setTimeout(() => {
      check();
      window.addEventListener("scroll", onScroll, { passive: true });
    }, 1200);

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
