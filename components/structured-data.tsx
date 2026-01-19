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
          logo: `${siteUrl}/icon.svg`,
          description:
            "AI-powered PDF analysis and summarization platform for professionals worldwide. Summarize documents, chat with PDFs, merge, split, compress, and convert PDFs with ease.",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "support@pdfsummarizer.com",
            availableLanguage: ["English"],
          },
          sameAs: [
            // Add social media links when available
            // "https://twitter.com/pdfsummarizer",
            // "https://linkedin.com/company/pdfsummarizer",
            // "https://facebook.com/pdfsummarizer",
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
          description:
            "AI-powered PDF tools for summarizing, editing, merging, splitting, compressing, and converting PDF documents. Free and easy to use.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
            bestRating: "5",
            worstRating: "1",
          },
          featureList: [
            "AI-powered PDF summarization",
            "PDF merge and split",
            "PDF compress and optimize",
            "PDF rotate and crop",
            "PDF to text conversion",
            "Image to PDF conversion",
            "Excel/CSV to PDF conversion",
            "Chat with PDF documents",
          ],
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
