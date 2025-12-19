# Cloudflare Pages 环境变量配置指南

## 必需的环境变量

在 Cloudflare Pages 控制台中，进入项目设置：
**Settings** → **Environment variables** → **Add variable**

### 1. 阿里云百炼 API Key

**变量名**: `DASHSCOPE_API_KEY`

**变量值**: `sk-8e292aa35bc94dfab4c0da3a43ac0229`

**说明**: 用于调用阿里云百炼 AI 试衣 API

**环境**: 同时添加到 **Production** 和 **Preview** 环境

---

### 2. imgbb API Key（前端使用）

**变量名**: `NEXT_PUBLIC_IMGBB_API_KEY`

**变量值**: `8069a090347d7175fa8bb32fa2324541`

**说明**: 用于前端直接上传图片到 imgbb 图床服务

**环境**: 同时添加到 **Production** 和 **Preview** 环境

**注意**: 变量名必须以 `NEXT_PUBLIC_` 开头，这样前端代码才能访问

---

## 可选的环境变量

### 3. 备用阿里云 API Key（如果 DASHSCOPE_API_KEY 不可用）

**变量名**: `ALIBABA_CLOUD_API_KEY`

**变量值**: （与 DASHSCOPE_API_KEY 相同）

**说明**: 代码会优先使用 `DASHSCOPE_API_KEY`，如果不存在则使用此变量

**环境**: 可选，建议同时添加到 **Production** 和 **Preview** 环境

---

## 配置步骤

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages** → 选择你的项目 **shiyi**
3. 点击 **Settings** 标签
4. 在左侧菜单找到 **Environment variables**
5. 点击 **Add variable** 添加上述变量
6. 确保为每个变量选择正确的环境（Production / Preview）
7. 保存设置

## 验证配置

部署后，检查构建日志中是否有以下信息：
- ✅ 没有 "未配置 API Key" 的错误
- ✅ API 调用成功（查看应用功能是否正常）

## 安全提示

- ⚠️ 不要将 API Key 提交到 Git 仓库
- ⚠️ 定期轮换 API Key
- ⚠️ 在 Cloudflare Pages 中使用环境变量，而不是硬编码在代码中


