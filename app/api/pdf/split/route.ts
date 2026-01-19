import { NextRequest, NextResponse } from "next/server"
import { splitPDF } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const rangesStr = formData.get("ranges") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    if (!rangesStr) {
      return NextResponse.json({ error: "Please provide page ranges" }, { status: 400 })
    }

    const ranges: number[][] = JSON.parse(rangesStr)
    const buffer = Buffer.from(await file.arrayBuffer())

    const splitPdfs = await splitPDF(buffer, ranges)

    // 返回ZIP文件包含所有分割的PDF
    // 简化处理：返回第一个分割的PDF
    // 实际应该使用archiver创建ZIP
    return new NextResponse(splitPdfs[0], {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="split.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF split error:", error)
    return NextResponse.json(
      { error: `Split failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
