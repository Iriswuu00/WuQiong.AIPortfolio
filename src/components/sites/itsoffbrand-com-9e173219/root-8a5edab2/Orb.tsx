"use client";

import { useEffect, useRef } from "react";

type OrbInstance = {
  setTexture: (url: string) => void;
  dispose: () => void;
  scale: number;
};
type OrbCtor = new (viewport: HTMLElement, segments?: number) => OrbInstance;

declare global {
  interface Window {
    Orb?: OrbCtor;
    __orbReady?: boolean;
  }
}

/**
 * Orb — the source site's actual Three.js GPGPU fluid sphere
 * (offbrand-orb.min.js), plus the page-scroll choreography the
 * source applies to the orb and its two dashed outline rings
 * (ob.main.js Pf(): timelines Vc / Gc / Wc, scrub-linked to the
 * whole page scroll). The sphere flows, reacts to the pointer on
 * its surface, and moves/scales across each screen while scrolling.
 */

// Keyframes (progress 0..1) extracted from the source timelines (ob.main.js
// Pf(): Vc/Gc/Wc — GSAP timelines scrubbed to the whole .page-w scroll).
// Segment progress = duration / total duration (Vc .975, Gc/Wc 1.0).
// Easing per segment follows the source (power2.out / power2.inOut /
// default GSAP power1.out = easeOutCubic); sample() applies the exact
// easing so the orb/rings land on the source's positions at each scroll
// progress (user shot-4: Featured Work shows the orb mid left-sweep).
type Frame = [number, number, number, number, number, number, number, number, string];
const ORB_FRAMES: Frame[] = [
  [0, 0.153846, 0, 0, 1, 50, 0, 2, "out2"],          // power2.out
  // Segment 2 split at the Featured-work anchor: pixel measurement of the
  // source screenshot (same viewport state as our p≈0.232) places the orb
  // centre at ~21% viewport width (x≈-29vw), not ~49%. Reaching x=-29vw at
  // p≈0.24 corrects the late left-sweep caused by page-height differences.
  [0.153846, 0.24, 50, 0, 2, -29, -15, 1.72, "out2"],
  [0.24, 0.307692, -29, -15, 1.72, -50, -20, 1.5, "c"],
  [0.307692, 0.358974, -50, -20, 1.5, 0, 50, 0, "c"],
  [0.358974, 0.384615, 0, 50, 0, 0, 50, 0, "c"],
  [0.384615, 0.512821, 0, 50, 0, 0, 0, 1, "c"],
  [0.512821, 0.615385, 0, 0, 1, -25, 20, 1.5, "c"],
  [0.615385, 0.666667, -25, 20, 1.5, -60, -75, 0, "c"], // power1.out
  [0.666667, 1, -60, -75, 0, 0, 0, 0, "c"],
];

const OUT1_FRAMES: Frame[] = [
  [0, 0.15, 0, 0, 1, 10, 0, 1.2, "c"],
  [0.15, 0.3, 10, 0, 1.2, -30, 0, 1.3, "c"],
  [0.3, 0.35, -30, 0, 1.3, 0, 50, 1, "c"],
  [0.35, 0.375, 0, 50, 1, 0, 50, 0.8, "c"],
  [0.375, 0.5, 0, 50, 0.8, 0, 0, 1, "c"],
  [0.5, 0.65, 0, 0, 1, 30, -20, 0.7, "c"],
  [0.65, 0.7, 30, -20, 0.7, 0, 0, 1, "c"],
  [0.7, 0.95, 0, 0, 1, 0, 0, 0, "c"],
  [0.95, 1, 0, 0, 0, 49, 0, 1, "c"],
];

const OUT2_FRAMES: Frame[] = [
  [0, 0.15, 0, 0, 1, 25, 0, 1.3, "c"],
  [0.15, 0.3, 25, 0, 1.3, -9, 32, 0.6, "c"],
  [0.3, 0.35, -9, 32, 0.6, 0, 50, 1, "c"],
  [0.35, 0.375, 0, 50, 1, 0, 50, 0.8, "c"],
  [0.375, 0.5, 0, 50, 0.8, 0, 0, 1, "c"],
  [0.5, 0.65, 0, 0, 1, 0, 14, 1.2, "c"],
  [0.65, 0.7, 0, 14, 1.2, 0, 0, 0.6, "c"],
  [0.7, 0.95, 0, 0, 0.6, 0, 0, 0, "c"],
  [0.95, 1, 0, 0, 0, 29, 0, 1.5, "c"],
];

function easeOf(kind: string, t: number): number {
  if (kind === "out2") return 1 - Math.pow(1 - t, 2); // power2.out
  if (kind === "io2") {
    // power2.inOut (easeInOutQuad)
    return t < 0.5 ? 2 * t * t : 1 - 2 * Math.pow(1 - t, 2);
  }
  return 1 - Math.pow(1 - t, 3); // power1.out (GSAP default)
}

function sample(
  frames: Frame[],
  p: number
): { x: number; y: number; s: number } {
  const f = frames.find((f) => p >= f[0] && p <= f[1]);
  if (!f) return { x: 0, y: 0, s: 0 };
  const t = (p - f[0]) / (f[1] - f[0]);
  const e = easeOf(f[8], t);
  return {
    x: f[2] + (f[5] - f[2]) * e,
    y: f[3] + (f[6] - f[3]) * e,
    s: f[4] + (f[7] - f[4]) * e,
  };
}

export default function Orb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const out1Ref = useRef<HTMLDivElement>(null);
  const out2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;

    let orb: OrbInstance | null = null;
    let disposed = false;
    let raf = 0;

    const SRC = "/sites/itsoffbrand-com-9e173219/root-8a5edab2/orb.min.js";
    const TEX =
      "/sites/itsoffbrand-com-9e173219/root-8a5edab2/textures/ob_texture-dark.jpg";

    const init = () => {
      if (disposed || !window.Orb) return;
      try {
        orb = new window.Orb(el, 100);
        orb.setTexture(TEX);
      } catch (err) {
        console.error("[Orb] init failed", err);
      }
    };

    if (window.Orb) init();
    else {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = init;
      document.head.appendChild(s);
    }

    // Signal the preloader once the real orb has its texture and a few
    // frames rendered, so its fade-in never reveals an empty canvas
    // (source plays the same orb; we hand off from the preloader stand-in).
    const signalReady = () => {
      if (disposed) return;
      window.__orbReady = true;
      let f = 0;
      const tick = () => {
        if (disposed) return;
        if (++f >= 3) {
          window.dispatchEvent(new Event("orb-ready"));
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const preloadTex = () => {
      const img = new Image();
      img.onload = signalReady;
      img.onerror = signalReady;
      img.src = TEX;
    };
    preloadTex();

    // page-scroll choreography (Vc/Gc/Wc). Skipped while the orb is doing
    // its preloader entry (is-pre / is-entering) — scroll takes over once
    // the fly-in has landed so it never fights the grow animation.
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        if (wrap?.classList.contains("is-pre") || wrap?.classList.contains("is-visible") || wrap?.classList.contains("is-entering")) {
          return;
        }
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, window.scrollY / max));

        const o = sample(ORB_FRAMES, p);
        el.style.transform = `translate(${o.x}vw, ${o.y}vh) scale(${o.s.toFixed(4)})`;

        const a = out1Ref.current;
        if (a) {
          const r1 = sample(OUT1_FRAMES, p);
          a.style.transform = `translate(${r1.x}vw, ${r1.y}vh) scale(${r1.s.toFixed(4)})`;
        }
        const b = out2Ref.current;
        if (b) {
          const r2 = sample(OUT2_FRAMES, p);
          b.style.transform = `translate(${r2.x}vw, ${r2.y}vh) scale(${r2.s.toFixed(4)})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The preloader plays the same orb (single source): it starts hidden in
    // the bottom-right corner, holds there at the small ~4.3em size, then
    // grows to the hero size at centre — one continuous orb, never two.
    // The grow runs as an inline transition across frames (class-swap alone
    // would paint the target state in the same frame and skip the animation).
    const onOrbIn = () => {
      const wrap = wrapRef.current;
      const el = orbRef.current;
      if (!wrap || !el) return;
      wrap.classList.remove("is-pre");
      wrap.classList.add("is-visible");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.setTimeout(() => {
            // transition must land one frame before the value change, or
            // the browser applies both in the same frame and skips the grow.
            // The grow transform lives on .orb (el), matching the CSS.
            el.style.transition =
              "transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)";
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                el.style.transform = "translate(0,0) scale(1)";
                wrap.classList.remove("is-visible");
                window.setTimeout(() => {
                  el.style.transition = "";
                  el.style.transform = "";
                  onScroll();
                }, 1250);
              })
            );
          }, 300);
        })
      );
    };
    window.addEventListener("preloader-orb-in", onOrbIn);

    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("preloader-orb-in", onOrbIn);
      cancelAnimationFrame(raf);
      try {
        orb?.dispose();
      } catch {
        /* noop */
      }
    };
  }, []);

  return (
    <div ref={wrapRef} data-orb-wrap="" className="orb-w is-pre">
      <div ref={orbRef} data-orb="" className="orb" />
      <div ref={out1Ref} orb-out-w="1" className="orb-outline-w">
        <div orb-out-r="1" className="orb-outline-r">
          <div orb-outline="1" className="orb-outline" />
        </div>
      </div>
      <div ref={out2Ref} orb-out-w="2" className="orb-outline-w is-2">
        <div orb-out-r="2" className="orb-outline-r">
          <div orb-outline="2" className="orb-outline is-2" />
        </div>
      </div>
    </div>
  );
}
