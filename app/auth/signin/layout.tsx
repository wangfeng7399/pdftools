import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Sign In - PDF Summarizer",
  description: "Sign in to PDF Summarizer with Google or GitHub. Access your account and manage your PDF documents.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign In - PDF Summarizer",
    description: "Sign in to PDF Summarizer with Google or GitHub.",
    url: `${siteUrl}/auth/signin`,
  },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
