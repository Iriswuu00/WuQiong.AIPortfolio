"use client";

import { useReveal } from "@/lib/useReveal";

type AwardItem = { label: string; href?: string; sub?: boolean; icon?: "github" };

const AWARDS: {
  num: string;
  title: string;
  items: AwardItem[];
}[] = [
  {
    num: "01",
    title: "Skills",
    items: [
      { label: "「howto-design-landingpage」自研 Skill", href: "https://github.com/Iriswuu00/howto-design-landingpage", icon: "github" },
      { label: "搭建一页式海外独立站官网，服务小B小C商家与企业", sub: true },
      { label: "调用 Skill 搭建的 LandingPage Demo", sub: true, href: "/work-tom-compare/index.html" },
    ],
  },
  {
    num: "02",
    title: "Prompt Engineering",
    items: [{ label: "System Prompt 设计与 badcase 驱动迭代", href: "/prompt-engineering/index.html" }],
  },
  {
    num: "03",
    title: "Taste",
    items: [
      {
        label: "Granola ・ AI meeting notetaker with innovative UX",
        href: "https://www.granola.ai/",
      },
      {
        label: "豆包输入法 ・ AI 智能输入法",
        href: "https://shurufa.doubao.com/",
      },
      {
        label: "默造消音口罩 ・ AI 语音输入硬件",
        href: "https://item.jd.com/100275577415.html?pcdk=DhhJN93b-UXh2u0RCWcDAX6G7qrn6Zw9Kd6p5ycdkP0Smn9oB1_oEsL_ckGIpnCJ.3z6a.aI3x&spmTag=YTAyMTkuYjAwMjM1Ni5jMDAwMDcxNjMuMSU0MDE3ODk0NjA3NDYwMzElMjM2NjQwNDYxNjklMjMyMDE0NzA5MTc4JTJDYTAyNDAuYjAwMjQ5My5jMDAwMDQwMjcuMiUyM3NrdV9jYXJkJTQwMTc4OTQ2MDc5MzI5OSUyMzY2NDA0NjE2OSUyMzIyOTQ3OTk1Nw",
      },
    ],
  },
  {
    num: "04",
    title: "AI Learning",
    items: [
      { label: "Podcast 播客 ・ 行业深度解读" },
      { label: "X ・ 全球 AI 动态" },
      { label: "小红书 ・ 国内 AI 资讯" },
    ],
  },
];

/**
 * Recognitions + Awards — sticky label with 50 count, four rows.
 * Each row: number, institution title, then the detail list pushed
 * to the right edge (.haw-item-sub-wrap margin-left:auto), each
 * detail a horizontal pair of name + count (float-count is-haw).
 */
export default function AwardsSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="s is-aw" id="ai-capabilities" ref={ref}>
      <div className="c">
        <div className="spacer-10" />
        <div className="grid-main t-flex">
          <div className="eb-wrap is-sticky aw-label-w">
            <div className="o-hidden t-flex">
              <h2 className="h-eyebrow">
                AI <span className="aw-inf">∞</span>
                <br />Capabilities
              </h2>
            </div>
          </div>
          <div className="haw-sub-group aw-grid-w">
            {AWARDS.map((a) => (
              <div key={a.num} className="haw-grid-row">
                <div className="haw-grid-item mbm-diff">
                  <p split-text="" className="text-mini">{a.num}</p>
                  <p split-text="" className="h-c caps">{a.title}</p>
                  <div className="haw-item-sub-wrap">
                    {a.items.map((it) => {
                      if (it.sub) {
                        const subInner = (
                          <>
                            <p split-text="" className="text-mini aw-sub">
                              {it.label}
                            </p>
                            {it.href ? (
                              <div
                                split-text=""
                                className="text-mini float-count is-haw aw-sub-mark"
                              >
                                ↗
                              </div>
                            ) : null}
                          </>
                        );
                        return it.href ? (
                          <a
                            key={it.label}
                            href={it.href}
                            {...(it.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                            className="rel is-h-flex aw-sub-row"
                          >
                            {subInner}
                          </a>
                        ) : (
                          <p
                            key={it.label}
                            split-text=""
                            className="text-mini aw-sub"
                          >
                            {it.label}
                          </p>
                        );
                      }
                      const inner = (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {it.icon === "github" ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flex: "none" }}>
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                              </svg>
                            ) : null}
                            <p split-text="" className="text-small caps">
                              {it.label}
                            </p>
                          </div>
                          {it.href ? (
                            <div split-text="" className="text-mini float-count is-haw">
                              ↗
                            </div>
                          ) : null}
                        </>
                      );
                      return it.href ? (
                        <a
                          key={it.label}
                          href={it.href}
                          {...(it.href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          className="rel is-h-flex"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={it.label} className="rel is-h-flex is-plain">
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="link-track">
                  <div className="link-track-fill" />
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
