# Cloudflare Pages 部署检查清单

## ✅ 已完成的任务

### 1. 修复阿里云 API 调用逻辑
- ✅ 后端下载图片为 ArrayBuffer
- ✅ 上传图片到阿里云临时存储获取内部 URL
- ✅ 使用阿里云内部 URL 调用试衣 API
- ✅ 避免直接使用外部图床 URL，解决 "url error" 问题

### 2. 适配 Cloudflare Pages 构建
- ✅ API 路由已配置边缘运行时 (`export const runtime = 'edge'`)
- ✅ Next.js 配置已优化 (`unoptimized: true`)
- ✅ Image 组件已修复（使用普通 `<img>` 标签处理 base64）
- ✅ 构建脚本已配置 (`npm run build`)

### 3. 环境变量配置
- ✅ 已创建 `ENVIRONMENT_VARIABLES.md` 文档
- ✅ 列出了所有必需的环境变量

### 4. 错误处理增强
- ✅ 前端错误捕获已增强
- ✅ 显示详细的错误信息（包括错误码和详细信息）
- ✅ 改进的错误提示信息

## 📋 部署前检查清单

### Cloudflare Pages 设置

1. **Framework preset**: `Next.js`
2. **Build command**: `npm run build`
3. **Build output directory**: `.next`
4. **Root directory**: `/`（留空）

### 环境变量（必须在 Cloudflare Pages 中配置）

在 **Settings** → **Environment variables** 中添加：

1. `DASHSCOPE_API_KEY` = `sk-8e292aa35bc94dfab4c0da3a43ac0229`
2. `NEXT_PUBLIC_IMGBB_API_KEY` = `8069a090347d7175fa8bb32fa2324541`

**重要**: 确保两个环境变量都添加到 **Production** 和 **Preview** 环境。

### SSL/TLS 设置（重要）

1. 在 Cloudflare Dashboard 左侧菜单选择 **SSL/TLS** → **Overview**
2. 将模式改为 **Full (Strict)**
3. 如果模式不对，网页可能会报"重定向次数过多"或直接打不开

### DNS 设置（如果使用自定义域名）

1. 在 **DNS** 页面，确保你的域名有一条 **CNAME** 记录
2. 指向 `你的项目名.pages.dev`
3. 确保"小云朵"（Proxy）是开启状态（橘黄色）

## 🚀 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "优化项目以适配 Cloudflare Pages 并修复阿里云 API"
   git push origin main
   ```

2. **等待自动部署**
   - Cloudflare Pages 会自动检测到新提交
   - 开始构建和部署（通常 2-5 分钟）

3. **检查构建日志**
   - 在 Cloudflare Pages 项目页面
   - 点击 "Deployments" 标签
   - 查看最新的构建日志
   - 如果失败，查看最后的红色错误信息

4. **测试应用**
   - 访问部署后的 URL
   - 测试上传图片和生成试衣效果
   - 检查错误处理是否正常工作

## 🔍 故障排查

### 如果构建失败

1. 查看构建日志的最后几行
2. 检查是否有环境变量缺失的错误
3. 检查输出目录配置是否正确

### 如果应用返回 404

1. 检查 "Build output directory" 是否为 `.next`
2. 查看部署详情，确认文件是否正确部署
3. 尝试清除构建缓存并重新部署

### 如果 API 调用失败

1. 检查环境变量是否正确配置
2. 查看浏览器控制台的错误信息
3. 查看 Cloudflare Pages 的 Functions 日志

## 📝 后续优化建议

1. 考虑添加更友好的错误 UI 组件（替代 alert）
2. 添加加载进度条
3. 添加重试机制
4. 考虑添加图片压缩功能


