# Cloudflare Pages 部署指南（方案 C）

## 快速部署步骤

### 1. 准备 GitHub 仓库

如果还没有 Git 仓库，执行：

```bash
git init
git add .
git commit -m "Initial commit"
```

然后在 GitHub 创建新仓库并推送：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 2. 部署到 Cloudflare Pages

1. **访问 Cloudflare Pages**
   - 打开 https://pages.cloudflare.com/
   - 登录/注册账号

2. **创建项目**
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权 GitHub 访问
   - 选择你的仓库

3. **配置构建设置**
   - **Project name**: `shengtu`（或你喜欢的名字）
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`（留空）

4. **配置环境变量**
   在 "Environment variables" 部分添加：
   - `DASHSCOPE_API_KEY` = `你的阿里云百炼_API_KEY`
   - `NEXT_PUBLIC_IMGBB_API_KEY` = `你的_imgbb_API_KEY`

5. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（通常 2-5 分钟）

### 3. 获取部署 URL

部署完成后，你会得到一个类似 `https://shengtu-xxx.pages.dev` 的 URL。

## 部署后的优势

✅ **公网可访问**：图片 URL 可以被阿里云访问  
✅ **自动 HTTPS**：所有请求都是 HTTPS  
✅ **全球 CDN**：图片加载更快  
✅ **免费额度**：Cloudflare Pages 免费额度很充足  

## 测试部署

部署完成后：
1. 访问你的 Cloudflare Pages URL
2. 上传图片测试功能
3. 查看是否成功生成试衣效果

## 注意事项

- 确保环境变量正确配置
- 首次部署可能需要几分钟
- 代码更新后会自动重新部署

## 如果需要使用 Cloudflare R2 存储

如果 imgbb 仍然有问题，可以使用 Cloudflare R2：

1. 在 Cloudflare Dashboard 创建 R2 bucket
2. 获取 R2 访问凭证
3. 安装依赖：`npm install @aws-sdk/client-s3`
4. 修改代码使用 R2 上传图片

但目前使用 imgbb 应该就足够了。
