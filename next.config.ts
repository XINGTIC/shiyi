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
  // 确保输出格式兼容 Cloudflare Pages
  output: undefined, // 不使用 standalone，让 Cloudflare Pages 自动处理
};

export default nextConfig;
