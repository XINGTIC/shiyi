import type { NextConfig } from "next";

// 测试配置：静态导出（仅用于测试前端是否能正常显示）
// 注意：这会禁用 API Routes
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  trailingSlash: false,
  // 临时测试：静态导出
  output: 'export',
};

export default nextConfig;

