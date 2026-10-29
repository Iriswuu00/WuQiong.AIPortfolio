"use client";

import { useEffect, useMemo, useRef } from "react";

const IMG_BASE = "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/";

/** user-supplied scattered tiles (38 imgs), row-first left→right then next row */
const SCATTER: string[] = Array.from(
  { length: 38 },
  (_, i) => `work/scatter/${i + 1}.jpeg`
);

/** is-N → local asset file (mapping extracted from source CSS) */
const BG: Record<string, string> = {
  "1": "64ddf4bbb71a4e6f4396835c_CMCC.jpg",
  "2": "64ddf4bb2c1b097a069ab009_Kairon - logo-1.jpg",
  "3": "64ddf4bc1951138700a64251_Breeder - 1.jpg",
  "4": "64ddf4bc9a064f7034c1c2ab_DL - 1.jpg",
  "5": "64ddf4bcb71a4e6f4396844d_Mantra - 2.jpg",
  "6": "64ddf4bc53f7418145c54414_Kairon - 1.jpg",
  "7": "64ddf4bce7a3a91e4da982ab_Mantra - 3.jpg",
  "8": "64ddf4be12def5051b902d01_Niftypays - 2.jpg",
  "9": "64ddf4be459a01ddf7cdc040_Morningstar - 2.jpg",
  "10": "64ddf4be2c1b097a069ab4be_Metacrafters - 1.jpg",
  "11": "64ddf4beb71a4e6f43968622_ob screen.jpg",
  "12": "64ddf4bc89aeb93f1651f9b2_Mantra - 1.jpg",
  "13": "68386aa997b3798d1a389fb5_Save & invest - 2.webp",
  "14": "64ddf4c07db8d486d213c60e_VitalXP - 2.jpg",
  "15": "64ddf4bf7e247bf012d69bde_TOS - 3.jpg",
  "16": "64ddf4bf45b1336a14496621_Soma.jpg",
  "17": "64ddf4bfab742eb1f32ca74a_Totem - 1.jpg",
  "18": "64ddf4bf7db8d486d213c4c5_UM - 2.jpg",
  "19": "64ddf4c08dfeff7554b9d81e_Youmeme.jpg",
  "20": "68386aa965f20b786404a3c0_VitalXP - 1.webp",
  "21": "64ddf4c0bcbb593ae58c4c21_Totem - 2.jpg",
  "22": "64ddf4be8c75728dbc28ce86_Mantra - 5.jpg",
  "23": "64ddf4bfb2ce60c1cf3e3d5b_UM - 3.jpg",
  "24": "64ddf4bf30ef3bf0337f569f_UM - 1.jpg",
  "25": "64de016490d3da8a29779e65_Save & Invest - 4-2.jpeg",
  "26": "64de01641951138700b44b78_Bitget-1-2.jpeg",
  "29": "68386aa95754018c2361b63b_Save & invest - 5.webp",
  "30": "64ddf4be1951138700a64499_Morningstar - 1.jpg",
  "32": "68386aa9908abc7d5aa226f8_Mantra - 5.webp",
  "37": "64ddf4bf30ef3bf0337f569f_UM - 1.jpg",
};

/** Source grid order: image tile (is-N) or text tile */
const ITEMS: {
  type: "img" | "text";
  is?: string;
  text?: string;
}[] = [
  { type: "img", is: "3" },
  { type: "text", text: "Bilingual" },
  { type: "img", is: "2" },
  { type: "img", is: "3" },
  { type: "img", is: "4" },
  { type: "img", is: "5" },
  { type: "text", text: "UX/UI" },
  { type: "img", is: "6" },
  { type: "img", is: "7" },
  { type: "img", is: "8" },
  { type: "img", is: "9" },
  { type: "text", text: "Project Management" },
  { type: "img", is: "10" },
  { type: "img", is: "11" },
  { type: "img", is: "13" },
  { type: "img", is: "13" },
  { type: "img", is: "14" },
  { type: "img", is: "15" },
  { type: "text", text: "Product Strategy" },
  { type: "img", is: "16" },
  { type: "img", is: "17" },
  { type: "img", is: "18" },
  { type: "text", text: "User Insight" },
  { type: "img", is: "19" },
  { type: "img", is: "20" },
  { type: "img", is: "21" },
  { type: "img", is: "22" },
  { type: "text", text: "Business Mindset" },
  { type: "img", is: "23" },
  { type: "img", is: "24" },
  { type: "img", is: "25" },
  { type: "img", is: "26" },
  { type: "img", is: "5" },
  { type: "text", text: "Data Analytics" },
  { type: "img", is: "6" },
  { type: "img", is: "29" },
  { type: "img", is: "30" },
  { type: "img", is: "10" },
  { type: "img", is: "32" },
  { type: "img", is: "11" },
  { type: "img", is: "12" },
  { type: "img", is: "25" },
  { type: "img", is: "16" },
  { type: "text", text: "Vibe Coding" },
  { type: "img", is: "24" },
  { type: "img", is: "37" },
  { type: "img", is: "1" },
  { type: "text", text: "AI Agent / AIGC" },
];

/**
 * Elevating — the source site's [grid-anim] tile field.
 * Tiles sit in a plain 8-column grid (5em tall), while the whole
 * grid starts tilted/back (rotateX ~ -45deg, scale .8, tiles offset
 * by random x/y percent) and, as you scroll the section, swings to
 * face the camera, tiles converge to their grid cells and inner
 * images scale 2 → 1 (ob.main.js gridAnim timeline Bc).
 */
export default function ElevatingSection() {
  const secRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // deterministic pseudo-random offsets per tile (GSAP random -150..150 / -300..300)
  const offsets = useMemo(
    () =>
      ITEMS.map((_, i) => {
        const r1 = Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5;
        const r2 = Math.sin(i * 269.5 + 183.3) * 0.5 + 0.5;
        return {
          x: (r1 * 2 - 1) * 90,
          y: (r2 * 2 - 1) * 120,
          z: -6000 + (r1 * 5900),
          rx: -65 + r2 * 40,
        };
      }),
    []
  );

  useEffect(() => {
    const sec = secRef.current;
    const grid = gridRef.current;
    if (!sec || !grid) return;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = sec.getBoundingClientRect();
        const vh = window.innerHeight;
        // tiles must stay behind the work cards above and only appear once
        // the section is deep inside the viewport (source: the card wall sits
        // below the sticky overlay title, well separated from Featured Work)
        const start = vh * 0.7;
        const end = -vh * 0.5;
        const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));

        const gridEl = grid;
        gridEl.style.transform = `perspective(var(--perspective)) rotateX(${(
          -45 + 45 * p
        ).toFixed(2)}deg) scale(${(0.8 + 0.2 * p).toFixed(4)})`;

        // keep the scattered tiles invisible until the swing begins, so they
        // never peek through the Featured Work cards above
        gridEl.style.opacity = p < 0.05 ? "0" : String(Math.min(1, (p - 0.05) / 0.1));

        const items = gridEl.querySelectorAll<HTMLElement>(".hg-grid-item");
        items.forEach((it, i) => {
          const o = offsets[i] ?? offsets[0];
          const k = 1 - p;
          const z = o.z * k;
          const itTransform = `translate(${(o.x * k).toFixed(2)}%, ${
            (o.y * k).toFixed(2)
          }%) translateZ(${z.toFixed(0)}px)`;
          it.style.transform = itTransform;
          const inner = it.querySelector<HTMLElement>(".hg-grid-inner");
          if (inner) {
            inner.style.transform = `scale(${(2 - 1 * p).toFixed(4)})`;
          }
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [offsets]);

  return (
    <section className="s is-hg" ref={secRef}>
      <div className="c">
        <div className="spacer-10" />
        <div pointer-none="" className="hg-grid-overlay">
          <div className="hg-grid-overlay-sticky">
            <h2 className="h-b hg-title">
              <span className="hg-title-line">Building</span>
              <span className="hg-title-line">AI Products In</span>
              <span className="hg-title-line">Human-Centric</span>
              <span className="hg-title-line">Ways.</span>
            </h2>
          </div>
        </div>
        <div className="spacer-8" />
        <div className="hg-grid-w">
          <div grid-anim="" className="hg-grid" ref={gridRef}>
            {(() => {
              let imgN = 0;
              return ITEMS.map((it, idx) => {
                if (it.type === "text") {
                  return (
                    <div key={idx} className="hg-grid-item is-text">
                      <div className="hg-grid-inner is-text">
                        <span className="text-small caps">{it.text}</span>
                      </div>
                    </div>
                  );
                }
                const n = imgN++;
                const bg =
                  n < SCATTER.length
                    ? `${IMG_BASE}${SCATTER[n]}`
                    : `${IMG_BASE}${SCATTER[0]}`;
                return (
                  <div key={idx} className="hg-grid-item">
                    <div
                      className="hg-grid-inner"
                      style={{ backgroundImage: `url(${bg})` }}
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
        <div className="spacer-10" />
      </div>
    </section>
  );
}
