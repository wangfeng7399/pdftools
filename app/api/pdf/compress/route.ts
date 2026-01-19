import { NextRequest, NextResponse } from "next/server"
import { compressPDF } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const compressedPdf = await compressPDF(buffer)

    return new NextResponse(compressedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF compress error:", error)
    return NextResponse.json(
      { error: `Compress failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
