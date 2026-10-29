"use client";

import { useEffect, useRef } from "react";
import { useReveal } from "@/lib/useReveal";

const ASSET =
  "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images";

type Experience = {
  key: string;
  hoverName: string;
  company: string;
  role: string;
  period: string;
  tags: string[];
  logoDark: string;
  logoLight: string;
};

const EXPERIENCES: Experience[] = [
  {
    key: "tom",
    hoverName: "金科汤姆猫",
    company: "金科汤姆猫（AI 事业部）·杭州",
    role: "AI 产品经理",
    period: "2026.06-2026.08",
    tags: [
      "儿童陪伴 AI 消费硬件",
      "Agent 对话与记忆策略优化",
      "评测体系与 Badcase 迭代",
      "出海独立站搭建",
    ],
    logoDark: `${ASSET}/logo-tom-dark.png`,
    logoLight: `${ASSET}/logo-tom-light.png`,
  },
  {
    key: "yiqi",
    hoverName: "一起教育",
    company: "一起教育科技·北京",
    role: "PM&UX",
    period: "2021.06-2024.05",
    tags: [
      "教育・校内业务",
      "AI 应用层产品策略",
      "无障碍体验设计",
      "项目管理",
    ],
    logoDark: `${ASSET}/logo-yiqi-dark.png`,
    logoLight: `${ASSET}/logo-yiqi-light.png`,
  },
  {
    key: "doubao",
    hoverName: "豆包网",
    company: "豆包网·北京",
    role: "UX",
    period: "2019.04-2021.03",
    tags: ["B2B・保险 SaaS", "系统设计", "用户研究", "需求分析"],
    logoDark: `${ASSET}/logo-doubao-dark.png`,
    logoLight: `${ASSET}/logo-doubao-light.png`,
  },
  {
    key: "moka",
    hoverName: "魔卡情感",
    company: "魔卡情感·北京",
    role: "产品设计",
    period: "2018.02-2019.03",
    tags: ["知识付费", "内容产品", "社区产品", "商业化增长"],
    logoDark: `${ASSET}/logo-moka-dark.png`,
    logoLight: `${ASSET}/logo-moka-light.png`,
  },
];

const PLUS =
  "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/6814c40aae002383aa8ef412_+.svg";

/**
 * Trusted by — 4 work-experience rows: each row is one wide card
 * (5× the original cell width, same height) with logo on the left and
 * three left-aligned text lines on the right. Keeps the original dashed
 * border, "+" corner ornaments, hover dim + tag swap behavior.
 */
export default function ClientsSection() {
  const ref = useReveal<HTMLElement>();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-client-item]")
    );
    const tag = el.querySelector<HTMLElement>("[data-client-tag]");
    const original = tag?.textContent ?? "";

    const onEnter = (item: HTMLElement) => {
      const name = item.getAttribute("data-client-item") ?? "";
      items.forEach((it) => {
        it.style.opacity = it === item ? "1" : "0.4";
      });
      if (tag && name) tag.textContent = name;
    };
    const onLeave = () => {
      items.forEach((it) => (it.style.opacity = "1"));
      if (tag) tag.textContent = original;
    };

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => onEnter(item));
      item.addEventListener("mouseleave", onLeave);
    });
    return () => {
      items.forEach((item) => {
        item.removeEventListener("mouseenter", () => onEnter(item));
        item.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <section className="s" ref={ref}>
      <div className="c">
        <div className="spacer-10" />
        <div className="grid-main is-home-client" data-client-section ref={sectionRef}>
          <div className="eb-wrap is--clients cl-label-w">
            <div className="o-hidden t-flex">
              <h2 className="h-eyebrow">Worked at</h2>
              <h2 className="h-eyebrow is--outline" data-client-tag>
                Companies
              </h2>
            </div>
          </div>
          <div className="home-client__grid-w mbm-diff cl-grid-w">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.key}
                className="home-client__grid-item exp-item"
                data-client-item={exp.hoverName}
              >
                <div className="home-client__border" />
                <div className="home-client__corner-w">
                  <img className="home-client__corner-img is-1" src={PLUS} alt="" />
                  <img className="home-client__corner-img is-2" src={PLUS} alt="" />
                  <img className="home-client__corner-img is-3" src={PLUS} alt="" />
                  <img className="home-client__corner-img is-4" src={PLUS} alt="" />
                </div>
                <div className="exp-inner">
                  <div className="exp-logo-w">
                    <img
                      className="exp-logo exp-logo--dark"
                      src={exp.logoDark}
                      alt=""
                    />
                    <img
                      className="exp-logo exp-logo--light"
                      src={exp.logoLight}
                      alt=""
                    />
                  </div>
                  <div className="exp-text-w">
                    <div className="exp-period text-mini">{exp.period}</div>
                    <div className="exp-company-w">
                      <span className="exp-company">{exp.company}</span>
                      <span className="exp-divider" />
                      <span className="exp-role">{exp.role}</span>
                    </div>
                    <div className="exp-tags">
                      {exp.tags.map((t) => (
                        <span key={t} className="exp-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="spacer-10" />
      </div>
    </section>
  );
}
