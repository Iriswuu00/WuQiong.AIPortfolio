"use client";

import { useReveal } from "@/lib/useReveal";

const IMG_BASE = "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/";

/**
 * Footer — top row: big CTA column (How about / we do a thing /
 * or two, + Get in touch / To+Gether) on the left, contact rows
 * (Email / Tel / CV) on the right; bottom row:
 * WeChat QR note on the left, selfie + 欢迎链接 ♾️. on the right.
 */
export default function FooterSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="s is-footer" ref={ref}>
      <div className="c is-footer">
        <div className="ft-content-w">
          <div className="spacer-5" />
          <div className="grid-main is-footer">
            <div className="ft-top-row">
              <div className="grid-main ft-cta-grid">
                <div className="mbm-diff">
                  <div stagger-scroll="" split-text="" className="h-a is-sub">
                    How about we do a
                  </div>
                </div>
                <div className="ft-cta-row">
                  <div className="mbm-diff is-nb">
                    <div stagger-scroll="" split-text="" className="h-a is-sub">
                      thing or two,
                    </div>
                  </div>
                  <div className="page-btn-w">
                    <div className="o-hidden is-flex">
                      <div className="btn-w is-large w-inline-block">
                        <div className="btn-inner">
                          <div className="o-hidden">
                            <div stagger-text="" className="btn-txt">Get in touch</div>
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
                  </div>
                </div>
                <div className="mbm-diff">
                  <div stagger-scroll="" split-text="" className="h-a is-sub">
                    To+Gether
                  </div>
                </div>
              </div>

              <div className="grid-main ft-contact-w">
                <div className="ft-contact-row">
                  <span className="text-small caps op-60 ft-contact-label">Email</span>
                  <span className="text-small ft-contact-value">
                    <a href="mailto:24465992@life.hkbu.edu.hk" target="_blank" rel="noreferrer">24465992@life.hkbu.edu.hk</a>
                  </span>
                  <span className="btn-icon-w ft-contact-icon">
                    <span className="btn-txt">↗</span>
                  </span>
                </div>
                <div className="ft-line">
                  <div className="ft-line-fill" />
                </div>
                <div className="ft-contact-row">
                  <span className="text-small caps op-60 ft-contact-label">Tel</span>
                  <span className="text-small ft-contact-value">
                    <a href="tel:+8615735105282">+86 15735105282</a>
                  </span>
                  <span className="ft-contact-icon" />
                </div>
                <div className="ft-line">
                  <div className="ft-line-fill" />
                </div>
                <div
                  className="ft-contact-row"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open('/resume/wuqiong-resume.pdf', '_blank');
                    const a = document.createElement('a');
                    a.href = '/resume/wuqiong-resume.pdf';
                    a.download = 'AI产品经理_吴琼_香港浸会大学硕士_15735105282.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <span className="text-small caps op-60 ft-contact-label">CV</span>
                  <span className="text-small ft-contact-value">
                    下载我的简历
                  </span>
                  <span className="btn-icon-w ft-contact-icon">
                    <span className="btn-txt">↓</span>
                  </span>
                </div>
                <div className="ft-line">
                  <div className="ft-line-fill" />
                </div>
              </div>
            </div>

            <div className="ft-btm">
              <div className="ft-nav-col is-ai">
                <p split-text="" className="text-small caps op-60">
                  Scan the QR code to add my WeChat
                </p>
                <div className="ft-nav-link-w is--ai">
                  <img
                    className="ft-qr"
                    src={IMG_BASE + "wechat-qr.png"}
                    alt="WeChat QR code"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="ft-brand-w">
                <img
                  className="ft-selfie"
                  src={IMG_BASE + "selfie.png"}
                  alt="吴琼"
                  loading="lazy"
                />
                <div stagger-scroll="1" split-text="" className="text-brand-footer">
                  欢迎链接 ♾️.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
