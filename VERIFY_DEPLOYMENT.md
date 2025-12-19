# 验证 Cloudflare Pages 部署配置

## 当前配置检查清单

请在 Cloudflare Pages 项目设置中确认以下配置：

### 1. Framework preset
- ✅ 应该选择 **"Next.js"**（这是正确的）
- ❌ 不要选择 "Next.js 16"（这个选项可能不存在）

### 2. Build command
- ✅ 应该是：`npm run build`
- 或者留空（让 Cloudflare 自动检测）

### 3. Build output directory（关键！）
- ✅ **应该留空**（删除 `.next`）
- 让 Cloudflare Pages 自动检测输出目录

### 4. Root directory
- ✅ 应该留空（`/`）

### 5. Node.js version
- ✅ 确保是 Node.js 18 或 20
- 可以在环境变量中设置：`NODE_VERSION=20`

## 如果还是 404

### 检查构建日志

1. 进入 Cloudflare Pages 项目
2. 点击 **Deployments** 标签
3. 点击最新的部署
4. 查看 **Build log**
5. 找到以下关键信息：
   - 构建是否成功完成
   - 输出到了哪个目录
   - 是否有关于路由的警告

### 检查部署文件

1. 在部署详情页面
2. 查看 **"View details"** 或 **"Deployment files"**
3. 告诉我你看到了哪些文件和目录

## 常见问题

### Q: 为什么选择 "Next.js" preset 还是 404？
A: 可能是构建输出目录配置错误。尝试留空让 Cloudflare 自动检测。

### Q: 需要修改 Framework preset 吗？
A: 不需要。保持 "Next.js" 即可，但确保构建输出目录留空。

### Q: 构建成功但访问 404？
A: 检查部署详情，看看实际部署了哪些文件。可能是路由配置问题。

## 下一步

1. **确认构建输出目录已留空**
2. **重新部署**
3. **如果还是 404，告诉我构建日志的最后几行**

