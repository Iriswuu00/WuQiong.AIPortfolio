import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollFX from "@/components/sites/itsoffbrand-com-9e173219/root-8a5edab2/ScrollFX";
import ImageProtection from "@/components/ImageProtection";
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
  title: "OFF+BRAND. | Global Creative & Technology Studio",
  description:
    "Award-winning creative & technology studio. Branding, web design and development for ambitious brands.",
  icons: {
    icon: "/sites/itsoffbrand-com-9e173219/root-8a5edab2/images/64ddf4bf30ef3bf0337f569f_UM - 1.jpg",
  },
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
      </body>
    </html>
  );
}
