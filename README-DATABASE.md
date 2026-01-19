# 数据库配置说明

本项目支持多环境数据库配置：
- **本地开发**: 使用 SQLite（`file:./dev.db`）
- **生产环境**: 使用 PostgreSQL

## 配置步骤

### 1. 环境变量配置

创建 `.env` 文件（如果还没有）：

```bash
# 本地开发 - 使用 SQLite
DATABASE_URL="file:./dev.db"

# 生产环境 - 使用 PostgreSQL（示例）
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

### 2. 初始化数据库

首次使用或切换数据库时，运行：

```bash
# 生成 Prisma Client（会根据 DATABASE_URL 自动选择 schema）
pnpm db:generate

# 创建数据库迁移
pnpm db:migrate

# 或者直接推送 schema（开发环境推荐）
pnpm db:push
```

### 3. 开发命令

所有数据库相关命令都会自动根据 `DATABASE_URL` 选择正确的 schema：

```bash
# 生成 Prisma Client
pnpm db:generate

# 创建迁移
pnpm db:migrate

# 推送 schema 变更（开发环境）
pnpm db:push

# 打开 Prisma Studio
pnpm db:studio

# 部署迁移（生产环境）
pnpm db:migrate:deploy
```

## 工作原理

1. `scripts/select-schema.js` 脚本会根据 `DATABASE_URL` 环境变量自动选择：
   - 如果 `DATABASE_URL` 以 `file:` 开头 → 使用 `schema.sqlite.prisma`
   - 否则 → 使用 `schema.prisma` (PostgreSQL)

2. 选中的 schema 会被复制到 `schema.active.prisma`（此文件会被 git 忽略）

3. `prisma.config.ts` 始终使用 `schema.active.prisma`

## 切换数据库

### 从 SQLite 切换到 PostgreSQL

1. 更新 `.env` 文件中的 `DATABASE_URL`：
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   ```

2. 运行迁移：
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

### 从 PostgreSQL 切换到 SQLite

1. 更新 `.env` 文件中的 `DATABASE_URL`：
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

2. 运行迁移：
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

## 注意事项

- `schema.active.prisma` 是自动生成的，不要手动编辑
- 本地开发时，SQLite 数据库文件会保存在 `prisma/dev.db`
- 生产环境部署时，确保 `DATABASE_URL` 指向 PostgreSQL
- 两个 schema 文件（`schema.prisma` 和 `schema.sqlite.prisma`）应该保持同步
