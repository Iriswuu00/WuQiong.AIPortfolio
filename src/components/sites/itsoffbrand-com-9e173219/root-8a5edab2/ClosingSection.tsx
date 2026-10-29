"use client";

import { useEffect, useRef } from "react";

/* ============================================================
 * Closing — 照片球 + 小人 + 4 块能力标签
 * 方案：直接内嵌 Canvas（不使用 iframe，避免 iframe 白色方块）
 *  - 照片球容器固定 600px 布局，用 transform: scale() 控制视觉大小
 *  - 小人 video 用容器查询单位 cqmin（等价于 iframe 内的 vmin）
 *  - 放大过程中球持续自转、小人持续跑动
 *  - 球放大到最大后，背景色块 + 四角才淡入
 * ============================================================ */

const GLOBE_SIZE = 600; // 最终照片球布局尺寸
const START_SIZE = 20; // 起始视觉尺寸
const MIN_SCALE = START_SIZE / GLOBE_SIZE;

// 滚动进度分段（p: 0 → 1）
const GROW_END = 0.55; // 球放大结束
const BG_START = 0.55; // 背景色块开始淡入（球达到最大后）
const BG_END = 0.78;
const CORNER_START = 0.68; // 四角开始淡入（背景出现后）
const CORNER_END = 0.92;

export default function ClosingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* ================= 照片球 Canvas 渲染（移植自 card-globe-final） ================= */
    const canvas = document.getElementById("hsc-globe-canvas") as HTMLCanvasElement | null;
    let fxRaf = 0;
    let disposed = false;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      const IMAGE_SOURCES = Array.from(
        { length: 31 },
        (_, i) => `/card-globe/photos/photo-${String(i + 1).padStart(2, "0")}.jpg`
      );
      const RING_COUNTS = [8, 12, 14, 12, 8];
      const LATITUDES = [64.25, 33.85, 0, -33.85, -64.25];
      const CONFIG = {
        globeSize: 0.93,
        gap: 0.025,
        backFade: 0.55,
        duration: 20000,
        camera: 3.6,
        segmentsX: 8,
        segmentsY: 6,
        cornerRadius: 0.035,
      };

      let W = 0, H = 0, DPR = 1, R = 1, CX = 0, CY = 0;
      let cards: any[] = [];
      let gridSpecs: any[] = [];
      let assignments: number[] = [];
      const textureById = new Map<number, HTMLCanvasElement>();
      let startTime = performance.now();

      function loadImage(src: string): Promise<HTMLImageElement | null> {
        return new Promise((resolve) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => resolve(null);
          im.src = src;
        });
      }
      function shuffle(a: number[]) {
        const r = [...a];
        for (let i = r.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [r[i], r[j]] = [r[j], r[i]];
        }
        return r;
      }
      function roundedTexture(image: HTMLImageElement) {
        const tw = 360, th = 480;
        const c = document.createElement("canvas");
        c.width = tw; c.height = th;
        const x = c.getContext("2d");
        if (!x) return null;
        const iw = image.naturalWidth || image.width;
        const ih = image.naturalHeight || image.height;
        const target = tw / th, srcAspect = iw / ih;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (srcAspect > target) { sw = ih * target; sx = (iw - sw) / 2; }
        else { sh = iw / target; sy = (ih - sh) / 2; }
        x.save();
        x.beginPath();
        const rad = Math.round(tw * CONFIG.cornerRadius);
        if (x.roundRect) {
          x.roundRect(0, 0, tw, th, rad);
        } else {
          x.moveTo(rad, 0);
          x.arcTo(tw, 0, tw, th, rad);
          x.arcTo(tw, th, 0, th, rad);
          x.arcTo(0, th, 0, 0, rad);
          x.arcTo(0, 0, tw, 0, rad);
          x.closePath();
        }
        x.clip();
        x.imageSmoothingEnabled = true;
        x.imageSmoothingQuality = "high";
        x.drawImage(image, sx, sy, sw, sh, 0, 0, tw, th);
        x.restore();
        return c;
      }
      function makeGrid() {
        const specs: any[] = [];
        const rows: number[][] = [];
        RING_COUNTS.forEach((count, row) => {
          rows[row] = [];
          for (let col = 0; col < count; col++) {
            const idx = specs.length;
            specs.push({ row, col, lon: (col * Math.PI * 2) / count, neighbors: new Set() });
            rows[row].push(idx);
          }
        });
        for (const row of rows) {
          for (let i = 0; i < row.length; i++) {
            const prev = row[(i - 1 + row.length) % row.length];
            const next = row[(i + 1) % row.length];
            const idx = row[i];
            specs[idx].neighbors.add(prev);
            specs[idx].neighbors.add(next);
          }
        }
        for (let r = 0; r < rows.length - 1; r++) {
          for (const a of rows[r]) {
            let nearest: number | null = null;
            let best = Infinity;
            for (const b of rows[r + 1]) {
              let diff = Math.abs(specs[a].lon - specs[b].lon);
              diff = Math.min(diff, Math.PI * 2 - diff);
              if (diff < best) { best = diff; nearest = b; }
            }
            if (nearest !== null) {
              specs[a].neighbors.add(nearest);
              specs[nearest].neighbors.add(a);
            }
          }
        }
        return specs;
      }
      function assignImages(ids: number[], specs: any[]) {
        if (!ids.length) return [];
        for (let attempt = 0; attempt < 300; attempt++) {
          const order = shuffle(specs.map((_, i) => i));
          const result = new Array(specs.length);
          const usage = new Map(ids.map((id) => [id, 0]));
          let ok = true;
          for (const index of order) {
            const forbidden = new Set();
            for (const neighbor of specs[index].neighbors) {
              if (result[neighbor] !== undefined) forbidden.add(result[neighbor]);
            }
            const candidates = ids.filter((id) => !forbidden.has(id));
            if (!candidates.length) { ok = false; break; }
            const minimum = Math.min(...candidates.map((id) => usage.get(id) || 0));
            const preferred = candidates.filter((id) => (usage.get(id) || 0) === minimum);
            const chosen = preferred[Math.floor(Math.random() * preferred.length)];
            result[index] = chosen;
            usage.set(chosen, (usage.get(chosen) || 0) + 1);
          }
          if (ok && ids.every((id) => usage.get(id) > 0)) return result;
        }
        const fallback = shuffle(ids);
        return specs.map((_, i) => fallback[i % fallback.length]);
      }
      function spherePoint(lat: number, lon: number): number[] {
        const cl = Math.cos(lat);
        return [R * cl * Math.sin(lon), -R * Math.sin(lat), R * cl * Math.cos(lon)];
      }
      function rotateX(p: number[], angle: number): number[] {
        const c = Math.cos(angle), s = Math.sin(angle);
        return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
      }
      function project(p: number[]): number[] {
        const scale = (CONFIG.camera * R) / (CONFIG.camera * R - p[2]);
        return [CX + p[0] * scale, CY - p[1] * scale, p[2], scale];
      }
      function buildCards() {
        cards = [];
        gridSpecs.forEach((spec, index) => {
          const lat = (LATITUDES[spec.row] * Math.PI) / 180;
          const lon = spec.lon;
          const count = RING_COUNTS[spec.row];
          const slot = (Math.PI * 2 * R * Math.cos(lat)) / count;
          const width = slot * (1 - CONFIG.gap);
          const height = (width * 4) / 3;
          const center = spherePoint(lat, lon);
          const cosLon = Math.cos(lon), sinLon = Math.sin(lon);
          const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
          cards.push({
            center, width, height,
            texture: textureById.get(assignments[index]),
            right: [cosLon, 0, -sinLon],
            down: [sinLon * sinLat, cosLat, cosLon * sinLat],
            normal: [sinLon * cosLat, -sinLat, cosLon * cosLat],
          });
        });
      }
      function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.round(canvas.clientWidth * DPR);
        H = Math.round(canvas.clientHeight * DPR);
        if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
        R = Math.min(W, H) * CONFIG.globeSize * 0.5;
        CX = W / 2; CY = H / 2;
        buildCards();
      }
      function meshPoint(card: any, lx: number, ly: number, spin: number): number[] {
        const sag = -(lx * lx + ly * ly) / (2 * R);
        const p = [
          card.center[0] + card.right[0] * lx + card.down[0] * ly + card.normal[0] * sag,
          card.center[1] + card.right[1] * lx + card.down[1] * ly + card.normal[1] * sag,
          card.center[2] + card.right[2] * lx + card.down[2] * ly + card.normal[2] * sag,
        ];
        return project(rotateX(p, spin));
      }
      function drawCard(card: any, spin: number, sortedDepth: number) {
        if (!card.texture) return;
        const nx = CONFIG.segmentsX, ny = CONFIG.segmentsY;
        const sw = card.texture.width / nx;
        const sh = card.texture.height / ny;
        const depth = sortedDepth / R;
        const front = Math.max(0, Math.min(1, (depth + 1) / 2));
        ctx!.globalAlpha = 1 - (1 - front) * CONFIG.backFade;
        for (let iy = 0; iy < ny; iy++) {
          const ly0 = -card.height / 2 + (iy * card.height) / ny;
          const ly1 = -card.height / 2 + ((iy + 1) * card.height) / ny;
          for (let ix = 0; ix < nx; ix++) {
            const lx0 = -card.width / 2 + (ix * card.width) / nx;
            const lx1 = -card.width / 2 + ((ix + 1) * card.width) / nx;
            const p00 = meshPoint(card, lx0, ly0, spin);
            const p10 = meshPoint(card, lx1, ly0, spin);
            const p01 = meshPoint(card, lx0, ly1, spin);
            const ux = p10[0] - p00[0], uy = p10[1] - p00[1];
            const vx = p01[0] - p00[0], vy = p01[1] - p00[1];
            ctx!.save();
            ctx!.transform(ux / sw, uy / sw, vx / sh, vy / sh, p00[0], p00[1]);
            ctx!.drawImage(card.texture, ix * sw, iy * sh, sw + 0.5, sh + 0.5, -0.25, -0.25, sw + 0.5, sh + 0.5);
            ctx!.restore();
          }
        }
        ctx!.globalAlpha = 1;
      }
      function render(now: number) {
        if (disposed) return;
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
        ctx!.clearRect(0, 0, W, H);
        // 背景透明：不绘制任何底色（无黑色、无白色）
        const elapsed = now - startTime;
        const spin = (-(elapsed / CONFIG.duration) * Math.PI * 2);
        const cs = Math.cos(spin), ss = Math.sin(spin);
        const order = cards
          .map((card) => ({ card, z: card.center[1] * ss + card.center[2] * cs }))
          .sort((a, b) => a.z - b.z);
        for (const item of order) drawCard(item.card, spin, item.z);
        fxRaf = requestAnimationFrame(render);
      }
      async function init() {
        const loaded = await Promise.all(
          IMAGE_SOURCES.map(async (src, index) => ({ index, image: await loadImage(src) }))
        );
        if (disposed) return;
        for (const item of loaded) {
          if (!item.image) continue;
          const texture = roundedTexture(item.image);
          if (texture) textureById.set(item.index, texture);
        }
        gridSpecs = makeGrid();
        assignments = assignImages([...textureById.keys()], gridSpecs);
        buildCards();
        resize();
        const ro = new ResizeObserver(() => resize());
        ro.observe(canvas);
        startTime = performance.now();
        fxRaf = requestAnimationFrame(render);
      }
      init();
    }

    /* ================= 滚动控制 ================= */
    const el = ref.current;
    let scrollRaf = 0;
    const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));
    const seg = (v: number, a: number, b: number) =>
      ease(Math.min(1, Math.max(0, (v - a) / (b - a))));

    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const tr = el.querySelector<HTMLElement>("[hsc-track]")?.getBoundingClientRect();
        if (!tr) return;
        const vh = window.innerHeight;
        const rawP = -tr.top / Math.max(1, tr.height - vh);
        const p = Math.min(1, Math.max(0, rawP));

        // 【1】球放大：scale 从 MIN_SCALE → 1
        const growP = seg(p, 0, GROW_END);
        const s = MIN_SCALE + growP * (1 - MIN_SCALE);
        if (scaleRef.current) scaleRef.current.style.transform = `scale(${s})`;

        // 【2】背景色块淡入（球达到最大后）
        const bgP = seg(p, BG_START, BG_END);
        if (bgRef.current) bgRef.current.style.opacity = String(bgP);

        // 【3】四角淡入（背景出现后）
        const cornerP = seg(p, CORNER_START, CORNER_END);
        const corners = el.querySelectorAll<HTMLElement>("[hsc-corner]");
        corners.forEach((c) => { c.style.opacity = String(cornerP); });

        // 【滚出】整体淡出
        const outP = ease(Math.max(0, (rawP - 1.0) / 0.3));
        if (scaleRef.current) scaleRef.current.style.opacity = String(1 - outP);
        if (bgRef.current) bgRef.current.style.opacity = String(bgP * (1 - outP));
        corners.forEach((c) => { c.style.opacity = String(cornerP * (1 - outP)); });
      });
    };
    if (el) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(fxRaf);
      disposed = true;
    };
  }, []);

  return (
    <section className="s is-hsc" ref={ref}>
      <div hsc-track="" className="hsc-track">
        <div className="hsc-overlay-w">
          {/* 背景色块：只占一屏，球放大到最大后才淡入 */}
          <div
            ref={bgRef}
            style={{
              position: "absolute",
              inset: 0,
              height: "100vh",
              background:
                "linear-gradient(135deg, #d4b5d4 0%, #b8a8d4 50%, #a8b5d4 100%)",
              opacity: 0,
            }}
          />

          {/* 中央照片球：外层居中，内层 scale（布局固定 600px） */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              ref={scaleRef}
              style={{
                position: "relative",
                width: `${GLOBE_SIZE}px`,
                height: `${GLOBE_SIZE}px`,
                overflow: "hidden",
                containerType: "size",
                transform: `scale(${MIN_SCALE})`,
                transformOrigin: "center center",
                background: "transparent",
              }}
            >
              <canvas
                id="hsc-globe-canvas"
                aria-hidden="true"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
              />
              <video
                id="hsc-runner-video"
                src="/card-globe/video/runner.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "calc(50% - 47cqmin)",
                  left: "50%",
                  zIndex: 10,
                  width: "auto",
                  height: "clamp(264px, 44cqmin, 380px)",
                  aspectRatio: "1",
                  pointerEvents: "none",
                  objectFit: "contain",
                  transform: "translateX(-50%)",
                  background: "transparent",
                }}
              />
            </div>
          </div>

          {/* 四角内容：和 about-demo.html 一致，初始 opacity 0 */}
          {/* 左上：精准表达 */}
          <div hsc-corner="" style={cornerStyle({ top: "18%", left: "12%" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "28px", lineHeight: "1" }}>💯</div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
                精准表达
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginLeft: "36px" }}>与人与 AI 的协作</div>
          </div>

          {/* 右上：判断力 */}
          <div hsc-corner="" style={cornerStyle({ top: "18%", right: "12%" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "28px", lineHeight: "1" }}>🦋</div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
                判断力
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginLeft: "36px" }}>发现问题 → AI 解法 → 判断验证</div>
          </div>

          {/* 左下：审美感受力 */}
          <div hsc-corner="" style={cornerStyle({ bottom: "18%", left: "12%" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "28px", lineHeight: "1" }}>🌈</div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
                审美感受力
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginLeft: "36px" }}>拉开差异化</div>
          </div>

          {/* 右下：持续学习 */}
          <div hsc-corner="" style={cornerStyle({ bottom: "18%", right: "12%" })}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "28px", lineHeight: "1" }}>👨‍🦳</div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>
                持续学习
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginLeft: "36px" }}>
              好奇心 + 高质量输入，才有好产出
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cornerStyle(pos: Record<string, string>): React.CSSProperties {
  return {
    position: "absolute",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    opacity: 0,
    ...pos,
  };
}
