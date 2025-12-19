# 快速修复 404 错误

## 立即操作（3 步）

### 步骤 1：修改 Cloudflare Pages 设置

1. 进入 Cloudflare Pages 项目设置
2. 找到 **"Build output directory"** 字段
3. **完全删除这个字段的内容（留空）**
4. 点击 **Save**

### 步骤 2：重新部署

1. 点击 **Deployments** 标签
2. 点击最新的部署
3. 点击 **Retry deployment**
4. 等待部署完成（2-5 分钟）

### 步骤 3：测试

1. 访问 `https://shiyi-dz1.pages.dev/`
2. 如果还是 404，告诉我构建日志的最后几行

## 为什么这样做？

Cloudflare Pages 对 Next.js 16 的支持可能需要自动检测输出目录，而不是手动指定 `.next`。

## 如果还是不行

请告诉我：
- 构建日志的最后几行
- 部署详情中显示了哪些文件

