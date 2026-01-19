import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SupabaseProvider } from "@/components/providers/supabase-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfsummarizer.com"
const siteName = "PDF Summarizer"
const siteDescription =
  "Transform lengthy PDFs into concise summaries with our AI-powered tool. Chat with your documents, extract insights, and save hours of reading time. Free trial available."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI PDF Summarizer - Summarize Any Document in Seconds",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "PDF summarizer",
    "AI document analysis",
    "PDF chat",
    "document summary",
    "AI reading assistant",
    "PDF tools",
    "PDF editor",
    "PDF converter",
    "AI summarization",
    "document analysis",
    "PDF processing",
    "PDF merge",
    "PDF split",
    "PDF compress",
    "PDF rotate",
    "PDF crop",
    "free PDF tools",
    "online PDF editor",
    "PDF to text",
    "AI PDF analyzer",
    "document summarization",
    "PDF reader",
    "PDF manager",
    "PDF utilities",
  ],
  authors: [{ name: "PDF Summarizer Team" }],
  creator: "PDF Summarizer",
  publisher: "PDF Summarizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "AI PDF Summarizer - Summarize Any Document in Seconds",
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PDF Summarizer - AI-Powered Document Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PDF Summarizer - Summarize Any Document in Seconds",
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@pdfsummarizer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
