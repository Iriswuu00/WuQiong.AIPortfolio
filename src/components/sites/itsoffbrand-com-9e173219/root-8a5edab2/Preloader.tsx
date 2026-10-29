"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Preloader — brand "+" logomark mask wipe, build counter and
 * percent readout (source: preloader wipe + counter + orb scale-in).
 */
export default function Preloader() {
  const [phase, setPhase] = useState<"loading" | "wipe" | "done">("loading");
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const outlineRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    let n = 0;
    const iv = window.setInterval(() => {
      n = Math.min(100, n + 4);
      setPct(n);
      if (n >= 100) {
        window.clearInterval(iv);
        window.setTimeout(() => setPhase("wipe"), 250);
      }
    }, 40);

    const t2 = window.setTimeout(() => {
      if (outlineRef.current) {
        outlineRef.current.style.transition =
          "stroke-dashoffset 1.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
        outlineRef.current.style.strokeDashoffset = "0";
      }
    }, 200);

    return () => {
      window.clearInterval(iv);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.transition = "none";
      fillRef.current.style.transform = `scaleY(${pct / 100})`;
    }
  }, [pct]);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("done"), 12000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "wipe") {
      const t = window.setTimeout(() => {
        rootRef.current?.classList.add("is-wiping");
      }, 60);
      let handedOff = false;
      const doHandoff = () => {
        if (handedOff) return;
        handedOff = true;
        window.dispatchEvent(new Event("preloader-orb-in"));
        window.setTimeout(() => rootRef.current?.classList.add("is-fade-bg"), 320);
        window.setTimeout(() => rootRef.current?.classList.add("is-fade"), 1500);
        window.setTimeout(() => setPhase("done"), 1800);
      };
      const t2 = window.setTimeout(() => {
        if (window.__orbReady) doHandoff();
        else {
          window.addEventListener("orb-ready", doHandoff, { once: true });
          window.setTimeout(doHandoff, 4000);
        }
      }, 60);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(t2);
      };
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div ref={rootRef} className={`pre-w ${phase === "loading" ? "is-active" : "is-active is-wiping"}`}>
      <div className="ob-mask-wrap">
        <div className="ob-mask-outline">
          <svg viewBox="0 0 162 162" width="100%" height="100%">
            <path
              ref={outlineRef}
              className="st-x"
              d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ob-fill-mask">
          <div ref={fillRef} className="ob-fill-fill" />
        </div>
        <div className="pre-info-w">
          <div className="pre-info-inner">
            <p className="pre-pct">build</p>
            <p className="pre-pct">{pct}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
