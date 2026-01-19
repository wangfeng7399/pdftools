import { NextRequest, NextResponse } from "next/server"
import { textToPDF } from "@/lib/pdf-converter"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { text, fontSize, fontFamily } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Please provide text content" }, { status: 400 })
    }

    const pdf = await textToPDF(text, { fontSize, fontFamily })

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="text.pdf"',
      },
    })
  } catch (error) {
    console.error("Text to PDF error:", error)
    return NextResponse.json(
      { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
