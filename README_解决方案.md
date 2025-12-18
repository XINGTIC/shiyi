# 解决 localhost URL 无法访问的问题

## 问题说明

当应用运行在 `localhost:3000` 时，生成的图片 URL 是 `http://localhost:3000/api/aliyun/image/xxx`，但阿里云百炼的服务器无法访问您的本地 localhost，因此会报错 "url error"。

## 解决方案

### 方案 1：使用内网穿透工具（推荐用于开发测试）

#### 步骤 1：安装 ngrok

访问 https://ngrok.com/ 注册账号并下载 ngrok，或者使用包管理器安装：

```bash
# Windows (使用 Chocolatey)
choco install ngrok

# 或直接下载：https://ngrok.com/download
```

#### 步骤 2：启动 ngrok

在项目目录打开新的终端窗口，运行：

```bash
ngrok http 3000
```

您会看到类似这样的输出：
```
Forwarding  https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://localhost:3000
```

复制这个 `https://xxxx-xxx-xxx-xxx.ngrok-free.app` URL。

#### 步骤 3：配置环境变量

在 `.env.local` 文件中添加：

```
NEXT_PUBLIC_BASE_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

**重要**：将 `xxxx-xxx-xxx-xxx.ngrok-free.app` 替换为您实际的 ngrok URL。

#### 步骤 4：重启开发服务器

```bash
npm run dev
```

现在图片 URL 将使用 ngrok 的公网地址，阿里云可以正常访问。

---

### 方案 2：部署到公网服务器（推荐用于生产环境）

#### 使用 Vercel 部署（最简单）

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 导入您的 GitHub 仓库
4. 在环境变量中添加 `DASHSCOPE_API_KEY`
5. 部署完成后，应用会自动获得公网 URL

#### 使用阿里云服务器部署

1. 购买阿里云 ECS 服务器
2. 部署 Next.js 应用
3. 配置域名和 HTTPS
4. 设置环境变量

---

### 方案 3：检查阿里云上传 API（如果可用）

如果阿里云的上传 API 正常工作，图片会直接上传到阿里云存储，返回公网可访问的 URL，就不需要内网穿透了。

请检查：
1. 浏览器控制台的网络请求，查看 `/api/aliyun/upload-image` 的响应
2. 服务器日志，查看是否有上传成功的日志

如果上传 API 失败，可能需要：
- 检查 API Key 权限
- 查看阿里云百炼文档确认上传 API 的正确用法

---

## 快速测试

使用方案 1（ngrok）后，重新上传图片并生成试衣效果，应该就不会再出现 "url error" 了。

