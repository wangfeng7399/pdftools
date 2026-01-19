import { writeFile, readFile, unlink, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "uploads")
const SUMMARY_DIR = join(process.cwd(), "summaries")

// 确保目录存在
export async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
  if (!existsSync(SUMMARY_DIR)) {
    await mkdir(SUMMARY_DIR, { recursive: true })
  }
}

/**
 * 保存上传的PDF文件
 */
export async function savePDFFile(fileId: string, buffer: Buffer): Promise<string> {
  await ensureDirectories()
  const filePath = join(UPLOAD_DIR, `${fileId}.pdf`)
  await writeFile(filePath, buffer)
  return filePath
}

/**
 * 读取PDF文件
 */
export async function readPDFFile(fileId: string): Promise<Buffer> {
  const filePath = join(UPLOAD_DIR, `${fileId}.pdf`)
  return readFile(filePath)
}

/**
 * 保存摘要结果
 */
export async function saveSummary(fileId: string, summary: any): Promise<string> {
  console.log("[Storage] saveSummary called for fileId:", fileId)
  try {
    await ensureDirectories()
    const filePath = join(SUMMARY_DIR, `${fileId}.json`)
    console.log("[Storage] Saving summary to:", filePath)
    const content = JSON.stringify(summary, null, 2)
    console.log("[Storage] Summary content length:", content.length, "characters")
    await writeFile(filePath, content)
    console.log("[Storage] ✓ Summary saved successfully to:", filePath)
    return filePath
  } catch (error) {
    console.error("[Storage] ✗ Failed to save summary:", error)
    throw error
  }
}

/**
 * 读取摘要结果
 */
export async function readSummary(fileId: string): Promise<any> {
  const filePath = join(SUMMARY_DIR, `${fileId}.json`)
  console.log("[Storage] readSummary called for fileId:", fileId, "path:", filePath)
  
  // 检查文件是否存在
  if (!existsSync(filePath)) {
    console.log("[Storage] ✗ Summary file does not exist:", filePath)
    throw new Error(`Summary file not found: ${fileId}`)
  }
  
  try {
    const content = await readFile(filePath, "utf-8")
    console.log("[Storage] ✓ Summary read successfully, size:", content.length, "characters")
    return JSON.parse(content)
  } catch (error) {
    console.error("[Storage] ✗ Failed to read summary:", error)
    throw error
  }
}

/**
 * 删除文件
 */
export async function deleteFile(fileId: string, type: "pdf" | "summary" = "pdf"): Promise<void> {
  const dir = type === "pdf" ? UPLOAD_DIR : SUMMARY_DIR
  const ext = type === "pdf" ? ".pdf" : ".json"
  const filePath = join(dir, `${fileId}${ext}`)
  
  try {
    await unlink(filePath)
  } catch (error) {
    // 文件不存在时忽略错误
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error
    }
  }
}

/**
 * 删除PDF文件
 */
export async function deletePDFFile(fileId: string): Promise<void> {
  return deleteFile(fileId, "pdf")
}

/**
 * 删除摘要文件
 */
export async function deleteSummary(fileId: string): Promise<void> {
  return deleteFile(fileId, "summary")
}

/**
 * 生成唯一文件ID
 */
export function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}
