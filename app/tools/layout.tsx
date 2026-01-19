import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "PDF Tools - All-in-One PDF Processing Suite",
  description:
    "Comprehensive PDF tools including merge, split, rotate, compress, convert, and more. Edit, convert, and process PDFs with ease.",
  keywords: [
    "PDF tools",
    "PDF editor",
    "PDF converter",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "PDF to image",
    "image to PDF",
    "PDF processing",
  ],
  openGraph: {
    title: "PDF Tools - All-in-One PDF Processing Suite",
    description:
      "Comprehensive PDF tools including merge, split, rotate, compress, convert, and more. Edit, convert, and process PDFs with ease.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools - All-in-One PDF Processing Suite",
    description: "Comprehensive PDF tools for all your document processing needs.",
  },
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
