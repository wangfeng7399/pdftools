import type { Metadata } from "next"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowToSection } from "@/components/how-to-section"
import { FeaturesSection } from "@/components/features-section"
import { ToolsSection } from "@/components/tools-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { StructuredData } from "@/components/structured-data"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "AI PDF Summarizer - Summarize Any Document in Seconds",
  description:
    "Transform lengthy PDFs into concise summaries with our AI-powered tool. Chat with your documents, extract insights, and save hours of reading time. Free trial available.",
  keywords: [
    "PDF summarizer",
    "AI document analysis",
    "PDF chat",
    "document summary",
    "AI reading assistant",
    "PDF tools",
    "free PDF summarizer",
  ],
  openGraph: {
    title: "AI PDF Summarizer - Summarize Any Document in Seconds",
    description:
      "Transform lengthy PDFs into concise summaries with our AI-powered tool. Chat with your documents, extract insights, and save hours of reading time.",
    url: siteUrl,
    siteName: "PDF Summarizer",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PDF Summarizer - AI-Powered Document Analysis",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PDF Summarizer - Summarize Any Document in Seconds",
    description:
      "Transform lengthy PDFs into concise summaries with our AI-powered tool. Chat with your documents, extract insights, and save hours of reading time.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function Home() {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <HowToSection />
          <FeaturesSection />
          <ToolsSection />
          <UseCasesSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
