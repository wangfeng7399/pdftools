import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("split-pdf")

export default function SplitPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
