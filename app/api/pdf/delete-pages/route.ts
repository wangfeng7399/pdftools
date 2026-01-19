import { NextRequest, NextResponse } from "next/server"
import { deletePDFPages } from "@/lib/pdf-editor"

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
      return NextResponse.json({ error: "Please provide page indices to delete" }, { status: 400 })
    }

    const pageIndices: number[] = JSON.parse(pageIndicesStr)
    const buffer = Buffer.from(await file.arrayBuffer())

    const resultPdf = await deletePDFPages(buffer, pageIndices)

    return new NextResponse(resultPdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="edited.pdf"',
      },
    })
  } catch (error) {
    console.error("Delete pages error:", error)
    return NextResponse.json(
      { error: `Delete failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
