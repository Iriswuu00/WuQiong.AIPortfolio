"use client";

import { useEffect, useRef } from "react";
import { useReveal } from "@/lib/useReveal";
import Link from "next/link";
import { PlusIcon } from "../shared/icons";

const PROJECTS = [
  {
    title: "AI Tom Bud 北美出海官网",
    tags: ["● 出海官网搭建", "△ skill 设计", "⁂ Vibe Coding"],
    href: "/work1-demo/index.html",
    img: "../work/work1-cover.png",
  },
  {
    title: "AI 桌伴汤姆猫 Pro 版",
    tags: ["● AI Agent", "△ Memory System", "⁂ Badcase 闭环优化"],
    href: "/work-project2/index.html",
    img: "../work/work_project2_cover.png",
  },
  {
    title: "电商营销 AIGC 图片生产中台",
    tags: ["● AIGC", "△ 评测体系设计", "⁂ LoRA 微调"],
    href: "/work-project3/index.html",
    img: "../work/work_project3_cover.png",
  },
  {
    title: "基于 LLM 的多端 AI 辅导伴学系统",
    tags: ["● LLM+RAG 应用落地", "△ K12 教育场景", "⁂ 软硬一体"],
    href: "/work-project4/index.html",
    img: "../work/work_4.png",
  },
  {
    title: "EasyI 保险 CRM 工具",
    tags: ["● B 端工具", "△ 用户访谈", "⁂ 保险行业数字化"],
    href: "/work-project5-easyi/index.html",
    img: "../work/work_7.png",
  },
  {
    title: "学生端无障碍体验重构",
    tags: ["● 无障碍系统设计", "△ 项目管理", "⁂ 公益 · 教育公平"],
    href: "/work-project6-accessibility/index.html",
    img: "../work/work_5.png",
  },
  {
    title: "魔卡情感小程序",
    tags: ["● 用户增长与商业化重构", "△ 情感咨询平台", "⁂ 设计规范搭建"],
    href: "/work-project7-moka/index.html",
    img: "../work/work_6.png",
  },
  {
    title: "「豆包数云」SaaS 云平台",
    tags: ["● 数据看板设计", "△ 内容板块优化", "⁂ 官网改版"],
    href: "/work-project8-doucloud/index.html",
    img: "../work/work_doucloud.jpeg",
  },
  {
    title: "营销活动视觉设计作品",
    tags: ["● H5 互动测试", "△ 海报库", "⁂ 游戏化设计"],
    href: "/work-project9-persona/index.html",
    img: "../work/work_persona.jpeg",
  },
  {
    title: "小学自习仓",
    tags: ["● 终端设计", "△ 智能硬件", "⁂ 校内课后场景"],
    href: "/work-project10-zixicang/index.html",
    img: "../work/work_10.jpeg",
  },
  {
    title: "数据看板设计",
    tags: ["● Dashboard 可视化", "△ 后台管理系统", "⁂ 数字孪生"],
    href: "/work-project11-dataviz/index.html",
    img: "../work/work_11.png",
  },
];

const IMG_BASE = "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/";

/**
 * Featured Work — label + All Work pill + 11 count live together in the
 * left 2 columns (source #w-node-a03c9311 grid-area: span 1/span 2), the
 * project grid occupies columns 5–12. Cards are 2-column squares
 * (hcs-grid-w 8 cols, each card span 4). Waterfall: JS scrubs odd cards
 * (col 1) translateY +10em→0 and even cards (col 2) -10em→0 across the
 * section scroll (source $c() trigger [home-work]; direction matches user
 * shot-4: Trevor Noah (col 2) sits above, Microsoft (col 1) below).
 */
export default function FeaturedWorkSection() {
  const ref = useReveal<HTMLElement>();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = Array.from(
      el.querySelectorAll<HTMLElement>(".hcs-item-w")
    );
    if (cards.length === 0) return;

    // All Work button: outline at top, fills solid once the section
    // scrolls into view (source btn-bg-w display:none + reveal).
    const btn = el.closest("section")?.querySelector(".btn-bg-w");

    // initial waterfall offsets (no CSS transition on transform; opacity only).
    // left column (odd) sits a constant half-card-height higher; right column
    // (even) starts −10em and scrubs to 0 as the section scrolls in.
    cards.forEach((card, i) => {
      const odd = i % 2 === 0;
      card.style.transitionProperty = "opacity";
      card.style.transform = odd
        ? `translateY(-50%)`
        : `translateY(-10em)`;
    });

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const h = rect.height || 1;
      const p = Math.min(Math.max(-rect.top / h, 0), 1);
      // reveal the solid All Work fill once the section top enters the
      // viewport (source: outline pill → solid on scroll)
      if (btn && rect.top < window.innerHeight * 0.95) {
        btn.classList.add("is-on");
      }
      cards.forEach((card, i) => {
        const odd = i % 2 === 0;
        // odd (left column): constant −50% (half card height up), no scrub.
        // even (right column): scrub −10em → 0.
        card.style.transform = odd
          ? `translateY(-50%)`
          : `translateY(${-10 * (1 - p)}em)`;
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
    <section id="work" home-work="" className="s" ref={ref}>
      <div className="c">
        <div className="spacer-10" />
        <div className="grid-main is-hw">
          <div className="eb-wrap is-sticky fw-label-w">
            <div className="o-hidden">
              <h2 className="h-eyebrow">Featured work</h2>
            </div>
            <div className="page-btn-w">
              <div className="o-hidden is-flex">
                <div
                  stagger-el=""
                  className="btn-w w-inline-block"
                >
                  <div className="btn-inner">
                    <div className="o-hidden">
                      <div stagger-text="" className="btn-txt">All Work</div>
                    </div>
                    <div className="btn-icon-w">
                      <div className="text-small btn-txt">-&gt;</div>
                    </div>
                  </div>
                  <div className="btn-bg-w">
                    <div className="btn-bg-fill" />
                  </div>
                </div>
              </div>
              <div className="text-mini float-count is-fw fw-count">11</div>
            </div>
          </div>
          <div className="grid-main hcs-grid-w fw-grid-w" ref={sectionRef}>
            {PROJECTS.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="hcs-item-w w-inline-block"
                style={{ ["--cover-img" as string]: `url(${IMG_BASE + p.img})` }}
              >
                <div className="hcs-titles-w">
                  <div className="hcs-titles">
                    <div className="hcs-info-w">
                      <h3 className="text-small caps" style={{ color: "#fff" }}>
                        {p.title}
                      </h3>
                      <div className="hcs-title-w">
                        {p.tags.map((t) => (
                          <p key={t} className="text-mini" style={{ color: "#fff" }}>
                            {t}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hcs-cross-w">
                    <div className="hsc-cross" style={{ color: "#fff" }}>
                      <PlusIcon />
                    </div>
                  </div>
                </div>
                <div className="hcs-veil" />
                <div className="hcs-img-w is-component">
                  <img
                    className="hcs-img-inner"
                    src={IMG_BASE + p.img}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="spacer-10" />
      </div>
    </section>
  );
}
