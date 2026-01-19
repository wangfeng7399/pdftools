import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfsummarizer.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",           // API 端点 - 禁止索引
          "/dashboard/",     // 用户仪表板 - 禁止索引（需要登录）
          "/summary/",       // 用户摘要页面 - 禁止索引（私有内容）
          "/auth/",          // 认证页面 - 禁止索引
          "/admin/",         // 管理页面 - 禁止索引
          "/_next/",         // Next.js 内部文件 - 禁止索引
          "/uploads/",        // 上传文件 - 禁止索引（私有内容）
          "/summaries/",     // 摘要文件 - 禁止索引（私有内容）
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/summary/",
          "/auth/",
          "/admin/",
          "/uploads/",
          "/summaries/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/summary/",
          "/auth/",
          "/admin/",
          "/uploads/",
          "/summaries/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
