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
- **Build Command**: `pnpm build` (或 `npm run build`)
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

### 🔴 必需环境变量

以下环境变量是应用运行所必需的，必须全部配置：

#### 1. 数据库配置

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

**说明**：
- 生产环境必须使用 PostgreSQL（不能使用 SQLite）
- 推荐使用：
  - **Vercel Postgres**：在 Vercel Dashboard 中创建
  - **Supabase Postgres**：在 Supabase Dashboard 中创建
  - **其他 PostgreSQL 服务**：如 Neon, Railway, Render 等

**获取方式**：
- Vercel Postgres：在 Vercel Dashboard → Storage → Create Database → Postgres
- Supabase：在 Supabase Dashboard → Project Settings → Database → Connection String

---

#### 2. Supabase 配置

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**说明**：
- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 URL（公开）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase 匿名密钥（公开，用于客户端）
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase 服务角色密钥（私有，用于服务器端）

**获取方式**：
1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择或创建项目
3. 进入 **Settings → API**
4. 复制：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

---

#### 3. OAuth 配置

##### Google OAuth

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**配置步骤**：
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**
4. 进入 **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. 应用类型选择 **Web application**
6. 添加授权重定向 URI：
   ```
   https://your-domain.vercel.app/auth/callback
   http://localhost:3000/auth/callback  (开发环境)
   ```
7. 复制 **Client ID** 和 **Client Secret**

**在 Supabase 中配置**：
1. 进入 Supabase Dashboard → Authentication → Providers
2. 启用 **Google** 提供商
3. 填入 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
4. 保存

##### GitHub OAuth

```bash
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**配置步骤**：
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写：
   - **Application name**: PDF Summarizer
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/auth/callback`
4. 复制 **Client ID** 和 **Client Secret**

**在 Supabase 中配置**：
1. 进入 Supabase Dashboard → Authentication → Providers
2. 启用 **GitHub** 提供商
3. 填入 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`
4. 保存

---

#### 4. AI API 配置

```bash
OPENROUTER_API_KEY="sk-or-v1-your-api-key"
```

**说明**：
- 使用 OpenRouter 作为 AI 服务提供商
- 支持多种 AI 模型（GPT-4, Claude, 等）

**获取方式**：
1. 访问 [OpenRouter](https://openrouter.ai)
2. 注册账号并登录
3. 进入 **Keys** 页面
4. 创建新的 API Key
5. 复制 API Key

**可选**：如果使用 OpenAI 直接 API：

```bash
OPENAI_API_KEY="sk-your-openai-key"  # 替代 OPENROUTER_API_KEY
```

---

#### 5. 站点配置

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

**说明**：
- 你的生产环境域名
- 用于生成绝对 URL（OAuth 回调、API 调用等）
- 示例：`https://pdfsummarizer.vercel.app`

**注意**：代码中也会使用 `SITE_URL`（不带 `NEXT_PUBLIC_` 前缀），如果设置了 `NEXT_PUBLIC_SITE_URL`，可以同时设置：

```bash
SITE_URL="https://your-domain.vercel.app"  # 可选，用于服务器端
```

或者只设置 `NEXT_PUBLIC_SITE_URL`，代码会自动回退使用它。

---

### 🟡 可选环境变量

以下环境变量是可选的，根据需求配置：

#### 清理任务配置

```bash
CLEANUP_SECRET="your-secret-key"  # 用于保护清理 API 端点
```

**说明**：
- 用于 `/api/admin/cleanup` 端点的身份验证
- 生成方式：`openssl rand -base64 32`

---

#### Creem 支付配置（如果使用）

```bash
CREEM_API_BASE="https://api.creem.com/v1"
CREEM_API_KEY="your-creem-api-key"
CREEM_WEBHOOK_SECRET="your-webhook-secret"
```

**说明**：
- 如果使用 Creem 作为支付提供商，需要配置这些变量
- 否则可以忽略

---

#### 站点元数据（SEO）

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"  # 已在必需变量中
```

这些信息也可以在代码中直接修改（`app/layout.tsx`）。

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
https://your-domain.vercel.app
```

**Redirect URLs**:
```
https://your-domain.vercel.app/auth/callback
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
https://your-domain.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### GitHub OAuth 回调 URL

在 GitHub OAuth App 设置中，确保回调 URL 为：

```
https://your-domain.vercel.app/auth/callback
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

### Vercel Cron Jobs

项目已配置自动清理任务（每 6 小时运行一次）：

```json
{
  "crons": [
    {
      "path": "/api/admin/cleanup",
      "schedule": "0 */6 * * *"
    }
  ]
}
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

### 快速检查清单

在 Vercel Dashboard → Settings → Environment Variables 中，确保以下变量都已配置：

#### 必需变量 ✅

- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID`
- [ ] `GITHUB_CLIENT_SECRET`
- [ ] `OPENROUTER_API_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL`

#### 可选变量 ⚪

- [ ] `CLEANUP_SECRET`
- [ ] `CREEM_API_KEY`
- [ ] `CREEM_WEBHOOK_SECRET`

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
