"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReveal } from "@/lib/useReveal";

/**
 * Manifesto (huge statement line) + Education/Expertise (two columns).
 * Customized: hero statement with highlight spans; left = EDUCATION, right = EXPERTISE.
 */
export default function ManifestoSection() {
  const ref = useReveal<HTMLElement>();
  const haloRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(197);
  const [matchOpen, setMatchOpen] = useState(false);

  // 液态玻璃按钮：鼠标高光跟随 + 3D 微倾斜
  const lgBtnRef = useRef<HTMLButtonElement>(null);
  const onLgPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = lgBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--ry", `${((e.clientX - rect.left) / rect.width - 0.5) * 3}deg`);
    el.style.setProperty("--rx", `${((e.clientY - rect.top) / rect.height - 0.5) * -2}deg`);
  };
  const onLgPointerLeave = () => {
    const el = lgBtnRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  useEffect(() => {
    const el = haloRef.current;
    if (el) {
      setOffset(Math.round(el.getBoundingClientRect().width) + 4);
    }
  }, []);

  // 互动测试：v8 弹窗被关闭后，退出全屏 iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "magnetic-match-closed") setMatchOpen(false);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const gray = "rgba(255,255,255,0.7)";
  const white = "#fff";
  const underlineStyle = {
    textDecoration: "underline",
    textDecorationColor: gray,
    textUnderlineOffset: "3px",
  };

  return (
    <>
    <section id="about" className="s" ref={ref}>
      <div className="c">
        <div className="spacer-10" />
        <div className="grid-main">
          <div className="mbm-diff mf-title-w">
            <h2 className="h-b">
              <span
                className="mf-line"
                style={{ fontSize: "21px", lineHeight: 1.8, textTransform: "none", fontWeight: 600, position: "relative", display: "block" }}
              >
                <span
                  ref={haloRef}
                  style={{ position: "absolute", top: "-4px", left: "0px", fontSize: "66px", lineHeight: 1, fontWeight: 600, color: white }}
                >
                  Halo，
                </span>
                <span style={{ display: "block", marginLeft: `${offset}px` }}>
                  <span style={{ color: gray }}>我是一位深耕教育与儿童赛道的 </span>
                  <span style={{ color: white }}>AI 应用产品经理</span>
                  <span style={{ color: gray }}>，掌握</span>
                  <span style={{ color: white }}>中文、英语、视觉、代码四种语言表达体系</span>
                  <span style={{ color: gray }}>，作用于人与人、人与 AI 的双重协作，以</span>
                  <span style={{ color: white }}>设计审美、工程落地与数据驱动</span>
                  <span style={{ color: gray }}>的</span>
                </span>
                <span style={{ display: "block" }}>
                  <span style={{ color: gray }}>复合能力，在 </span>
                  <span style={{ color: white }}>
                    <u style={underlineStyle}>K12 教育</u>、<u style={underlineStyle}>电商营销内容生产</u>、<u style={underlineStyle}>儿童陪伴</u>
                  </span>
                  <span style={{ color: gray }}>等三类场景中完成 AI 产品 0→1→n 落地。</span>
                </span>
              </span>
            </h2>
          </div>
        </div>
        <div className="spacer-10" />
        <div className="grid-main m-flex">
          {/* ============ 左列：EDUCATION ============ */}
          <div className="mbm-diff mf-left-w" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "12px", color: gray, fontWeight: 400, margin: 0, letterSpacing: "0.08em" }}>
              EDUCATION
            </h3>
            <div style={{ marginTop: "24px", fontSize: "14px", lineHeight: 1.5, color: white }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span>硕士·香港浸会大学</span>
                <span style={{ color: gray, fontSize: "0.85em" }}>2024-2026</span>
              </div>
              <p style={{ margin: "4px 0 16px", color: white }}>
                人工智能与数码媒体 (AI &amp; Digital Media)
              </p>
              <div style={{ height: "1px", backgroundColor: "rgba(111,111,111,0.2)", marginBottom: "18px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span>本科·山西大学·软件工程</span>
                <span style={{ color: gray, fontSize: "0.85em" }}>2014-2018</span>
              </div>
              <div style={{ height: "1px", backgroundColor: "rgba(111,111,111,0.2)", marginTop: "18px" }} />
            </div>
          </div>

          {/* ============ 右列：EXPERTISE ============ */}
          <div className="mbm-diff mf-right-w">
            <h3 style={{ fontSize: "12px", color: gray, fontWeight: 400, margin: 0, letterSpacing: "0.08em" }}>
              EXPERTISE
            </h3>
            <div style={{ marginTop: "24px", fontSize: "12px", lineHeight: 1.5, color: white }}>
              <p style={{ margin: "0 0 21px" }}>
                <strong>1️⃣AI 产品应用层落地经验</strong>：主导基于 LLM+RAG 的 K12 家庭 AI 伴学终端、基于垂类微调的营销图片 GC 中台、聚焦 Agent 记忆升级的儿童 AI 陪伴硬件 3 个 AI 产品的 0→1→n 的场景定义与体验导向方案落地。实现伴学机次周留存由 30% →40% 且续费率 6%↑、营销中台单张生产周期从半天压缩至 5 分钟且单运营月均产出 900+ 张。
              </p>
              <p style={{ margin: "0 0 21px" }}>
                <strong>2️⃣数据驱动的AIPM工作方法</strong>：具备从需求的抽象化、评测驱动产品、评估体系搭建、Badcase闭环优化到商业化验证去形成从数据→产品迭代的完整闭环工作方法。
              </p>
              <p style={{ margin: "0 0 21px" }}>
                <strong>3️⃣工程化搭建原型能力</strong>：可通过 Python 与 AI coding 快速搭建demo验证idea，缩短从概念到可行性验证的落地周期，曾独立完成北美官网 vibecoding 搭建并沉淀为可复用 skill。
              </p>
              <p style={{ margin: 0 }}>
                <strong>4️⃣复杂跨团队统筹与国际化视野</strong> ：具备高复杂度跨团队项目管理经验，在伴学机项目中统筹产研、教研等 6个跨职能团队保障敏捷交付。香港留学背景，英语可作为工作语言，高效对齐技术边界与协作。
              </p>
            </div>
          </div>
          {/* 磁场匹配器入口：与 EDUCATION/EXPERTISE 同一行网格，底边对齐右列底部，左边缘对齐列线2 */}
          <div className="mf-entry-w" style={{ alignSelf: "end", justifySelf: "start" }}>
            <button
              ref={lgBtnRef}
              type="button"
              className="liquid-glass-button"
              onClick={() => setMatchOpen(true)}
              onPointerMove={onLgPointerMove}
              onPointerLeave={onLgPointerLeave}
            >
              <span className="liquid-glass-button__label">
                <span className="lg-emoji">🔮</span>
                <span className="lg-label-mask">
                  {Array.from("测测我们是不是天选事业搭子").map((c, i) => (
                    <span key={i} className="lg-char">{c}</span>
                  ))}
                </span>
                <span className="lg-arrow">→</span>
              </span>
            </button>
          </div>
        </div>
        <div className="spacer-10" />
      </div>
    </section>
    {/* 互动测试：通过 Portal 渲染到 body，脱离 .page-w 层叠上下文，
        毛玻璃深色遮罩才能盖住导航栏；iframe 只含你做好的 v8 弹窗本体 */}
    {matchOpen &&
      createPortal(
        <div
          onClick={() => setMatchOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(20,20,20,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <iframe
            src="/magnetic-match/magnetic-match-modal.html"
            title="磁场匹配器"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1080px, 96vw)",
              height: "92vh",
              border: "none",
              background: "transparent",
              borderRadius: "24px",
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
