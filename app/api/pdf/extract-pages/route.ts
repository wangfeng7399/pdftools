import { NextRequest, NextResponse } from "next/server"
import { extractPDFPages } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pageIndicesStr = formData.get("pageIndices") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    if (!pageIndicesStr) {
      return NextResponse.json({ error: "Please provide page indices to extract" }, { status: 400 })
    }

    const pageIndices: number[] = JSON.parse(pageIndicesStr)
    const buffer = Buffer.from(await file.arrayBuffer())

    const extractedPdf = await extractPDFPages(buffer, pageIndices)

    return new NextResponse(extractedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="extracted.pdf"',
      },
    })
  } catch (error) {
    console.error("Extract pages error:", error)
    return NextResponse.json(
      { error: `Extract failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
