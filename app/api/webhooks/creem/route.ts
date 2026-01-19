import { NextRequest, NextResponse } from "next/server"
import { verifyCreemWebhook } from "@/lib/creem"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("creem-signature") || ""

    // Verify webhook signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("CREEM_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const isValid = verifyCreemWebhook(body, signature, webhookSecret)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case "payment.succeeded":
        await handlePaymentSucceeded(event.data)
        break
      case "payment.failed":
        await handlePaymentFailed(event.data)
        break
      case "subscription.created":
        await handleSubscriptionCreated(event.data)
        break
      case "subscription.updated":
        await handleSubscriptionUpdated(event.data)
        break
      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: `Webhook processing failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(data: any) {
  const metadata = data.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    console.error("No userId in payment metadata")
    return
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      creemPaymentId: data.id,
      amount: data.amount / 100, // Convert from cents
      currency: data.currency || "USD",
      status: "succeeded",
      creemCheckoutId: data.checkout_session || null,
    },
  })
}

async function handlePaymentFailed(data: any) {
  // Log failed payment
  await prisma.payment.create({
    data: {
      creemPaymentId: data.id,
      amount: data.amount / 100,
      currency: data.currency || "USD",
      status: "failed",
      creemCheckoutId: data.checkout_session || null,
    },
  })
}

async function handleSubscriptionCreated(data: any) {
  const metadata = data.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    console.error("No userId in subscription metadata")
    return
  }

  // Create or update subscription
  await prisma.subscription.upsert({
    where: { creemSubscriptionId: data.id },
    update: {
      status: data.status,
      plan: metadata.plan || "standard",
      currentPeriodStart: data.current_period_start ? new Date(data.current_period_start * 1000) : null,
      currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end * 1000) : null,
    },
    create: {
      userId: userId,
      creemCustomerId: data.customer || null,
      creemSubscriptionId: data.id,
      status: data.status,
      plan: metadata.plan || "standard",
      currentPeriodStart: data.current_period_start ? new Date(data.current_period_start * 1000) : null,
      currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end * 1000) : null,
    },
  })
}

async function handleSubscriptionUpdated(data: any) {
  await prisma.subscription.updateMany({
    where: { creemSubscriptionId: data.id },
    data: {
      status: data.status,
      currentPeriodStart: data.current_period_start ? new Date(data.current_period_start * 1000) : null,
      currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end * 1000) : null,
      cancelAtPeriodEnd: data.cancel_at_period_end || false,
    },
  })
}

async function handleSubscriptionCanceled(data: any) {
  await prisma.subscription.updateMany({
    where: { creemSubscriptionId: data.id },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
    },
  })
}
