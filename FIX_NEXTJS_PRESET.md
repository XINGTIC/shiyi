# 修复 Cloudflare Pages "Next.js" Preset 404 错误

## 问题
使用 Cloudflare Pages 的 **"Next.js"** Framework preset 部署后出现 404 错误。

## 解决方案（按顺序尝试）

### 方案 1：添加 nodejs_compat 兼容性标志（最重要！）

Cloudflare Pages 的 "Next.js" preset 可能需要启用 Node.js 兼容性标志才能支持 Next.js 16。

**操作步骤**：
1. 进入 Cloudflare Pages 项目设置
2. 点击 **Settings** 标签
3. 找到 **Functions** 部分（在页面下方）
4. 找到 **Compatibility flags** 或 **Compatibility date** 设置
5. **添加兼容性标志**：`nodejs_compat`
   - 如果看到 "Compatibility flags" 字段，添加 `nodejs_compat`
   - 如果看到 "Compatibility date"，确保日期是 2024-01-01 或更新
6. 保存设置
7. 重新部署

### 方案 2：检查并修改构建输出目录

1. 在 **Settings** → **Builds & deployments** 中
2. 找到 **Build output directory** 字段
3. **完全删除这个字段的内容（留空）**
4. 保存设置
5. 重新部署

### 方案 3：检查 Framework preset 设置

1. 在 **Settings** → **Builds & deployments** 中
2. 确认 **Framework preset** 是 **"Next.js"**（这是正确的）
3. **Build command** 应该是：`npm run build`（或留空）
4. **Build output directory** 应该留空
5. **Root directory** 应该留空

## 立即操作步骤

**第一步（最重要）**：
1. 进入 Cloudflare Pages 项目设置
2. 找到 **Functions** 部分
3. 添加兼容性标志：`nodejs_compat`
4. 保存设置

**第二步**：
1. 找到 **Build output directory**
2. 删除内容（留空）
3. 保存设置

**第三步**：
1. 点击 **Deployments** 标签
2. 点击最新的部署
3. 点击 **Retry deployment**
4. 等待部署完成（2-5 分钟）

**第四步**：
1. 访问 `https://shiyi-dz1.pages.dev/`
2. 应该能看到页面了

## 为什么需要 nodejs_compat？

Cloudflare Pages 的 "Next.js" preset 默认可能不支持 Next.js 16 的所有特性。添加 `nodejs_compat` 标志可以启用 Node.js 兼容性，让 Next.js 16 正常运行。

## 如果还是 404

请告诉我：
1. 是否已添加 `nodejs_compat` 标志？
2. 构建输出目录是否已留空？
3. 构建日志的最后几行是什么？

