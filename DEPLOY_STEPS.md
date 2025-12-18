# 🚀 Cloudflare Pages 部署步骤（详细版）

## 第一步：推送到 GitHub

### 1. 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. **Repository name**: `ai-tryon`（或你喜欢的名字）
3. **Description**: `AI 服装试衣间应用`
4. **Visibility**: 选择 Public 或 Private
5. **不要**勾选 "Add a README file"（因为我们已经有了）
6. 点击 **"Create repository"**

### 2. 推送代码到 GitHub

在终端执行以下命令（将 `你的用户名` 替换为你的 GitHub 用户名）：

```bash
git remote add origin https://github.com/你的用户名/ai-tryon.git
git branch -M main
git push -u origin main
```

如果提示输入用户名和密码：
- **用户名**: 你的 GitHub 用户名
- **密码**: 使用 **Personal Access Token**（不是 GitHub 密码）
  - 如果没有 Token，访问 https://github.com/settings/tokens
  - 点击 "Generate new token (classic)"
  - 勾选 `repo` 权限
  - 生成后复制 Token 作为密码使用

## 第二步：部署到 Cloudflare Pages

### 1. 在 Cloudflare Pages 创建项目

1. 访问 https://pages.cloudflare.com/
2. 点击右上角的 **"Create application"** 按钮（蓝色按钮）
3. 选择 **"Pages"** → **"Connect to Git"**
4. 授权 GitHub 访问（如果还没有授权）
5. 选择你刚才创建的仓库（`ai-tryon`）

### 2. 配置构建设置

在配置页面填写：

- **Project name**: `ai-tryon`（或你喜欢的名字）
- **Production branch**: `main`
- **Framework preset**: `Next.js`（会自动检测）
- **Build command**: `npm run build`（通常会自动填充）
- **Build output directory**: `.next`（通常会自动填充）
- **Root directory**: `/`（留空）

### 3. 配置环境变量（重要！）

在 **"Environment variables"** 部分，点击 **"Add variable"** 添加：

**变量 1:**
- **Name**: `DASHSCOPE_API_KEY`
- **Value**: `你的阿里云百炼_API_KEY`（从 .env.local 中复制）

**变量 2:**
- **Name**: `NEXT_PUBLIC_IMGBB_API_KEY`
- **Value**: `你的_imgbb_API_KEY`（从 .env.local 中复制）

### 4. 开始部署

点击页面底部的 **"Save and Deploy"** 按钮。

### 5. 等待部署完成

- 部署通常需要 2-5 分钟
- 可以在部署页面查看构建日志
- 部署完成后会显示绿色的 "Success" 状态

### 6. 获取部署 URL

部署完成后，你会看到一个类似 `https://ai-tryon-xxx.pages.dev` 的 URL。

点击这个 URL 就可以访问你的应用了！

## 第三步：测试应用

1. 访问部署后的 URL
2. 上传模特图和服装图
3. 点击"一键生成 AI 试衣效果"
4. 等待生成完成

如果一切正常，应该可以成功生成试衣效果！

## 常见问题

### Q: 部署失败怎么办？
A: 查看构建日志，常见原因：
- 环境变量未配置
- 构建命令错误
- 代码有语法错误

### Q: 如何更新代码？
A: 推送新代码到 GitHub，Cloudflare Pages 会自动重新部署。

### Q: 如何查看部署日志？
A: 在 Cloudflare Pages 项目页面，点击 "Deployments" 可以查看所有部署历史和日志。

## 完成！

部署完成后，你的应用就可以通过公网访问了，阿里云也可以正常访问图片 URL，不会再出现 "url error" 的问题。

