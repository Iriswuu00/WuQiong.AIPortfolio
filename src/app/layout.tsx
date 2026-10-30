import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollFX from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ScrollFX";
import ImageProtection from "@/components/ImageProtection";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const ataero = localFont({
  src: [
    {
      path: "../../public/sites/itsoffbrand-com-9e173219/root-8a5edab2/fonts/ataero-retina.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ataero",
  display: "swap",
});

export const metadata: Metadata = {
  title: "吴琼. | UX Design & AIPM Studio",
  description:
    "吴琼 · AI产品经理作品集，专注于UX设计与AI产品创新。",
  icons: {
    icon: "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/64ddf4bf30ef3bf0337f569f_UM - 1.jpg",
  },
  links: [
    {
      rel: "preload",
      href: "/sites/itsoffbrand-com-9e173219/root-8a5edab2/orb.min.js",
      as: "script",
      fetchPriority: "high",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${ataero.variable}`}>
      <body style={{ fontFamily: "var(--font-ataero), sans-serif" }}>
        {children}
        <ScrollFX />
        <ImageProtection />
        <SmoothScroll />
      </body>
    </html>
  );
}
