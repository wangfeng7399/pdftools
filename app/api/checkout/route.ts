import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createCreemCheckoutSession } from "@/lib/creem"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { user } = await auth()
    
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, amount } = await request.json()

    if (!plan || !amount) {
      return NextResponse.json({ error: "Plan and amount are required" }, { status: 400 })
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create checkout session with Creem
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
    const checkoutSession = await createCreemCheckoutSession({
      amount: amount * 100, // Convert to cents
      currency: "USD",
      customerEmail: dbUser.email || undefined,
      successUrl: `${baseUrl}/dashboard?success=true`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: dbUser.id,
        plan: plan,
      },
    })

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: `Checkout failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
