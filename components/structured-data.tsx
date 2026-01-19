import { siteUrl } from "@/lib/constants"

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "WebPage" | "SoftwareApplication"
  data?: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
    }

    switch (type) {
      case "Organization":
        return {
          ...baseData,
          name: "PDF Summarizer",
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          description:
            "AI-powered PDF analysis and summarization platform for professionals worldwide.",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "support@pdfsummarizer.com",
          },
          sameAs: [
            // Add social media links when available
            // "https://twitter.com/pdfsummarizer",
            // "https://linkedin.com/company/pdfsummarizer",
          ],
        }

      case "WebSite":
        return {
          ...baseData,
          name: "PDF Summarizer",
          url: siteUrl,
          description:
            "AI-powered PDF analysis and summarization platform. Summarize documents, chat with PDFs, and extract insights instantly.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }

      case "SoftwareApplication":
        return {
          ...baseData,
          name: "PDF Summarizer",
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
          },
        }

      case "WebPage":
        return {
          ...baseData,
          ...data,
        }

      default:
        return baseData
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData()) }}
    />
  )
}
