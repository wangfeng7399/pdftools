import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Terms of Service - PDF Summarizer",
  description:
    "Terms and conditions for using PDF Summarizer service. Read our user agreement, acceptable use policy, and service terms.",
  keywords: ["terms of service", "user agreement", "PDF tools terms", "service terms"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service - PDF Summarizer",
    description: "Terms and conditions for using PDF Summarizer service.",
    url: `${siteUrl}/terms`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
}

// Force dynamic rendering to avoid build-time Supabase client issues
export const dynamic = "force-dynamic"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 mx-auto">
          <div className="max-w-4xl mx-auto prose prose-sm max-w-none dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using PDF Summarizer ("the Service"), you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to these Terms of Service, please do
              not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              PDF Summarizer provides AI-powered PDF analysis, summarization, and processing tools. The Service
              includes but is not limited to:
            </p>
            <ul>
              <li>PDF document summarization</li>
              <li>Interactive chat with PDF documents</li>
              <li>PDF editing and conversion tools</li>
              <li>Document format conversion</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of the Service, you must create an account. You agree to provide
              accurate, current, and complete information during registration.
            </p>
            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities that occur under your account.
            </p>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any fraudulent or malicious purpose</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section>
            <h2>5. File Uploads and Content</h2>
            <h3>5.1 Your Content</h3>
            <p>
              You retain ownership of all files you upload. By uploading files, you grant us a limited license
              to process them solely for the purpose of providing the Service.
            </p>
            <h3>5.2 Automatic Deletion</h3>
            <p>
              All uploaded files and generated summaries are automatically deleted after 24 hours. We do not
              permanently store your document content.
            </p>
            <h3>5.3 Prohibited Content</h3>
            <p>
              You may not upload content that contains viruses, malware, or any other harmful code. We reserve
              the right to remove any content that violates these terms.
            </p>
          </section>

          <section>
            <h2>6. Subscription and Payment</h2>
            <h3>6.1 Free Tier</h3>
            <p>
              We offer a free tier with limited features. Free users receive 1 free summary and 3 chat messages.
            </p>
            <h3>6.2 Paid Plans</h3>
            <p>
              Paid subscriptions are billed according to the plan you select. All fees are non-refundable
              except as required by law.
            </p>
            <h3>6.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end of your
              current billing period.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by PDF
              Summarizer and is protected by international copyright, trademark, and other intellectual property
              laws.
            </p>
          </section>

          <section>
            <h2>8. Service Availability</h2>
            <p>
              We strive to provide reliable service but do not guarantee uninterrupted or error-free
              operation. We reserve the right to modify, suspend, or discontinue the Service at any time with
              or without notice.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, PDF Summarizer shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless PDF Summarizer from any claims, damages, or expenses
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>11. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Service immediately,
              without prior notice, for conduct that we believe violates these Terms or is harmful to other
              users or the Service.
            </p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes
              by posting the updated Terms on this page. Your continued use of the Service after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard
              to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>14. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@pdfsummarizer.com" className="text-primary hover:underline">
                legal@pdfsummarizer.com
              </a>
            </p>
          </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
