import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: ["192.168.2.227"],
};

export default nextConfig;
