import { NextRequest, NextResponse } from "next/server"
import { readPDFFile, readSummary } from "@/lib/storage"
import { parsePDF } from "@/lib/pdf-parser"
import { chatWithPDF } from "@/lib/ai-client"
import { getCurrentUser, checkChatLimit, recordUsage } from "@/lib/usage-limits"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    const { fileId, question, conversationHistory = [], model } = await request.json()

    if (!fileId || !question) {
      return NextResponse.json({ error: "Missing fileId or question parameter" }, { status: 400 })
    }

    // Check if user owns this file
    const file = await prisma.file.findUnique({
      where: { fileId },
    })

    if (!file || file.userId !== user.id) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 403 })
    }

    // Check chat limit
    const limitCheck = await checkChatLimit(user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.message || "Chat limit reached",
          used: limitCheck.used,
          limit: limitCheck.limit,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // 读取PDF文件
    const buffer = await readPDFFile(fileId)
    const parsed = await parsePDF(buffer)

    // Generate answer
    const answer = await chatWithPDF(
      question,
      parsed.text,
      conversationHistory,
      model || "openai/gpt-4o-mini"
    )

    // Record usage
    await recordUsage(user.id, "chat", fileId)

    return NextResponse.json({
      answer,
      fileId,
    })
  } catch (error) {
    console.error("Chat error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Handle authentication errors
    if (errorMessage === "Unauthorized" || errorMessage === "User not found") {
      return NextResponse.json({ error: errorMessage }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: `Answer generation failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
