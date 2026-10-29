export const metadata = {
  title: "下载简历 · 吴琼 AI PM",
};

export default function ResumePage() {
  return (
    <main className="s">
      <div className="c">
        <div className="spacer-10" />
        <div
          className="grid-main"
          style={{
            minHeight: "70vh",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div className="mbm-diff" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2em" }}>
            <h1 className="h-a" style={{ textTransform: "none" }}>
              下载简历
            </h1>
            <p className="text-small caps" style={{ opacity: 0.7 }}>
              吴琼 · AI PM
            </p>
            <a
              href="/resume/wuqiong-resume.pdf"
              download
              className="btn-w w-inline-block"
              data-cursor-hover
            >
              <div className="btn-inner">
                <div className="o-hidden">
                  <div className="btn-txt">下载 PDF</div>
                </div>
                <div className="btn-icon-w">
                  <div className="text-small btn-txt">-&gt;</div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className="spacer-10" />
      </div>
    </main>
  );
}
