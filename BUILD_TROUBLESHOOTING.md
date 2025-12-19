# Cloudflare Pages 构建问题排查

## 常见构建失败原因

### 1. 构建输出目录错误

**问题**: Cloudflare Pages 可能无法找到正确的构建输出

**解决方案**: 在 Cloudflare Pages 设置中：
- **Build output directory**: 应该设置为 `.next` 或 `out`（取决于配置）

### 2. Next.js API Routes 支持

**问题**: Cloudflare Pages 对 Next.js API Routes 的支持可能有限

**解决方案**: 
- 确保使用 Next.js 16+ 版本
- 检查 `next.config.ts` 中是否有 `output: 'export'`（如果有，需要移除，因为这会禁用 API Routes）

### 3. 环境变量未配置

**问题**: 构建时缺少必要的环境变量

**解决方案**: 在 Cloudflare Pages 项目设置中添加：
- `DASHSCOPE_API_KEY`
- `NEXT_PUBLIC_IMGBB_API_KEY`

### 4. Node.js 版本问题

**问题**: 构建环境使用的 Node.js 版本不兼容

**解决方案**: 在 `package.json` 中添加 `engines` 字段指定 Node.js 版本

## 如何查看构建日志

1. 进入 Cloudflare Pages 项目
2. 点击 "Deployments" 标签
3. 点击失败的部署
4. 查看 "Build log" 部分
5. 找到错误信息（通常以 "Error:" 或 "Failed:" 开头）

## 如果仍然失败

请提供构建日志中的具体错误信息，我会根据错误信息提供针对性的解决方案。


