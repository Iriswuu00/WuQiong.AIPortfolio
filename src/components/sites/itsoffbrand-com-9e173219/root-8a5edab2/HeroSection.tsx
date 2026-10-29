"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { SplitChars } from "../shared/SplitChars";

const LINES = ["Design", "Thinking", "AI Building"];

/**
 * Desktop grid placement (source w-node rules): rows 2/4/6 of a
 * 7-row grid, columns staggered — 1:1 from source screenshots (shot-1,
 * 1440px base): A DIFFERENT spans x132–749 (cx≈440, left of centre),
 * CREATIVE x828–1303 (cx≈1065, right), approach x252–785 (cx≈518, left).
 */
const BLOCK_POS: CSSProperties[] = [
  {
    gridRow: 2,
    gridColumn: "1 / 7",
    justifySelf: "start",
    paddingLeft: "132px",
  },
  { gridRow: 4, gridColumn: "7 / 12", justifySelf: "end" },
  { gridRow: 6, gridColumn: "3 / 9", justifySelf: "start" },
];

const SCROLL_X = ["-20em", "-10em", "-5em"];

/**
 * Hero — three display lines with per-char stagger reveal,
 * SCROLL ↓ indicator, and a targeto ornament. Text uses
 * mix-blend-mode: difference against the orb behind it.
 *
 * Scroll-out (source Lf()): as the hero leaves the viewport the
 * three lines translate left (-20em/-10em/-5em) and every char
 * slides down 101% with fading opacity, scrubbed 0..1.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // trigger char animation when hero enters
    const t = window.setTimeout(() => {
      el.classList.add("is-inview");
    }, 600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const blocks = Array.from(
      el.querySelectorAll<HTMLElement>("[hh-tb]")
    );
    const chars = Array.from(el.querySelectorAll<HTMLElement>(".hero-char"));

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // source Lf(): scrollTrigger start "top top" end "bottom top", scrub —
      // the wipe completes exactly when the hero has fully scrolled out.
      const p = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      blocks.forEach((b, i) => {
        const x = SCROLL_X[i] ?? "0";
        // translate by (scroll progress × em offset) — at p=0 the lines sit
        // exactly at their grid positions (source Lf() behaviour).
        const em = parseFloat(x) || 0;
        const px = em * parseFloat(getComputedStyle(b).fontSize);
        b.style.transform = `translate3d(${(px * p).toFixed(2)}px, 0, 0)`;
      });
      // chars: translateY 101% * p + fade, staggered "from random" (source Lf())
      // — each char finishes fully off-screen (opacity 0) at p=1.
      const seed = chars.length ? (Date.now() % 97) / 97 : 0;
      chars.forEach((c, i) => {
        const st = (i / Math.max(1, chars.length - 1)) * 0.5 + seed * 0.5;
        const cp = Math.min(Math.max((p - st * 0.35) / 0.65, 0), 1);
        c.style.transform = `translate3d(0, ${101 * cp}%, 0)`;
        c.style.opacity = String(1 - cp);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section home-hero="" className="s home-hero" ref={ref}>
      <div className="c is-home-hero">
        <div className="grid-main is-home-hero">
          {LINES.map((line, i) => (
            <div
              key={i}
              hh-tb={String(i + 1)}
              className="hh-text-block mbm-diff"
              style={BLOCK_POS[i]}
            >
              <div className="hh-transform">
                <div className="hh-text-ovf">
                  <SplitChars
                    as="h1"
                    text={line}
                    className="h-a"
                    charClassName="hero-char"
                    delayStep={0.045 + i * 0.12}
                  />
                </div>
              </div>
            </div>
          ))}
          <div
            hh-tb="4"
            className="hh-text-block mbm-diff is--scroll"
            style={{
              gridRow: 6,
              gridColumn: "9 / 12",
              justifySelf: "end",
              alignSelf: "end",
            }}
          >
            <div className="hh-transform">
              <div className="hh-text-ovf">
                <div className="text-regular caps">scroll ↓</div>
              </div>
            </div>
          </div>
          <div
            className="targeto"
            style={{
              gridRow: 4,
              gridColumn: "6 / 8",
              justifySelf: "center",
              alignSelf: "center",
            }}
          />
        </div>
      </div>
    </section>
  );
}
