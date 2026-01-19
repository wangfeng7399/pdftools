import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact Us - PDF Summarizer",
  description:
    "Get in touch with PDF Summarizer. Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  keywords: ["contact PDF summarizer", "PDF tools support", "customer service"],
  openGraph: {
    title: "Contact Us - PDF Summarizer",
    description:
      "Get in touch with PDF Summarizer. Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - PDF Summarizer",
    description: "Get in touch with PDF Summarizer. Have questions? We'd love to hear from you.",
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
