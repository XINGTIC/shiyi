import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Cloudflare Pages 需要此配置
  },
  // Cloudflare Pages 兼容性配置
  trailingSlash: false,
};

export default nextConfig;
