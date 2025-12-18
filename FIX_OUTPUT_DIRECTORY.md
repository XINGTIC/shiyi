# 修复构建输出目录问题

## 问题
错误信息：`Error: Output directory " .next" not found.`

注意：错误信息中显示的是 `" .next"`（前面有空格），而不是 `.next`。

## 解决方案

### 方法 1：检查 Cloudflare Pages 设置（推荐）

1. 进入 Cloudflare Pages 项目设置
2. 找到 "Build output directory" 字段
3. **确保输入的是 `.next`（没有前导空格，没有尾随空格）**
4. 如果之前输入有误，请：
   - 完全删除现有内容
   - 重新输入：`.next`
   - 保存设置

### 方法 2：尝试使用 `out` 目录（如果方法 1 不行）

如果 `.next` 仍然不行，可以尝试使用静态导出：

1. 修改 `next.config.ts` 添加 `output: 'export'`
2. 在 Cloudflare Pages 设置中使用 `out` 作为输出目录

**注意**：这会导致 API Routes 无法工作，需要将 API 逻辑移到前端或使用其他服务。

### 方法 3：检查构建是否成功生成目录

构建日志显示 "Finished"，说明构建可能成功了。问题可能是：
- 输出目录路径配置错误
- 或者 Cloudflare Pages 无法识别 Next.js 16 的输出结构

## 立即操作

请检查 Cloudflare Pages 设置中的 "Build output directory" 字段，确保：
- ✅ 输入的是 `.next`（没有空格）
- ✅ 没有前导或尾随空格
- ✅ 没有其他特殊字符

然后点击 "Retry deployment" 重新部署。

