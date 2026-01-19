import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"

export const metadata: Metadata = getToolMetadata("text-to-pdf")

export default function TextToPDFLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
