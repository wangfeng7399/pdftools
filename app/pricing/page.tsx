"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for trying out our service",
    features: [
      "1 free PDF summary",
      "3 chat questions",
      "Basic PDF tools",
      "50MB file size limit",
    ],
    popular: false,
  },
  {
    name: "Starter",
    price: 9.99,
    description: "For occasional users",
    features: [
      "10 PDF summaries per month",
      "50 chat questions",
      "All PDF tools",
      "100MB file size limit",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Standard",
    price: 19.99,
    description: "For regular users",
    features: [
      "Unlimited PDF summaries",
      "Unlimited chat questions",
      "All PDF tools",
      "200MB file size limit",
      "Priority support",
      "Advanced features",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: 39.99,
    description: "For power users",
    features: [
      "Unlimited PDF summaries",
      "Unlimited chat questions",
      "All PDF tools",
      "500MB file size limit",
      "24/7 priority support",
      "Advanced features",
      "API access",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const { user } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      // Free plan - just redirect to dashboard
      router.push("/dashboard")
      return
    }

    if (!user) {
      router.push("/auth/signin")
      return
    }

    setLoading(plan.name)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan.name.toLowerCase(),
          amount: plan.price,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Checkout failed")
      }

      const data = await response.json()
      
      // Redirect to Creem checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error instanceof Error ? error.message : "Checkout failed")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include our core PDF tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan)}
                className="w-full"
                size="lg"
                variant={plan.popular ? "default" : "outline"}
                disabled={loading === plan.name}
              >
                {loading === plan.name ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : plan.price === 0 ? (
                  "Get Started"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
