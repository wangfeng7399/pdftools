import { NextRequest, NextResponse } from "next/server"
import { rotatePDF } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pageIndicesStr = formData.get("pageIndices") as string
    const angleStr = formData.get("angle") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    const pageIndices: number[] = pageIndicesStr ? JSON.parse(pageIndicesStr) : []
    const angle = parseInt(angleStr || "90") as 90 | 180 | 270

    if (![90, 180, 270].includes(angle)) {
      return NextResponse.json({ error: "Angle must be 90, 180, or 270" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const rotatedPdf = await rotatePDF(buffer, pageIndices, angle)

    return new NextResponse(rotatedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF rotate error:", error)
    return NextResponse.json(
      { error: `Rotate failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
