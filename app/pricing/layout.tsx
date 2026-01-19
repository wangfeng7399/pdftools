import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Pricing Plans - PDF Summarizer",
  description:
    "Choose the perfect plan for your needs. Free tier available with 1 summary and 3 chat messages. Upgrade for unlimited access and advanced features.",
  keywords: [
    "PDF summarizer pricing",
    "PDF tools pricing",
    "AI document analysis pricing",
    "PDF summarizer plans",
    "affordable PDF tools",
  ],
  openGraph: {
    title: "Pricing Plans - PDF Summarizer",
    description:
      "Choose the perfect plan for your needs. Free tier available with 1 summary and 3 chat messages. Upgrade for unlimited access.",
    url: `${siteUrl}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pricing Plans - PDF Summarizer",
    description: "Choose the perfect plan for your needs. Free tier available.",
  },
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
