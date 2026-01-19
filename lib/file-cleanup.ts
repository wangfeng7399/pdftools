import { prisma } from "@/lib/db"
import { deletePDFFile, deleteSummary } from "@/lib/storage"
import * as fs from "fs/promises"
import * as path from "path"
import { existsSync } from "fs"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")
const SUMMARIES_DIR = path.join(process.cwd(), "summaries")
const FILE_EXPIRY_HOURS = 24

/**
 * Delete files older than 24 hours
 */
export async function cleanupExpiredFiles(): Promise<{
  deletedFiles: number
  deletedSummaries: number
  errors: string[]
}> {
  const errors: string[] = []
  let deletedFiles = 0
  let deletedSummaries = 0

  try {
    // Find files older than 24 hours
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() - FILE_EXPIRY_HOURS)

    const expiredFiles = await prisma.file.findMany({
      where: {
        createdAt: {
          lt: expiryDate,
        },
      },
    })

    // Delete files and their summaries
    for (const file of expiredFiles) {
      try {
        // Delete physical files
        await deletePDFFile(file.fileId)
        await deleteSummary(file.fileId)

        // Delete database records
        await prisma.file.delete({
          where: { id: file.id },
        })

        // Delete related usage records
        await prisma.usage.deleteMany({
          where: { fileId: file.fileId },
        })

        deletedFiles++
      } catch (error) {
        const errorMsg = `Failed to delete file ${file.fileId}: ${error instanceof Error ? error.message : "Unknown error"}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    // Also clean up orphaned summary files
    try {
      if (!existsSync(SUMMARIES_DIR)) {
        return { deletedFiles, deletedSummaries, errors }
      }
      const summaryFiles = await fs.readdir(SUMMARIES_DIR).catch(() => [])
      for (const summaryFile of summaryFiles) {
        const fileId = summaryFile.replace(".json", "")
        const filePath = path.join(SUMMARIES_DIR, summaryFile)

        try {
          const stats = await fs.stat(filePath)
          const fileAge = Date.now() - stats.mtimeMs
          const fileAgeHours = fileAge / (1000 * 60 * 60)

          // Delete if older than 24 hours
          if (fileAgeHours > FILE_EXPIRY_HOURS) {
            await fs.unlink(filePath)
            deletedSummaries++
          }
        } catch (error) {
          // Ignore errors for individual files
        }
      }
    } catch (error) {
      // Ignore if summaries directory doesn't exist
    }

    // Clean up orphaned upload files
    try {
      if (!existsSync(UPLOADS_DIR)) {
        return { deletedFiles, deletedSummaries, errors }
      }
      const uploadFiles = await fs.readdir(UPLOADS_DIR).catch(() => [])
      for (const uploadFile of uploadFiles) {
        const filePath = path.join(UPLOADS_DIR, uploadFile)

        try {
          const stats = await fs.stat(filePath)
          const fileAge = Date.now() - stats.mtimeMs
          const fileAgeHours = fileAge / (1000 * 60 * 60)

          // Check if file exists in database
          const fileInDb = await prisma.file.findFirst({
            where: { fileId: uploadFile },
          })

          // Delete if older than 24 hours or not in database
          if ((fileAgeHours > FILE_EXPIRY_HOURS) || !fileInDb) {
            await fs.unlink(filePath)
            deletedFiles++
          }
        } catch (error) {
          // Ignore errors for individual files
        }
      }
    } catch (error) {
      // Ignore if uploads directory doesn't exist
    }

    return {
      deletedFiles,
      deletedSummaries,
      errors,
    }
  } catch (error) {
    const errorMsg = `Cleanup failed: ${error instanceof Error ? error.message : "Unknown error"}`
    errors.push(errorMsg)
    console.error(errorMsg)
    return {
      deletedFiles,
      deletedSummaries,
      errors,
    }
  }
}

/**
 * Get statistics about files that will be deleted
 */
export async function getCleanupStats(): Promise<{
  filesToDelete: number
  oldestFileDate: Date | null
}> {
  try {
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() - FILE_EXPIRY_HOURS)

    const expiredFiles = await prisma.file.findMany({
      where: {
        createdAt: {
          lt: expiryDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 1,
    })

    return {
      filesToDelete: expiredFiles.length,
      oldestFileDate: expiredFiles[0]?.createdAt || null,
    }
  } catch (error) {
    console.error("Failed to get cleanup stats:", error)
    return {
      filesToDelete: 0,
      oldestFileDate: null,
    }
  }
}
