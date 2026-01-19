# 文件自动清理功能说明

## 功能概述

系统会自动删除超过24小时的文件，包括：
- 上传的PDF文件
- 生成的摘要文件
- 相关的数据库记录
- 使用记录

## 配置方式

### 方式1: Vercel Cron Jobs（推荐）

如果部署在Vercel上，系统已配置自动清理任务。`vercel.json` 文件中已配置：

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

这表示每6小时执行一次清理任务。

### 方式2: 外部Cron服务

可以使用以下服务定期调用清理API：

1. **cron-job.org**
   - 创建任务
   - URL: `https://your-domain.com/api/admin/cleanup`
   - 方法: POST
   - 频率: 每6小时或每天

2. **GitHub Actions**
   - 创建 `.github/workflows/cleanup.yml`:
   ```yaml
   name: Cleanup Expired Files
   on:
     schedule:
       - cron: '0 */6 * * *'  # Every 6 hours
   jobs:
     cleanup:
       runs-on: ubuntu-latest
       steps:
         - name: Call Cleanup API
           run: |
             curl -X POST https://your-domain.com/api/admin/cleanup
   ```

3. **手动调用**
   ```bash
   curl -X POST https://your-domain.com/api/admin/cleanup
   ```

## API端点

### POST `/api/admin/cleanup`
执行清理任务

**响应示例:**
```json
{
  "success": true,
  "deletedFiles": 5,
  "deletedSummaries": 3,
  "errors": [],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api/admin/cleanup`
查看清理统计信息（不执行清理）

**响应示例:**
```json
{
  "stats": {
    "filesToDelete": 5,
    "oldestFileDate": "2024-01-14T10:00:00.000Z"
  },
  "expiryHours": 24
}
```

## 安全考虑

在生产环境中，建议为清理API添加认证：

1. 在 `.env` 文件中设置密钥：
   ```
   CLEANUP_SECRET=your-secret-key-here
   ```

2. 在 `app/api/admin/cleanup/route.ts` 中取消注释认证代码

3. 在调用API时添加认证头：
   ```bash
   curl -X POST \
     -H "Authorization: Bearer your-secret-key-here" \
     https://your-domain.com/api/admin/cleanup
   ```

## 清理逻辑

1. **数据库记录清理**
   - 查找创建时间超过24小时的文件记录
   - 删除文件记录和相关的使用记录

2. **物理文件清理**
   - 删除 `uploads/` 目录中的PDF文件
   - 删除 `summaries/` 目录中的JSON文件

3. **孤立文件清理**
   - 清理数据库中不存在但文件系统中存在的文件
   - 清理超过24小时的孤立文件

## 监控

建议定期检查清理任务是否正常运行：
- 查看API响应中的 `deletedFiles` 和 `deletedSummaries` 数量
- 检查 `errors` 数组是否有错误信息
- 监控服务器存储空间使用情况
