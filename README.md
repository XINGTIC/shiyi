# AI 服装试衣间

基于阿里云百炼 AI 的服装试衣 SaaS 应用。

## 功能特性

- 🎨 上传真人模特图和服装平铺图
- 🤖 AI 自动生成试衣效果
- 📱 响应式设计，支持移动端
- 🚀 部署到 Cloudflare Pages，全球 CDN 加速

## 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```
   DASHSCOPE_API_KEY=你的阿里云百炼_API_KEY
   NEXT_PUBLIC_IMGBB_API_KEY=你的_imgbb_API_KEY
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   
   打开 http://localhost:3000

## 部署到 Cloudflare Pages

详细部署指南请查看 [README_DEPLOY.md](./README_DEPLOY.md)

快速部署步骤：

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 配置环境变量
4. 部署完成

## 技术栈

- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **阿里云百炼 AI** - AI 试衣模型
- **imgbb** - 图片托管服务

## 项目结构

```
.
├── app/
│   ├── api/
│   │   └── aliyun/
│   │       └── tryon/          # 试衣 API 路由
│   ├── page.tsx                # 主页面
│   └── layout.tsx              # 布局组件
├── .env.local                  # 环境变量（不提交到 Git）
└── README_DEPLOY.md           # 部署指南
```

## 注意事项

- 确保环境变量正确配置
- 部署到 Cloudflare Pages 后，图片 URL 是公网可访问的 HTTPS 链接
- 首次部署可能需要几分钟
