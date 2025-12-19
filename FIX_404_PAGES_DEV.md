# 修复 Cloudflare Pages 404 错误（.pages.dev 域名）

## 问题
部署成功，但访问 `https://shiyi-dz1.pages.dev/` 时出现 404 错误。

## 原因分析
Cloudflare Pages 对 Next.js 16 的原生支持可能有限，需要正确配置构建输出目录。

## 解决方案

### 方案 1：检查并修改构建输出目录（最重要）

1. **进入 Cloudflare Pages 项目设置**
   - 登录 Cloudflare Dashboard
   - 进入你的 Pages 项目（shiyi）
   - 点击 **Settings** 标签

2. **检查 "Builds & deployments" 设置**
   - 找到 **Build output directory** 字段
   - **当前可能是 `.next`，需要改为以下之一：**

   **选项 A（推荐）**：留空或删除
   - 完全删除 "Build output directory" 字段中的内容
   - 让 Cloudflare Pages 自动检测

   **选项 B**：使用 `.vercel/output/static`
   - 但这需要先修改 `next.config.ts` 添加 `output: 'standalone'`
   - **注意**：这会禁用 API Routes

   **选项 C**：检查实际构建输出
   - 在构建日志中查看实际生成了什么目录
   - 根据实际输出设置目录

3. **保存设置并重新部署**
   - 点击 **Save** 保存设置
   - 点击 **Retry deployment** 重新部署

### 方案 2：检查 Framework preset

1. 在 **Settings** → **Builds & deployments** 中
2. 检查 **Framework preset** 是否为 `Next.js`
3. 如果不是，选择 `Next.js`
4. 保存并重新部署

### 方案 3：查看部署详情

1. 在 Cloudflare Pages 项目页面
2. 点击 **Deployments** 标签
3. 点击最新的成功部署
4. 查看 **"View details"** 或 **"Deployment files"**
5. **告诉我实际部署了哪些文件和目录**

### 方案 4：尝试修改构建命令

如果以上都不行，可以尝试：

1. 在 **Build command** 中改为：
   ```
   npm run build && cp -r .next/standalone . && cp -r .next/static .next/standalone/.next
   ```
   （但这可能不适用于 Windows 构建环境）

2. 或者使用：
   ```
   npm run build && npx @cloudflare/next-on-pages@1
   ```
   （但这需要降级 Next.js 到 15.x）

## 立即操作步骤

**第一步（最重要）**：
1. 进入 Cloudflare Pages 项目设置
2. 找到 **Build output directory**
3. **完全删除这个字段的内容（留空）**
4. 保存设置
5. 点击 **Retry deployment** 重新部署
6. 等待部署完成
7. 重新访问 `https://shiyi-dz1.pages.dev/`

**如果还是 404，第二步**：
1. 在部署详情中查看实际部署了哪些文件
2. 告诉我你看到了什么文件和目录
3. 我会根据实际情况调整配置

## 验证修复

修复后，你应该能够：
- ✅ 正常访问 `https://shiyi-dz1.pages.dev/`
- ✅ 看到上传图片的界面
- ✅ API 调用正常工作

## 如果仍然无法解决

请提供以下信息：
1. **Build output directory** 当前设置是什么？
2. **Framework preset** 是什么？
3. **部署详情**中显示了哪些文件和目录？
4. **构建日志**的最后几行是什么？

