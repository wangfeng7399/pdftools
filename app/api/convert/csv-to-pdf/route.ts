import { NextRequest, NextResponse } from "next/server"
import { csvToPDF } from "@/lib/document-converter"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Please upload a CSV file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = await csvToPDF(buffer)

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    })
  } catch (error) {
    console.error("CSV to PDF error:", error)
    return NextResponse.json(
      { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
