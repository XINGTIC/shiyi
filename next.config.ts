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
  // Cloudflare Pages 配置
  output: 'standalone', // 使用 standalone 输出模式
};

export default nextConfig;
