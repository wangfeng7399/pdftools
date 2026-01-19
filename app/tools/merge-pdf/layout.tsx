import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("merge-pdf")

export default function MergePDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
