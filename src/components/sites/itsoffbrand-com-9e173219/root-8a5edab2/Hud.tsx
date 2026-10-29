"use client";

import { useState, useEffect } from "react";
import {
  TwitterIcon,
  AwwwardsIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../shared/icons";
import Link from "next/link";

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Work", href: "/our-work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const MENU_LINKS_ALT = [
  { label: "W. Enterprise", href: "/webflow-enterprise", rotate: true },
  {
    label: "Manifesto",
    href: "https://manifesto.itsoffbrand.com/",
    external: true,
    rotate: true,
  },
];

const NAV_LINKS = [
  { label: "关于我", href: "/#about", external: false },
  { label: "项目&作品", href: "/#work", external: false },
];

const SOCIALS = [
  { label: "Twitter / X", href: "https://twitter.com/itsoffbrand", Icon: TwitterIcon },
  {
    label: "Awwwards",
    href: "https://www.awwwards.com/offbrand/#work",
    Icon: AwwwardsIcon,
    awww: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/offbrand.studio/",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/itsoffbrand",
    Icon: LinkedInIcon,
  },
];

function GhostLink({
  label,
  href,
  external,
  mini,
  rotate,
  className,
}: {
  label: string;
  href: string;
  external?: boolean;
  mini?: boolean;
  rotate?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <div className="o-hidden page-link-inner">
        <div split-text="" stagger-text="" className={`${mini ? "text-mini" : "text-small"} btn-txt`}>
          {label}
        </div>
        <div className="btn-icon-r">
          <div className={`btn-icon-w ${rotate ? "is-rotate" : ""}`}>
            <div className={`btn-txt ${mini ? "text-mini" : "text-small"}`}>
              -&gt;
            </div>
          </div>
        </div>
      </div>
      <div className="link-track">
        <div className="link-track-fill" />
      </div>
    </>
  );
  if (external) {
    return (
      <a
        className={`page-link-w w-inline-block ${className ?? ""}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        stagger-el=""
      >
        {inner}
      </a>
    );
  }
  return (
    <Link
      className={`page-link-w w-inline-block ${className ?? ""}`}
      href={href}
      stagger-el=""
    >
      {inner}
    </Link>
  );
}

export default function Hud() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !light);
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <div className="hud-w" data-cursor-hover>
      <div className="c is-hud">
        <div className="hud-content">
          {/* Brand */}
          <div className="hud-brand-w" data-cursor-hover>
            <Link href="/" className="hud-brand-link w-inline-block">
              <div className="text-brand">
                吴琼<span className="brand-inf">∞</span>AI PM.
              </div>
            </Link>
          </div>

          {/* Top nav */}
          <div className="hud-nav-w" data-cursor-hover>
            <div className="hud-nav-flex">
              {NAV_LINKS.map((l) => (
                <GhostLink
                  key={l.label}
                  label={l.label}
                  href={l.href}
                  external={l.external}
                  className="page-link-w"
                />
              ))}
              <a
                href="/resume/wuqiong-resume.pdf"
                target="_blank"
                className="btn-w w-inline-block"
                data-cursor-hover
                onClick={(e) => {
                  const a = document.createElement('a');
                  a.href = '/resume/wuqiong-resume.pdf';
                  a.download = 'AI产品经理_吴琼_香港浸会大学硕士_15735105282.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <div className="btn-inner">
                  <div className="o-hidden">
                    <div stagger-text="" className="btn-txt">下载简历</div>
                  </div>
                  <div className="btn-icon-w">
                    <div className="text-small btn-txt">-&gt;</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hud-scroll-w" pointer-none="">
            <div className="hud-scroll-inner">
              <div className="hud-scroll-line-top" />
              <div className="hud-scroll-dot" />
              <div className="hud-scroll-line-btm" />
            </div>
          </div>

          {/* Burger */}
          <div
            className={`hud-menu-w ${open ? "is-open" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
          >
            <div className="hud-menu-c">
              <div className="hud-menu-line is-1" />
              <div className="hud-menu-line is-2" />
              <div className="hud-menu-line is-3" />
            </div>
          </div>

          {/* Menu overlay */}
          <div className={`hud-menu-o ${open ? "is-open" : ""}`}>
            <div className="hud-menu-bg" />
            <div className="hud-menu-content">
              <div className="hud-menu-link-w">
                {MENU_LINKS.map((l) => (
                  <div key={l.label} className="o-hidden">
                    <div className="o-hidden menu-l2">
                      <Link
                        href={l.href}
                        className="hud-menu-link w-inline-block"
                      >
                        <GhostLinkContent label={l.label} />
                      </Link>
                    </div>
                  </div>
                ))}
                {MENU_LINKS_ALT.map((l) => (
                  <div key={l.label} className="o-hidden">
                    <div className="o-hidden menu-l2">
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hud-menu-link w-inline-block"
                        >
                          <GhostLinkContent label={l.label} rotate={l.rotate} />
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="hud-menu-link w-inline-block"
                        >
                          <GhostLinkContent label={l.label} rotate={l.rotate} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hud-menu-sublink-w">
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Careers", href: "/careers" },
                ].map((l) => (
                  <div key={l.label} className="o-hidden">
                    <div className="o-hidden menu-l2">
                      <Link href={l.href} className="hud-menu-link w-inline-block">
                        <GhostLinkContent label={l.label} mini />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hud-menu-socials">
                {SOCIALS.map(({ label, href, Icon, awww }) => (
                  <div key={label} className="hud-social-w">
                    <div className="o-hidden">
                      <a
                        className="hud-social-link w-inline-block"
                        href={href}
                        aria-label={label}
                        title={label}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div
                          className={`hud-social-img ${awww ? "is--awww" : ""}`}
                        >
                          <Icon />
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GhostLinkContent({
  label,
  mini,
  rotate,
}: {
  label: string;
  mini?: boolean;
  rotate?: boolean;
}) {
  return (
    <>
      <div className="o-hidden page-link-inner">
        <div stagger-text="" className={mini ? "text-mini" : "text-small btn-txt"}>
          {label}
        </div>
        <div className="btn-icon-r">
          <div className={`btn-icon-w ${rotate ? "is-rotate" : ""}`}>
            <div className={`btn-txt ${mini ? "text-mini" : "text-small"}`}>
              -&gt;
            </div>
          </div>
        </div>
      </div>
      <div className="link-track">
        <div className="link-track-fill" />
      </div>
    </>
  );
}
