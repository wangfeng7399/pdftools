import { NextRequest, NextResponse } from "next/server"
import { imageToPDF } from "@/lib/pdf-converter"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Please upload image files" }, { status: 400 })
    }

    const imageBuffers: Buffer[] = []
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "All files must be image format" }, { status: 400 })
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      imageBuffers.push(buffer)
    }

    const pdf = await imageToPDF(imageBuffers)

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    })
  } catch (error) {
    console.error("Image to PDF error:", error)
    return NextResponse.json(
      { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
