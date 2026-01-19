import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { FileText, Users, Target, Zap } from "lucide-react"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us - PDF Summarizer",
  description:
    "Learn about our mission to make PDF analysis accessible and efficient for everyone. AI-powered document analysis for professionals worldwide.",
  keywords: ["about PDF summarizer", "PDF tools company", "AI document analysis team"],
  openGraph: {
    title: "About Us - PDF Summarizer",
    description:
      "Learn about our mission to make PDF analysis accessible and efficient for everyone. AI-powered document analysis for professionals worldwide.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us - PDF Summarizer",
    description: "Learn about our mission to make PDF analysis accessible and efficient for everyone.",
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

// Force dynamic rendering to avoid build-time Supabase client issues
export const dynamic = "force-dynamic"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 mx-auto">
          <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground">
              Empowering professionals worldwide with AI-powered PDF analysis
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At PDF Summarizer, we believe that time is your most valuable resource. Our mission is to help
              professionals, students, and researchers save hours of reading time by providing intelligent,
              AI-powered document analysis tools.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We combine cutting-edge artificial intelligence with user-friendly design to make complex PDF
              documents accessible and understandable in seconds, not hours.
            </p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground">
                To become the leading platform for AI-powered document analysis, making information extraction
                and understanding effortless for everyone.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">What We Do</h3>
              </div>
              <p className="text-muted-foreground">
                We provide advanced PDF processing tools including AI summarization, interactive chat with
                documents, and comprehensive PDF editing capabilities.
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Why Choose Us</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our advanced AI models understand context, extract key insights, and provide accurate
                    summaries in multiple languages.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">User-Focused Design</h3>
                  <p className="text-sm text-muted-foreground">
                    We prioritize simplicity and ease of use, ensuring that anyone can leverage the power of AI
                    without technical expertise.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast & Reliable</h3>
                  <p className="text-sm text-muted-foreground">
                    Process documents in seconds with our optimized infrastructure, ensuring your data is
                    secure and your results are delivered quickly.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to protecting your privacy and data security. All files are automatically
              deleted after 24 hours, and we never store or share your document content. Your trust is our
              foundation, and we work tirelessly to maintain the highest standards of security and privacy.
            </p>
          </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
