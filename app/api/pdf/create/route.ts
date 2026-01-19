import { NextRequest, NextResponse } from "next/server"
import { createPDF } from "@/lib/pdf-editor"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { width = 612, height = 792 } = await request.json()

    const pdf = await createPDF(width, height)

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="new.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF create error:", error)
    return NextResponse.json(
      { error: `Create failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
