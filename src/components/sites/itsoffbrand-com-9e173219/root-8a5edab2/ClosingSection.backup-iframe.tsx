"use client";

import { useEffect, useRef } from "react";

/**
 * Closing — 照片球 + 4 块能力标签
 * 中央照片球用 iframe 加载原始素材（不改样式）
 * 四角内容只在渐变背景上出现
 */
export default function ClosingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const track = el.querySelector<HTMLElement>("[hsc-track]");
    const corners = el.querySelectorAll<HTMLElement>("[hsc-corner]");
    const globe = globeRef.current;
    let raf = 0;
    const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tr = track?.getBoundingClientRect();
        if (!tr) return;
        const vh = window.innerHeight;
        const rawP = -tr.top / Math.max(1, tr.height - vh);
        const p = Math.min(1, Math.max(0, rawP));

        // 【1】照片球放大：p 0 → 0.6，从 20px 放大到 600px
        if (globe) {
          const scaleP = ease(Math.min(1, p / 0.6));
          const size = 20 + scaleP * 580;
          globe.style.width = `${size}px`;
          globe.style.height = `${size}px`;
        }

        // 【2】背景色块淡入：p 0.6 → 0.9
        const bgP = ease(Math.min(1, Math.max(0, (p - 0.6) / 0.3)));
        el.style.background = `linear-gradient(135deg, rgba(212,181,212,${bgP}) 0%, rgba(184,168,212,${bgP}) 50%, rgba(168,181,212,${bgP}) 100%)`;

        // 【3】四角内容淡入：只在渐变背景上出现（p 0.8 → 1.0）
        const cornerP = ease(Math.min(1, Math.max(0, (p - 0.8) / 0.2)));
        corners.forEach((c) => {
          c.style.opacity = String(cornerP);
        });

        // 滚出时
        const outP = ease(Math.max(0, (rawP - 1.0) / 0.3));
        if (globe) globe.style.opacity = String(1 - outP);
        corners.forEach((c) => {
          c.style.opacity = String(cornerP * (1 - outP));
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="s is-hsc" ref={ref}>
      <div hsc-track="" className="hsc-track">
        <div className="hsc-overlay-w">
          {/* 中央照片球：用 iframe 加载原始素材，不改样式 */}
          <div
            ref={globeRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
              background: "transparent",
              overflow: "hidden",
            }}
          >
            <iframe
              src="/card-globe/index.html"
              allowTransparency="true"
              onLoad={(e) => {
                const f = e.currentTarget;
                try {
                  const doc = f.contentDocument;
                  if (doc) {
                    doc.documentElement.style.background = "transparent";
                    if (doc.body) doc.body.style.background = "transparent";
                  }
                } catch {}
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "transparent",
              }}
            />
          </div>

          {/* 四角内容：和 about-demo.html 一模一样，初始 opacity: 0 */}
          {/* 左上：精准表达 */}
          <div
            hsc-corner=""
            style={{
              position: "absolute",
              top: "18%",
              left: "12%",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              opacity: 0,
            }}
          >
            <div style={{ fontSize: "28px", lineHeight: "1" }}>💯</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333", marginBottom: "4px" }}>
                精准表达
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>与人与 AI 的协作</div>
            </div>
          </div>

          {/* 右上：判断力 */}
          <div
            hsc-corner=""
            style={{
              position: "absolute",
              top: "18%",
              right: "12%",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              opacity: 0,
            }}
          >
            <div style={{ fontSize: "28px", lineHeight: "1" }}>🦋</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333", marginBottom: "4px" }}>
                判断力
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>发现问题 → AI 解法 → 判断验证</div>
            </div>
          </div>

          {/* 左下：审美感受力 */}
          <div
            hsc-corner=""
            style={{
              position: "absolute",
              bottom: "18%",
              left: "12%",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              opacity: 0,
            }}
          >
            <div style={{ fontSize: "28px", lineHeight: "1" }}>🌈</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333", marginBottom: "4px" }}>
                审美感受力
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>拉开差异化</div>
            </div>
          </div>

          {/* 右下：持续学习 */}
          <div
            hsc-corner=""
            style={{
              position: "absolute",
              bottom: "18%",
              right: "12%",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              opacity: 0,
            }}
          >
            <div style={{ fontSize: "28px", lineHeight: "1" }}>👨‍🦳</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 600, color: "#333", marginBottom: "4px" }}>
                持续学习
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>好奇心 + 高质量输入，才有好产出</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
