import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Privacy Policy - PDF Summarizer",
  description:
    "Our privacy policy explains how we collect, use, and protect your personal information. Learn about our data security and privacy practices.",
  keywords: ["privacy policy", "data protection", "GDPR", "privacy policy PDF tools"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - PDF Summarizer",
    description:
      "Our privacy policy explains how we collect, use, and protect your personal information.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 mx-auto">
          <div className="max-w-4xl mx-auto prose prose-sm max-w-none dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              PDF Summarizer ("we", "our", or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you use our
              service.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>Account information (name, email address) when you sign up</li>
              <li>PDF files you upload for processing</li>
              <li>Payment information (processed securely through our payment provider)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>Usage data and analytics</li>
              <li>Device information and IP address</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process your PDF files and generate summaries</li>
              <li>Manage your account and subscriptions</li>
              <li>Send you service-related communications</li>
              <li>Improve our service and develop new features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Storage and Retention</h2>
            <p>
              <strong>File Deletion:</strong> All uploaded PDF files and generated summaries are automatically
              deleted after 24 hours. We do not permanently store your document content.
            </p>
            <p>
              <strong>Account Data:</strong> Your account information is retained as long as your account is
              active. You can request deletion of your account at any time.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure file storage with automatic deletion</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h2>6. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li>
                <strong>Authentication:</strong> Google and GitHub OAuth for secure login
              </li>
              <li>
                <strong>AI Processing:</strong> OpenRouter API for AI-powered document analysis
              </li>
              <li>
                <strong>Payments:</strong> Creem for secure payment processing
              </li>
              <li>
                <strong>Analytics:</strong> Vercel Analytics for service improvement
              </li>
            </ul>
            <p>
              These services have their own privacy policies. We recommend reviewing them to understand how
              they handle your data.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@pdfsummarizer.com" className="text-primary hover:underline">
                privacy@pdfsummarizer.com
              </a>
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              We use cookies to enhance your experience, analyze usage, and assist with authentication. You can
              control cookies through your browser settings. See our{" "}
              <a href="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>{" "}
              for more details.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal
              information from children under 13.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@pdfsummarizer.com" className="text-primary hover:underline">
                privacy@pdfsummarizer.com
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
