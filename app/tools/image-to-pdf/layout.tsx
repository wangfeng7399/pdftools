import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("image-to-pdf")

export default function ImageToPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
