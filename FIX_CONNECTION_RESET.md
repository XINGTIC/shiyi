# 修复 ERR_CONNECTION_RESET 错误

## 问题描述
部署成功，但访问网站时出现 "ERR_CONNECTION_RESET" 错误。

## 可能的原因

1. **SSL/TLS 模式设置不正确**（最常见）
2. **Cloudflare Pages 对 Next.js API Routes 的支持问题**
3. **DNS 或代理设置问题**

## 解决方案

### 方案 1：检查并修复 SSL/TLS 设置（最重要！）

1. 登录 Cloudflare Dashboard
2. 在左侧菜单选择 **SSL/TLS** → **Overview**
3. 检查当前的 SSL/TLS 模式
4. **将模式改为 "Full (Strict)"**
   - 如果当前是 "Flexible"，改为 "Full (Strict)"
   - 如果当前是 "Full"，也改为 "Full (Strict)"
   - 如果已经是 "Full (Strict)"，尝试改为 "Full"，等待几分钟后再改回 "Full (Strict)"

**为什么重要**：
- "Flexible" 模式：Cloudflare 到源站使用 HTTP，可能导致连接重置
- "Full" 模式：Cloudflare 到源站使用 HTTPS，但不会验证证书
- "Full (Strict)" 模式：Cloudflare 到源站使用 HTTPS 并验证证书（推荐）

### 方案 2：清除 Cloudflare 缓存

1. 在 Cloudflare Dashboard 中，进入你的域名
2. 点击 **Caching** → **Configuration**
3. 点击 **Purge Everything**（清除所有缓存）
4. 等待 1-2 分钟，然后重新访问网站

### 方案 3：检查自定义域名设置（如果使用）

如果你使用了自定义域名（不是 `.pages.dev`）：

1. 在 Cloudflare Dashboard 中，进入 **DNS** 页面
2. 确保有一条 **CNAME** 记录指向你的 Pages 项目
3. 确保"小云朵"（Proxy）是**开启状态**（橘黄色）
4. 如果"小云朵"是灰色的，点击它开启代理

### 方案 4：检查 Pages 项目设置

1. 进入 Cloudflare Pages 项目设置
2. 检查 **Custom domains** 设置
3. 如果添加了自定义域名，确保 SSL/TLS 证书已正确配置

### 方案 5：尝试直接访问 `.pages.dev` 域名

1. 在 Cloudflare Pages 项目页面，找到你的 `.pages.dev` 域名
2. 直接访问这个域名（例如：`https://shiyi-xxx.pages.dev`）
3. 如果 `.pages.dev` 可以访问，问题可能出在自定义域名配置上

## 立即操作步骤

**第一步（最重要）**：
1. 进入 Cloudflare Dashboard
2. 选择 **SSL/TLS** → **Overview**
3. 将模式改为 **Full (Strict)**
4. 等待 2-3 分钟
5. 清除浏览器缓存
6. 重新访问网站

**如果还是不行，第二步**：
1. 清除 Cloudflare 缓存（Caching → Purge Everything）
2. 等待 1-2 分钟
3. 重新访问网站

**如果还是不行，第三步**：
1. 直接访问 `.pages.dev` 域名
2. 如果 `.pages.dev` 可以访问，问题在自定义域名配置
3. 检查 DNS 和 SSL/TLS 设置

## 验证修复

修复后，你应该能够：
- ✅ 正常访问网站首页
- ✅ 看到上传图片的界面
- ✅ API 调用正常工作（虽然可能还需要测试）

## 如果仍然无法解决

请提供以下信息：
1. 你使用的是自定义域名还是 `.pages.dev` 域名？
2. 当前的 SSL/TLS 模式是什么？
3. DNS 设置中"小云朵"是开启还是关闭的？
4. 直接访问 `.pages.dev` 域名是否可以打开？

