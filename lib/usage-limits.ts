import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export interface UsageLimits {
  maxFileSize: number // in bytes
  maxSummaries: number
  maxChatMessages: number
}

export const PLAN_LIMITS: Record<string, UsageLimits> = {
  free: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxSummaries: 1, // First summary is free
    maxChatMessages: 3, // 3 chat messages
  },
  starter: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxSummaries: 10, // 10 summaries per month
    maxChatMessages: 50, // 50 chat questions per month
  },
  standard: {
    maxFileSize: 200 * 1024 * 1024, // 200MB
    maxSummaries: Infinity, // Unlimited
    maxChatMessages: Infinity, // Unlimited
  },
  premium: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxSummaries: Infinity, // Unlimited
    maxChatMessages: Infinity, // Unlimited
  },
}

/**
 * Get user's current subscription plan
 */
export async function getUserPlan(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: {
          status: {
            in: ["active", "trialing"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const subscription = user.subscriptions[0]
  return subscription?.plan || "free"
}

/**
 * Get user's usage limits based on their plan
 */
export async function getUserLimits(userId: string): Promise<UsageLimits> {
  const plan = await getUserPlan(userId)
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}

/**
 * Check if user has reached summary limit
 */
export async function checkSummaryLimit(userId: string): Promise<{
  allowed: boolean
  used: number
  limit: number
  message?: string
}> {
  const limits = await getUserLimits(userId)
  const plan = await getUserPlan(userId)
  
  if (limits.maxSummaries === Infinity) {
    return { allowed: true, used: 0, limit: Infinity }
  }

  // For starter plan, count summaries in current month
  // For free plan, count all summaries
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const whereClause: any = {
    userId,
    type: "summary",
  }
  
  // Starter plan has monthly limits
  if (plan === "starter") {
    whereClause.createdAt = {
      gte: startOfMonth,
    }
  }

  const summaryCount = await prisma.usage.count({
    where: whereClause,
  })

  const allowed = summaryCount < limits.maxSummaries

  return {
    allowed,
    used: summaryCount,
    limit: limits.maxSummaries,
    message: allowed
      ? undefined
      : plan === "starter"
      ? `You have reached your monthly summary limit (${limits.maxSummaries} summaries). Please upgrade to continue.`
      : `You have reached your summary limit (${limits.maxSummaries}). Please upgrade to continue.`,
  }
}

/**
 * Check if user has reached chat message limit
 */
export async function checkChatLimit(userId: string): Promise<{
  allowed: boolean
  used: number
  limit: number
  message?: string
}> {
  const limits = await getUserLimits(userId)
  const plan = await getUserPlan(userId)
  
  if (limits.maxChatMessages === Infinity) {
    return { allowed: true, used: 0, limit: Infinity }
  }

  // For starter plan, count chat messages in current month
  // For free plan, count all chat messages
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const whereClause: any = {
    userId,
    type: "chat",
  }
  
  // Starter plan has monthly limits
  if (plan === "starter") {
    whereClause.createdAt = {
      gte: startOfMonth,
    }
  }

  const chatCount = await prisma.usage.count({
    where: whereClause,
  })

  const allowed = chatCount < limits.maxChatMessages

  return {
    allowed,
    used: chatCount,
    limit: limits.maxChatMessages,
    message: allowed
      ? undefined
      : plan === "starter"
      ? `You have reached your monthly chat limit (${limits.maxChatMessages} messages). Please upgrade to continue.`
      : `You have reached your free chat limit (${limits.maxChatMessages} messages). Please upgrade to continue.`,
  }
}

/**
 * Check if file size is within user's limit
 */
export async function checkFileSizeLimit(
  userId: string,
  fileSize: number
): Promise<{
  allowed: boolean
  maxSize: number
  message?: string
}> {
  const limits = await getUserLimits(userId)

  const allowed = fileSize <= limits.maxFileSize

  return {
    allowed,
    maxSize: limits.maxFileSize,
    message: allowed
      ? undefined
      : `File size exceeds your plan limit (${Math.round(limits.maxFileSize / 1024 / 1024)}MB). Please upgrade to upload larger files.`,
  }
}

/**
 * Record a usage event (summary or chat)
 */
export async function recordUsage(
  userId: string,
  type: "summary" | "chat",
  fileId?: string
): Promise<void> {
  await prisma.usage.create({
    data: {
      userId,
      type,
      fileId,
    },
  })
}

/**
 * Get current user from session and check authentication
 */
export async function getCurrentUser() {
  const { user } = await auth()
  
  if (!user?.email) {
    throw new Error("Unauthorized")
  }

  // Try to find user in Prisma by email
  // If not found, create user from Supabase auth user
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!dbUser) {
    // Create user in Prisma if it doesn't exist
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split("@")[0],
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      },
    })
  }

  return dbUser
}
