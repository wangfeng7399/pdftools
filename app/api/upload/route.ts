import { NextRequest, NextResponse } from "next/server"
import { parsePDF } from "@/lib/pdf-parser"
import { savePDFFile, generateFileId } from "@/lib/storage"
import { getCurrentUser, checkFileSizeLimit } from "@/lib/usage-limits"
import { prisma } from "@/lib/db"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    // Check file size limit based on user's plan
    const sizeCheck = await checkFileSizeLimit(user.id, file.size)
    if (!sizeCheck.allowed) {
      return NextResponse.json(
        { 
          error: sizeCheck.message || "File size exceeds your plan limit",
          maxSize: sizeCheck.maxSize,
        },
        { status: 400 }
      )
    }

    // 读取文件
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 验证PDF是否有效
    try {
      const parsed = await parsePDF(buffer)
      
      // Generate file ID
      const fileId = generateFileId()
      
      // Save file
      await savePDFFile(fileId, buffer)

      // Record file in database
      await prisma.file.create({
        data: {
          userId: user.id,
          fileId,
          fileName: file.name,
          fileSize: file.size,
          numPages: parsed.numPages,
        },
      })

      // 确保返回的数据是完全可序列化的（强制转换为基本类型）
      const responseData = {
        fileId: String(fileId),
        fileName: String(file.name),
        fileSize: Number(file.size),
        numPages: Number(parsed.numPages),
        metadata: {
          title: parsed.metadata?.title || undefined,
          author: parsed.metadata?.author || undefined,
          pages: Number(parsed.metadata?.pages || parsed.numPages || 0),
        },
      }

      return NextResponse.json(responseData)
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid or corrupted PDF file: ${error instanceof Error ? error.message : "Unknown error"}` },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("File upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Handle authentication errors
    if (errorMessage === "Unauthorized" || errorMessage === "User not found") {
      return NextResponse.json(
        { 
          error: "Please sign in to upload files",
          requiresAuth: true 
        }, 
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
