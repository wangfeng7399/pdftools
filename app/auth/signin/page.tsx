"use client"

import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (provider: "google" | "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your PDF tools and summaries
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleSignIn("google")}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <Mail className="h-5 w-5 mr-2" />
              Continue with Google
            </Button>

            <Button
              onClick={() => handleSignIn("github")}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <Github className="h-5 w-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
