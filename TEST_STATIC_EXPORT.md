# 测试方案：静态导出（临时）

## 目的
测试前端页面是否能正常显示，排除路由问题。

## 注意
⚠️ **这会禁用 API Routes**，所以试衣功能暂时无法使用，但可以验证前端页面是否能正常显示。

## 操作步骤

### 步骤 1：修改 next.config.ts

将 `next.config.ts` 的内容替换为：

```typescript
import type { NextConfig } from "next";

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
  output: 'export', // 添加这一行
};

export default nextConfig;
```

### 步骤 2：修改 Cloudflare Pages 设置

1. 进入 Cloudflare Pages 项目设置
2. 找到 **Build output directory**
3. 改为：`out`
4. 保存设置

### 步骤 3：重新部署

1. 推送代码到 GitHub
2. Cloudflare Pages 会自动重新部署
3. 等待部署完成

### 步骤 4：测试

1. 访问 `https://shiyi-dz1.pages.dev/`
2. 如果能看到页面（即使 API 不工作），说明问题在 API Routes 配置
3. 如果还是 404，说明问题更深层

## 如果静态导出可以显示页面

说明问题在于 Cloudflare Pages 对 Next.js API Routes 的支持。我们需要：
1. 将 API 逻辑移到 Cloudflare Workers
2. 或者使用其他部署方案

## 如果静态导出还是 404

说明问题可能在：
1. 构建过程本身
2. Cloudflare Pages 配置
3. 需要查看构建日志进一步诊断

