import { NextRequest, NextResponse } from "next/server"
import { csvToExcel } from "@/lib/document-converter"

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
    const excel = await csvToExcel(buffer)

    return new NextResponse(excel, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="converted.xlsx"',
      },
    })
  } catch (error) {
    console.error("CSV to Excel error:", error)
    return NextResponse.json(
      { error: `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
