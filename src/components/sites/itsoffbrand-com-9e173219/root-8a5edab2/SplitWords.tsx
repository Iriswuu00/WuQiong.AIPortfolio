"use client";

import { useEffect } from "react";

/**
 * SplitWords — global word-split pass mirroring the source site's
 * ob.main.js splitText. Every `[split-text]` / `[stagger-text]` element
 * that has not already been split gets `.sfx` and its text wrapped in
 * `.word` spans. This powers the stagger-scroll reveals that query
 * "[split-text] .word".
 *
 * Elements inside a `[stagger-el]` link (nav Manifesto / Webflow
 * Enterprise, About Us, etc.) are split at **character** level into
 * `.char` spans instead — the source site's label hover animates
 * `[stagger-text] .char` up 100% with a random 0.03s stagger
 * (ob.main.js sy/oy), revealing the 1em text-shadow below.
 *
 * Elements already split by a component (hero chars, manifesto lines,
 * closing words, etc.) are left untouched.
 */
export default function SplitWords() {
  useEffect(() => {
    // defer a frame so component-level splitters (hero chars, etc.) run first
    const t = window.setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(
        "[split-text], [stagger-text]"
      );
      els.forEach((el) => {
        if (el.querySelector(".word") || el.querySelector(".hero-char") || el.querySelector(".char")) return;
        if (el.dataset.splitDone === "1") return;
        const text = el.textContent ?? "";
        if (!text.trim()) return;
        const parts = text.split(/(\s+)/);
        el.classList.add("sfx");
        el.dataset.splitDone = "1";
        el.textContent = "";
        const frag = document.createDocumentFragment();
        const charLevel = !!el.closest("[stagger-el]");
        parts.forEach((w) => {
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(w));
          } else if (w.length) {
            if (charLevel) {
              // character-level spans, random 0.03s-staggered delay so the
              // hover lift reads as a wave (source: stagger from "random")
              const delay = (Math.random() * 0.27).toFixed(3);
              for (const ch of w) {
                const span = document.createElement("span");
                span.className = "char";
                span.textContent = ch;
                span.style.transitionDelay = `${delay}s`;
                frag.appendChild(span);
              }
            } else {
              const span = document.createElement("span");
              span.className = "word";
              span.textContent = w;
              frag.appendChild(span);
            }
          }
        });
        el.appendChild(frag);
      });
    }, 16);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
