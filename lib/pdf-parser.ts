import { PDFParse } from "pdf-parse"

export interface PDFMetadata {
  title?: string
  author?: string
  pages: number
}

export interface ParsedPDF {
  text: string
  metadata: PDFMetadata
  numPages: number
}

/**
 * 解析PDF文件，提取文本内容和元数据
 * 使用最保守的方法，确保100%可序列化
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  // 在服务器端设置 worker
  if (typeof window === "undefined") {
    try {
      PDFParse.setWorker("./pdf.worker.mjs")
    } catch {
      // 忽略
    }
  }
  
  let pdfParse: PDFParse | null = null
  
  try {
    const data = buffer instanceof Buffer ? buffer : Buffer.from(buffer)
    pdfParse = new PDFParse({ data })
    
    // 只提取文本，不提取元数据（减少出错可能）
    let text = ""
    let numPages = 0
    
    try {
      const textResult = await pdfParse.getText()
      
      // 只提取基本类型
      if (textResult && typeof textResult === "object") {
        text = typeof textResult.text === "string" ? textResult.text : ""
        numPages = typeof textResult.total === "number" ? textResult.total : 0
      } else if (typeof textResult === "string") {
        text = textResult
      }
    } catch (error) {
      console.error("getText failed:", error)
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : "Unknown"}`)
    }

    // 清理资源
    await pdfParse.destroy()
    pdfParse = null

    // 构建最简化的返回对象（只包含基本类型）
    const result: ParsedPDF = {
      text: String(text || ""),
      metadata: {
        title: undefined,
        author: undefined,
        pages: Number(numPages) || 0,
      },
      numPages: Number(numPages) || 0,
    }
    
    return result
  } catch (error) {
    // 清理资源
    if (pdfParse) {
      try {
        await pdfParse.destroy()
      } catch {
        // 忽略
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`PDF parsing failed: ${errorMessage}`)
  }
}

/**
 * 将PDF文本分块，用于处理长文档
 */
export function chunkText(text: string, maxChunkSize: number = 8000): string[] {
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  
  let currentChunk = ""
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}
