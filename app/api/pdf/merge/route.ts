import { NextRequest, NextResponse } from "next/server"
import { mergePDFs } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "At least 2 PDF files are required" }, { status: 400 })
    }

    const pdfBuffers: Buffer[] = []
    for (const file of files) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "All files must be PDF format" }, { status: 400 })
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      pdfBuffers.push(buffer)
    }

    const mergedPdf = await mergePDFs(pdfBuffers)

    return new NextResponse(mergedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF merge error:", error)
    return NextResponse.json(
      { error: `Merge failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
