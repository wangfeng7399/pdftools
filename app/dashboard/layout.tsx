import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Dashboard - PDF Summarizer",
  description: "View your PDF files, usage statistics, and subscription information in your personal dashboard.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Dashboard - PDF Summarizer",
    description: "View your PDF files, usage statistics, and subscription information.",
    url: `${siteUrl}/dashboard`,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
