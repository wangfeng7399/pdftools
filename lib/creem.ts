/**
 * Creem Payment API Integration
 * Documentation: https://docs.creem.com
 */

const CREEM_API_BASE = process.env.CREEM_API_BASE || "https://api.creem.com/v1"
const CREEM_API_KEY = process.env.CREEM_API_KEY

interface CreemCheckoutSession {
  id: string
  url: string
  customer_email?: string
  amount: number
  currency: string
  status: string
}

interface CreemWebhookEvent {
  type: string
  data: {
    id: string
    object: string
    amount: number
    currency: string
    status: string
    customer?: string
    subscription?: string
    [key: string]: any
  }
}

/**
 * Create a checkout session with Creem
 */
export async function createCreemCheckoutSession(params: {
  amount: number
  currency?: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}): Promise<CreemCheckoutSession> {
  if (!CREEM_API_KEY) {
    throw new Error("CREEM_API_KEY is not configured")
  }

  const response = await fetch(`${CREEM_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CREEM_API_KEY}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || "USD",
      customer_email: params.customerEmail,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata || {},
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Creem API error: ${error.message || "Unknown error"}`)
  }

  return response.json()
}

/**
 * Verify Creem webhook signature
 */
export function verifyCreemWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implement webhook signature verification based on Creem's documentation
  // This is a placeholder - actual implementation depends on Creem's webhook signing method
  const crypto = require("crypto")
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Get payment status from Creem
 */
export async function getCreemPaymentStatus(paymentId: string): Promise<any> {
  if (!CREEM_API_KEY) {
    throw new Error("CREEM_API_KEY is not configured")
  }

  const response = await fetch(`${CREEM_API_BASE}/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${CREEM_API_KEY}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Creem API error: ${error.message || "Unknown error"}`)
  }

  return response.json()
}

/**
 * Create or update subscription
 */
export async function createCreemSubscription(params: {
  customerId: string
  planId: string
  metadata?: Record<string, string>
}): Promise<any> {
  if (!CREEM_API_KEY) {
    throw new Error("CREEM_API_KEY is not configured")
  }

  const response = await fetch(`${CREEM_API_BASE}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CREEM_API_KEY}`,
    },
    body: JSON.stringify({
      customer: params.customerId,
      plan: params.planId,
      metadata: params.metadata || {},
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Creem API error: ${error.message || "Unknown error"}`)
  }

  return response.json()
}
