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
        files: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50, // Limit to last 50 files
        },
        usages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 100, // Limit to last 100 usage records
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Group usage by type
    const summaryCount = dbUser.usages.filter((u) => u.type === "summary").length
    const chatCount = dbUser.usages.filter((u) => u.type === "chat").length

    return NextResponse.json({
      files: dbUser.files,
      usage: {
        summaries: summaryCount,
        chats: chatCount,
        total: dbUser.usages.length,
      },
      recentUsage: dbUser.usages.slice(0, 20), // Last 20 usage records
    })
  } catch (error) {
    console.error("Files fetch error:", error)
    return NextResponse.json(
      { error: `Failed to fetch files: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
