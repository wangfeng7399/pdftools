import { NextRequest, NextResponse } from "next/server"
import { readSummary } from "@/lib/storage"

export const runtime = "nodejs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId parameter" }, { status: 400 })
    }

    // Read summary
    const summary = await readSummary(fileId)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Summary read error:", error)
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Summary not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: `Failed to read summary: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
