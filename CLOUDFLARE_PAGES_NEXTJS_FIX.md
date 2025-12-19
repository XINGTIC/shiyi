# Cloudflare Pages Next.js Preset 配置修复

## 问题
使用 Cloudflare Pages 的 "Next.js" Framework preset 部署后出现 404 错误。

## 原因
Cloudflare Pages 的 "Next.js" preset 可能无法正确识别 Next.js 16 的输出结构。

## 解决方案

### 方案 1：检查并修改 Framework preset 设置（推荐）

1. **进入 Cloudflare Pages 项目设置**
   - 登录 Cloudflare Dashboard
   - 进入你的 Pages 项目（shiyi）
   - 点击 **Settings** 标签

2. **检查 Framework preset**
   - 找到 **"Builds & deployments"** 部分
   - 查看 **"Framework preset"** 字段
   - 如果显示 "Next.js"，尝试以下操作：

   **选项 A**：保持 "Next.js"，但修改构建输出目录
   - **Build output directory**: 留空（删除 `.next`）
   - 让 Cloudflare 自动检测

   **选项 B**：改为 "None" 并手动配置
   - **Framework preset**: 选择 "None"
   - **Build command**: `npm run build`
   - **Build output directory**: 留空或尝试 `.next`

3. **保存并重新部署**

### 方案 2：修改 next.config.ts 以兼容 Cloudflare Pages

如果方案 1 不行，我们需要修改 `next.config.ts` 以确保输出格式兼容。

### 方案 3：检查实际构建输出

1. 在 Cloudflare Pages 的构建日志中
2. 查看实际生成了哪些文件和目录
3. 根据实际输出调整配置

## 立即操作步骤

**第一步**：
1. 进入 Cloudflare Pages 项目设置
2. 找到 **"Build output directory"**
3. **完全删除这个字段的内容（留空）**
4. 保存设置

**第二步**：
1. 点击 **Deployments** 标签
2. 点击最新的部署
3. 点击 **Retry deployment**
4. 等待部署完成

**第三步**：
1. 如果还是 404，查看构建日志
2. 找到关于输出目录的信息
3. 告诉我构建日志中显示的目录结构

## 验证

修复后，访问 `https://shiyi-dz1.pages.dev/` 应该能看到页面。

