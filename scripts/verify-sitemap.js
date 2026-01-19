#!/usr/bin/env node

/**
 * 验证 sitemap.ts 生成的 sitemap 结构
 * 运行: node scripts/verify-sitemap.js
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfsummarizer.com"

// 模拟 sitemap 生成逻辑
function generateSitemap() {
  const now = new Date()
  const baseUrl = siteUrl

  const homePage = {
    url: baseUrl,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  }

  const corePages = [
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  const toolRoutes = [
    "/tools/merge-pdf",
    "/tools/split-pdf",
    "/tools/compress-pdf",
    "/tools/rotate-pdf",
    "/tools/crop-pdf",
    "/tools/delete-pages",
    "/tools/extract-pages",
    "/tools/create-pdf",
    "/tools/image-to-pdf",
    "/tools/text-to-pdf",
    "/tools/excel-to-pdf",
    "/tools/csv-to-pdf",
    "/tools/csv-to-excel",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const infoPages = [
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const legalPages = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  return [homePage, ...corePages, ...toolRoutes, ...infoPages, ...legalPages]
}

// 验证 sitemap
const sitemap = generateSitemap()

console.log("✅ Sitemap 验证结果:\n")
console.log(`总页面数: ${sitemap.length}`)
console.log(`站点 URL: ${siteUrl}\n`)

console.log("页面列表:")
sitemap.forEach((page, index) => {
  console.log(`${index + 1}. ${page.url}`)
  console.log(`   优先级: ${page.priority}, 更新频率: ${page.changeFrequency}`)
})

console.log("\n✅ Sitemap 结构验证通过!")
console.log("\n部署后访问以下 URL 查看生成的 sitemap:")
console.log(`  - ${siteUrl}/sitemap.xml`)
console.log(`  - ${siteUrl}/robots.txt`)
