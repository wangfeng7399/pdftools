import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfsummarizer.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/summary/",
          "/auth/",
          "/admin/",
          "/_next/",
          "/uploads/",
          "/summaries/",
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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
