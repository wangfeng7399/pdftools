import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfsummarizer.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl

  // Static pages
  const routes = [
    "",
    "/tools",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/auth/signin",
    "/dashboard",
  ]

  // PDF tools pages
  const toolRoutes = [
    "/tools/merge-pdf",
    "/tools/split-pdf",
    "/tools/rotate-pdf",
    "/tools/crop-pdf",
    "/tools/delete-pages",
    "/tools/extract-pages",
    "/tools/compress-pdf",
    "/tools/create-pdf",
    "/tools/image-to-pdf",
    "/tools/text-to-pdf",
    "/tools/excel-to-pdf",
    "/tools/csv-to-pdf",
    "/tools/csv-to-excel",
  ]

  const allRoutes = [...routes, ...toolRoutes]

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : route.startsWith("/tools") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/pricing" ? 0.9 : route.startsWith("/tools") ? 0.8 : 0.7,
  }))
}
