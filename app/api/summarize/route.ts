import { NextRequest, NextResponse } from "next/server"
import { readPDFFile, saveSummary } from "@/lib/storage"
import { parsePDF } from "@/lib/pdf-parser"
import { generateSummaryForLongDocument } from "@/lib/ai-client"
import { getCurrentUser, checkSummaryLimit, recordUsage } from "@/lib/usage-limits"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log("[Summarize API] Request started")
  
  try {
    // Check authentication
    console.log("[Summarize API] Step 1: Checking authentication...")
    const user = await getCurrentUser()
    console.log("[Summarize API] ✓ Authentication passed, user:", user.email)

    const { fileId, model } = await request.json()
    console.log("[Summarize API] Step 2: Request params - fileId:", fileId, "model:", model || "default")

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId parameter" }, { status: 400 })
    }

    // Check if user owns this file
    console.log("[Summarize API] Step 3: Checking file ownership...")
    const file = await prisma.file.findUnique({
      where: { fileId },
    })

    if (!file || file.userId !== user.id) {
      console.log("[Summarize API] ✗ File not found or access denied")
      return NextResponse.json({ error: "File not found or access denied" }, { status: 403 })
    }
    console.log("[Summarize API] ✓ File found:", file.fileName)

    // Check summary limit
    console.log("[Summarize API] Step 4: Checking summary limit...")
    const limitCheck = await checkSummaryLimit(user.id)
    if (!limitCheck.allowed) {
      console.log("[Summarize API] ✗ Summary limit reached:", limitCheck)
      return NextResponse.json(
        {
          error: limitCheck.message || "Summary limit reached",
          used: limitCheck.used,
          limit: limitCheck.limit,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }
    console.log("[Summarize API] ✓ Limit check passed")

    // 读取PDF文件
    console.log("[Summarize API] Step 5: Reading PDF file...")
    const buffer = await readPDFFile(fileId)
    console.log("[Summarize API] ✓ PDF file read, size:", buffer.length, "bytes")
    
    // 解析PDF
    console.log("[Summarize API] Step 6: Parsing PDF...")
    const parsed = await parsePDF(buffer)
    console.log("[Summarize API] ✓ PDF parsed, text length:", parsed.text.length, "pages:", parsed.numPages)

    // 生成摘要
    console.log("[Summarize API] Step 7: Generating summary with AI...")
    const summaryStartTime = Date.now()
    const summaryText = await generateSummaryForLongDocument(
      parsed.text,
      model || "openai/gpt-4o-mini"
    )
    const summaryDuration = Date.now() - summaryStartTime
    console.log("[Summarize API] ✓ Summary generated in", summaryDuration, "ms, length:", summaryText.length)

    // Save summary result
    console.log("[Summarize API] Step 8: Saving summary...")
    const summaryData = {
      fileId,
      summary: summaryText,
      metadata: parsed.metadata,
      numPages: parsed.numPages,
      createdAt: new Date().toISOString(),
    }

    await saveSummary(fileId, summaryData)
    console.log("[Summarize API] ✓ Summary saved")

    // Record usage
    console.log("[Summarize API] Step 9: Recording usage...")
    await recordUsage(user.id, "summary", fileId)
    console.log("[Summarize API] ✓ Usage recorded")

    const totalDuration = Date.now() - startTime
    console.log("[Summarize API] ✓ Request completed successfully in", totalDuration, "ms")

    return NextResponse.json(summaryData)
  } catch (error) {
    const totalDuration = Date.now() - startTime
    console.error("[Summarize API] ✗ Error after", totalDuration, "ms:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Handle authentication errors
    if (errorMessage === "Unauthorized" || errorMessage === "User not found") {
      return NextResponse.json({ error: errorMessage }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: `Summary generation failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
