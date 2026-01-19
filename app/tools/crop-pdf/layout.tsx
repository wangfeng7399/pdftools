import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("crop-pdf")

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
