import { NextRequest, NextResponse } from "next/server"
import { cleanupExpiredFiles } from "@/lib/file-cleanup"

export const runtime = "nodejs"
export const maxDuration = 300 // 5 minutes for cleanup

/**
 * API endpoint for cleaning up expired files
 * This can be called by a cron job or scheduled task
 * 
 * For production, set up a cron job to call this endpoint:
 * - Vercel Cron: https://vercel.com/docs/cron-jobs
 * - Or use a service like cron-job.org to call this endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check here
    // const authHeader = request.headers.get("authorization")
    // if (authHeader !== `Bearer ${process.env.CLEANUP_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const result = await cleanupExpiredFiles()

    return NextResponse.json({
      success: true,
      deletedFiles: result.deletedFiles,
      deletedSummaries: result.deletedSummaries,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check cleanup stats without running cleanup
 */
export async function GET(request: NextRequest) {
  try {
    const { getCleanupStats } = await import("@/lib/file-cleanup")
    const stats = await getCleanupStats()

    return NextResponse.json({
      stats,
      expiryHours: 24,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
