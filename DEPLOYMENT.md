# Vercel 部署指南

本文档详细说明如何将 PDF Summarizer 项目部署到 Vercel，包括所有必需的环境变量配置。

## 📋 目录

- [前置要求](#前置要求)
- [部署步骤](#部署步骤)
- [环境变量配置](#环境变量配置)
- [数据库配置](#数据库配置)
- [Supabase 配置](#supabase-配置)
- [OAuth 配置](#oauth-配置)
- [AI API 配置](#ai-api-配置)
- [其他配置](#其他配置)
- [部署后检查](#部署后检查)
- [常见问题](#常见问题)

---

## 前置要求

1. **Vercel 账号**：注册 [Vercel](https://vercel.com)
2. **GitHub/GitLab/Bitbucket 仓库**：将代码推送到 Git 仓库
3. **Supabase 项目**：用于用户认证
4. **PostgreSQL 数据库**：生产环境数据库（推荐使用 Vercel Postgres 或 Supabase）
5. **OpenRouter API Key**：用于 AI 摘要生成

---

## 部署步骤

### 1. 连接 Git 仓库到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 导入你的 Git 仓库
4. 选择项目根目录

### 2. 配置项目设置

在 Vercel 项目设置中：

- **Framework Preset**: Next.js
- **Root Directory**: `./` (项目根目录)
- **Build Command**: `pnpm build` (会自动运行 `pnpm db:generate` 生成 Prisma Client)
- **Output Directory**: `.next` (默认)
- **Install Command**: `pnpm install` (或 `npm install`)

### 3. 配置环境变量

在 Vercel 项目设置中，进入 **Settings → Environment Variables**，添加所有必需的环境变量（见下方详细说明）。

### 4. 部署

点击 **"Deploy"** 按钮，Vercel 会自动：
- 安装依赖
- 运行构建命令
- 部署到生产环境

---

## 环境变量配置

### ✅ 已配置的变量（直接复制）

以下变量在本地 `.env.local` 文件中已配置完成，部署到 Vercel 时直接从 `.env.local` 文件复制对应的值即可：

- `DATABASE_URL` - Prisma Data Platform 数据库连接（已配置）
- `POSTGRES_URL` - PostgreSQL 连接字符串（已配置）
- `PRISMA_DATABASE_URL` - Prisma Accelerate 连接字符串（已配置）
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL（已配置）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名密钥（已配置）
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥（已配置）
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID（已配置）
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret（已配置）
- `GITHUB_CLIENT_ID` - GitHub OAuth Client ID（已配置）
- `GITHUB_CLIENT_SECRET` - GitHub OAuth Client Secret（已配置）
- `OPENROUTER_API_KEY` - OpenRouter API 密钥（已配置）
- `AUTH_SECRET` - 认证密钥（已配置）
- `NEXTAUTH_URL` - NextAuth URL（已配置）

**操作步骤**：在 Vercel Dashboard → Settings → Environment Variables 中，将上述变量名和对应的值从 `.env.local` 文件复制粘贴即可。**无需在此文档中重复说明，直接复制 `.env.local` 中的值。**

### ⚠️ 需要配置的变量

以下变量在 `.env.local` 中未配置，需要在 Vercel 中手动添加：

#### 必需变量

**`NEXT_PUBLIC_SITE_URL`** - 生产环境域名

```bash
NEXT_PUBLIC_SITE_URL="https://pdftools.club"
```

**说明**：
- 生产环境域名：`https://pdftools.club`
- 用于生成绝对 URL（OAuth 回调、API 调用等）
- **必须配置**：此变量在 `.env.local` 中未配置，需要在 Vercel 中添加此值

#### 可选变量

**`CLEANUP_SECRET`** - 清理任务密钥（可选）

```bash
CLEANUP_SECRET="your-secret-key"
```

**说明**：
- 用于保护 `/api/admin/cleanup` 端点
- 生成方式：`openssl rand -base64 32`

**`SITE_URL`** - 服务器端站点 URL（可选）

```bash
SITE_URL="https://pdftools.club"
```

**说明**：
- 如果未设置，会使用 `NEXT_PUBLIC_SITE_URL`
- 用于服务器端代码
- **可选配置**：如果设置了 `NEXT_PUBLIC_SITE_URL`，此变量可以不设置

**Creem 支付配置**（如果使用 Creem 作为支付提供商）

```bash
CREEM_API_BASE="https://api.creem.com/v1"
CREEM_API_KEY="your-creem-api-key"
CREEM_WEBHOOK_SECRET="your-webhook-secret"
```

### 配置步骤

1. 在 Vercel Dashboard → Settings → Environment Variables
2. 添加所有已配置的变量（从本地 `.env.local` 文件复制）
3. 添加必需变量 `NEXT_PUBLIC_SITE_URL="https://pdftools.club"`
4. 根据需要添加可选变量

---

## 数据库配置

### 生产环境数据库迁移

部署到 Vercel 后，需要运行数据库迁移：

#### 方法 1：使用 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 运行迁移
vercel env pull .env.local
pnpm db:migrate:deploy
```

#### 方法 2：使用 Vercel Postgres

如果使用 Vercel Postgres：

1. 在 Vercel Dashboard → Storage → Postgres
2. 创建数据库后，Vercel 会自动设置 `DATABASE_URL`
3. 在 Vercel 项目设置中添加构建命令：

```bash
# Build Command
pnpm build && pnpm prisma migrate deploy
```

#### 方法 3：使用 Supabase Postgres

如果使用 Supabase Postgres：

1. 在 Supabase Dashboard → SQL Editor
2. 运行 Prisma 生成的 SQL 迁移文件
3. 或使用 Supabase CLI：

```bash
# 安装 Supabase CLI
npm i -g supabase

# 链接项目
supabase link --project-ref your-project-ref

# 运行迁移
supabase db push
```

---

## Supabase 配置

### 1. 配置 OAuth 重定向 URL

在 Supabase Dashboard → Authentication → URL Configuration：

**Site URL**:
```
https://pdftools.club
```

**Redirect URLs**:
```
https://pdftools.club/auth/callback
http://localhost:3000/auth/callback
```

### 2. 配置 Email 模板（可选）

如果需要自定义邮件模板：
- Supabase Dashboard → Authentication → Email Templates

### 3. 配置 Row Level Security (RLS)

确保 Supabase 表有适当的 RLS 策略（如果需要）。

---

## OAuth 配置

### Google OAuth 回调 URL

在 Google Cloud Console 中，确保添加了以下回调 URL：

```
https://pdftools.club/auth/callback
http://localhost:3000/auth/callback
```

### GitHub OAuth 回调 URL

在 GitHub OAuth App 设置中，确保回调 URL 为：

```
https://pdftools.club/auth/callback
```

---

## AI API 配置

### OpenRouter 配置

1. 在 OpenRouter Dashboard → Keys 创建 API Key
2. 设置使用限制（可选）
3. 将 API Key 添加到 Vercel 环境变量

### 模型选择

默认使用 `openai/gpt-4o-mini`，可以在 `lib/ai-client.ts` 中修改。

支持的模型格式：
- `openai/gpt-4o-mini`
- `openai/gpt-4`
- `anthropic/claude-3-haiku`
- 等等（见 [OpenRouter Models](https://openrouter.ai/models)）

---

## 其他配置

### Vercel Cron Jobs（已禁用）

~~定时任务功能已暂时禁用。~~

**注意**：如果需要启用自动清理功能，可以：
1. 在 `vercel.json` 中添加 cron 配置
2. 或使用外部服务（如 cron-job.org）定期调用 `/api/admin/cleanup` 端点

**手动清理**：
可以通过 POST 请求手动执行清理：
```bash
curl -X POST https://pdftools.club/api/admin/cleanup
```

**查看清理统计**：
可以通过 GET 请求查看清理统计（不执行清理）：
```bash
curl https://pdftools.club/api/admin/cleanup
```

确保在 Vercel Dashboard → Settings → Cron Jobs 中启用。

### 文件存储

当前使用本地文件系统存储上传的文件。生产环境建议：

1. **使用 Supabase Storage**：
   - 在 Supabase Dashboard → Storage 创建 bucket
   - 修改 `lib/storage.ts` 使用 Supabase Storage

2. **使用 Vercel Blob Storage**：
   - 在 Vercel Dashboard → Storage → Blob
   - 使用 `@vercel/blob` SDK

3. **使用 AWS S3 / Cloudflare R2**：
   - 配置相应的 SDK

---

## 部署后检查

### 1. 检查部署状态

在 Vercel Dashboard 中：
- ✅ 构建成功
- ✅ 部署成功
- ✅ 无错误日志

### 2. 检查环境变量

在 Vercel Dashboard → Settings → Environment Variables：
- ✅ 所有必需变量已配置
- ✅ 变量值正确（无多余空格）
- ✅ 生产环境变量已设置

### 3. 检查数据库连接

访问部署的网站：
- ✅ 首页加载正常
- ✅ 可以注册/登录
- ✅ 数据库操作正常

### 4. 检查 OAuth 登录

- ✅ Google 登录正常
- ✅ GitHub 登录正常
- ✅ 回调 URL 正确

### 5. 检查 AI 功能

- ✅ 上传 PDF 文件
- ✅ 生成摘要成功
- ✅ 无 API 错误

---

## 常见问题

### Q1: 构建失败，提示 Prisma 错误

**解决方案**：
1. 确保 `DATABASE_URL` 已正确配置
2. 确保使用 PostgreSQL（不是 SQLite）
3. 在构建命令中添加迁移：

```bash
pnpm build && pnpm prisma migrate deploy
```

### Q2: OAuth 登录失败

**解决方案**：
1. 检查 Supabase 中的 OAuth 提供商配置
2. 检查 Google/GitHub 中的回调 URL
3. 确保环境变量 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正确

### Q3: AI 摘要生成失败

**解决方案**：
1. 检查 `OPENROUTER_API_KEY` 是否正确
2. 检查 OpenRouter 账户余额
3. 查看 Vercel 函数日志

### Q4: 数据库迁移失败

**解决方案**：
1. 确保 `DATABASE_URL` 指向正确的 PostgreSQL 数据库
2. 确保数据库用户有创建表的权限
3. 手动运行迁移：

```bash
vercel env pull .env.local
pnpm db:migrate:deploy
```

### Q5: 文件上传失败

**解决方案**：
1. 检查 Vercel 函数大小限制（50MB）
2. 考虑使用外部存储（Supabase Storage, Vercel Blob）
3. 检查文件大小限制

### Q6: 环境变量不生效

**解决方案**：
1. 确保环境变量名称正确（区分大小写）
2. 确保为正确的环境设置（Production, Preview, Development）
3. 重新部署项目

---

## 环境变量清单

参考 `env.example` 文件获取完整的环境变量列表和配置说明。

---

## 支持

如果遇到问题：

1. 查看 Vercel 部署日志
2. 查看 Supabase 日志
3. 检查环境变量配置
4. 参考项目 README 文件

---

## 更新日志

- **2024-01-XX**: 初始部署文档

---

**祝部署顺利！** 🚀
