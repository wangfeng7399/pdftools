import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { user } = await auth()
    
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
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

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const subscription = dbUser.subscriptions[0] || null

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json(
      { error: `Failed to fetch subscription: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
