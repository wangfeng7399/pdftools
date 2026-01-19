import { NextRequest, NextResponse } from "next/server"
import { cropPDF } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const pageIndexStr = formData.get("pageIndex") as string
    const xStr = formData.get("x") as string
    const yStr = formData.get("y") as string
    const widthStr = formData.get("width") as string
    const heightStr = formData.get("height") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    const pageIndex = parseInt(pageIndexStr || "0")
    const x = parseFloat(xStr || "0")
    const y = parseFloat(yStr || "0")
    const width = parseFloat(widthStr || "612")
    const height = parseFloat(heightStr || "792")

    if (isNaN(pageIndex) || isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
      return NextResponse.json({ error: "All parameters must be valid numbers" }, { status: 400 })
    }

    if (width <= 0 || height <= 0) {
      return NextResponse.json({ error: "Width and height must be greater than 0" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const croppedPdf = await cropPDF(buffer, pageIndex, x, y, width, height)

    return new NextResponse(croppedPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cropped.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF crop error:", error)
    return NextResponse.json(
      { error: `Crop failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
