# 🚀 Cloudflare Pages 部署指南（方案 C）

## 为什么选择 Cloudflare Pages？

- ✅ **完全免费**：免费额度充足
- ✅ **自动 HTTPS**：所有请求都是 HTTPS
- ✅ **全球 CDN**：图片加载更快
- ✅ **公网可访问**：部署后图片 URL 可以被阿里云访问，解决 "url error" 问题

## 📋 5 分钟快速部署

### 步骤 1: 准备代码（如果还没有 Git 仓库）

```bash
# 初始化 Git
git init
git add .
git commit -m "准备部署到 Cloudflare Pages"

# 在 GitHub 创建新仓库，然后：
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2: 部署到 Cloudflare Pages

1. **访问**: https://pages.cloudflare.com/
2. **登录/注册** Cloudflare 账号（免费）
3. **点击** "Create a project" → "Connect to Git"
4. **授权** GitHub 访问
5. **选择** 你的仓库
6. **配置构建设置**:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`（留空）
7. **添加环境变量**（重要！）:
   - `DASHSCOPE_API_KEY` = `你的阿里云百炼_API_KEY`
   - `NEXT_PUBLIC_IMGBB_API_KEY` = `你的_imgbb_API_KEY`
8. **点击** "Save and Deploy"

### 步骤 3: 等待部署完成

通常需要 2-5 分钟。部署完成后会得到一个类似 `https://shengtu-xxx.pages.dev` 的 URL。

### 步骤 4: 测试

访问部署后的 URL，测试应用功能。部署后，所有图片 URL 都是公网可访问的 HTTPS 链接，阿里云可以正常访问。

## 🎯 部署后的优势

部署后，所有图片 URL 都是公网可访问的 HTTPS 链接，阿里云可以正常访问，不会再出现 "url error" 的问题。

## 🔄 后续更新

每次推送代码到 GitHub，Cloudflare Pages 会自动重新部署。

## 📝 注意事项

- 确保环境变量正确配置
- 首次部署可能需要几分钟
- 代码更新后会自动重新部署
- `.env.local` 文件不会被提交到 Git（已在 .gitignore 中）
