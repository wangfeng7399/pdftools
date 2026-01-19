import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { siteUrl } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Cookie Policy - PDF Summarizer",
  description:
    "Learn about how we use cookies and similar technologies on our website. Understand cookie types and how to manage them.",
  keywords: ["cookie policy", "cookies", "tracking", "website cookies"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cookie Policy - PDF Summarizer",
    description: "Learn about how we use cookies and similar technologies on our website.",
    url: `${siteUrl}/cookies`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/cookies`,
  },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 mx-auto">
          <div className="max-w-4xl mx-auto prose prose-sm max-w-none dark:prose-invert">
          <h1>Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>

          <section>
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are
              widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section>
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>

            <h3>2.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable core functionality
              such as:
            </p>
            <ul>
              <li>User authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Remembering your preferences</li>
            </ul>

            <h3>2.2 Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how visitors interact with our website. This helps us
              improve our service by:
            </p>
            <ul>
              <li>Tracking page views and user behavior</li>
              <li>Identifying popular features</li>
              <li>Understanding user preferences</li>
            </ul>
            <p>
              We use Vercel Analytics, which collects anonymized usage data. No personally identifiable
              information is collected.
            </p>

            <h3>2.3 Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as:
            </p>
            <ul>
              <li>Remembering your language preferences</li>
              <li>Storing your theme preferences (light/dark mode)</li>
              <li>Maintaining your session state</li>
            </ul>
          </section>

          <section>
            <h2>3. Third-Party Cookies</h2>
            <p>We may use third-party services that set their own cookies:</p>
            <ul>
              <li>
                <strong>Authentication Providers:</strong> Google and GitHub OAuth may set cookies for
                authentication purposes
              </li>
              <li>
                <strong>Analytics:</strong> Vercel Analytics uses cookies to track website usage
              </li>
              <li>
                <strong>Payment Processing:</strong> Creem may set cookies for payment processing
              </li>
            </ul>
            <p>
              These third parties have their own privacy policies and cookie practices. We recommend reviewing
              their policies.
            </p>
          </section>

          <section>
            <h2>4. Cookie Duration</h2>
            <h3>4.1 Session Cookies</h3>
            <p>
              These cookies are temporary and are deleted when you close your browser. They are used to
              maintain your session while using the Service.
            </p>
            <h3>4.2 Persistent Cookies</h3>
            <p>
              These cookies remain on your device for a set period or until you delete them. They are used to
              remember your preferences and settings.
            </p>
          </section>

          <section>
            <h2>5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <h3>5.1 Browser Settings</h3>
            <p>
              Most browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Set preferences for specific websites</li>
            </ul>
            <p>
              Note: Blocking essential cookies may affect the functionality of our Service.
            </p>
            <h3>5.2 Opt-Out Tools</h3>
            <p>
              You can use browser extensions or opt-out tools provided by third-party analytics services to
              manage tracking cookies.
            </p>
          </section>

          <section>
            <h2>6. Do Not Track Signals</h2>
            <p>
              Some browsers send "Do Not Track" signals. Currently, we do not respond to these signals, but we
              respect your cookie preferences as set in your browser.
            </p>
          </section>

          <section>
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for
              other operational, legal, or regulatory reasons. We will notify you of any material changes by
              posting the updated policy on this page.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at{" "}
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
