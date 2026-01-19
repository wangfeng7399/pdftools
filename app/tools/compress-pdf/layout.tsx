import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("compress-pdf")

export default function CompressPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
