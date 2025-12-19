# Cloudflare Pages 配置说明

## 重要：Cloudflare Pages 设置

由于 `@cloudflare/next-on-pages` 不支持 Next.js 16，我们需要使用 Cloudflare Pages 的原生 Next.js 支持。

### 在 Cloudflare Pages 项目设置中配置：

1. **Framework preset**: `Next.js`（自动检测）

2. **Build command**: `npm run build`

3. **Build output directory**: **`.next`**（重要！）
   - 不要使用 `out` 或 `.vercel/output/static`
   - 使用 `.next` 作为输出目录

4. **Root directory**: `/`（留空）

5. **Node.js version**: 确保使用 Node.js 18 或更高版本
   - 在 "Environment variables" 中可以设置 `NODE_VERSION=18` 或 `NODE_VERSION=20`

6. **环境变量**（必须配置）:
   - `DASHSCOPE_API_KEY` = 你的阿里云百炼 API Key
   - `NEXT_PUBLIC_IMGBB_API_KEY` = 你的 imgbb API Key

## 已完成的配置

✅ API 路由已配置边缘运行时（`export const runtime = 'edge'`）
✅ Next.js 配置已优化（`unoptimized: true`）
✅ Image 组件已修复（使用普通 `<img>` 标签处理 base64）

## 如果仍然失败

请检查 Cloudflare Pages 的构建日志，确认：
1. 构建是否成功完成
2. 部署阶段的具体错误信息
3. 构建输出目录是否正确

如果构建成功但部署失败，可能是构建输出目录设置错误。请确保使用 `.next` 作为输出目录。


