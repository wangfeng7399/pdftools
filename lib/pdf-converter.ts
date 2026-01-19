import { PDFDocument, rgb } from "pdf-lib"
import sharp from "sharp"
import jsPDF from "jspdf"

/**
 * PDF转图片（JPG/PNG）
 */
export async function pdfToImage(pdfBuffer: Buffer, format: "jpg" | "png" = "jpg"): Promise<Buffer[]> {
  // 注意：pdf-lib 不能直接渲染PDF为图片
  // 需要使用 pdf2pic 或 pdf-poppler
  // 这里提供一个基础实现框架
  throw new Error("PDF转图片功能需要使用 pdf2pic 或 pdf-poppler，需要系统安装 poppler")
}

/**
 * 图片转PDF
 */
export async function imageToPDF(imageBuffers: Buffer[], format: "jpg" | "png" = "jpg"): Promise<Buffer> {
  const pdf = await PDFDocument.create()

  for (const imageBuffer of imageBuffers) {
    // 使用sharp获取图片尺寸
    const metadata = await sharp(imageBuffer).metadata()
    const width = metadata.width || 612
    const height = metadata.height || 792

    // 转换图片格式为PNG（pdf-lib需要）
    const pngBuffer = format === "png" ? imageBuffer : await sharp(imageBuffer).png().toBuffer()

    // 添加到PDF
    const image = await pdf.embedPng(pngBuffer)
    const page = pdf.addPage([width, height])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
  }

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * JPG转PDF
 */
export async function jpgToPDF(jpgBuffers: Buffer[]): Promise<Buffer> {
  return imageToPDF(jpgBuffers, "jpg")
}

/**
 * PNG转PDF
 */
export async function pngToPDF(pngBuffers: Buffer[]): Promise<Buffer> {
  return imageToPDF(pngBuffers, "png")
}

/**
 * 文本转PDF
 */
export async function textToPDF(text: string, options?: { fontSize?: number; fontFamily?: string }): Promise<Buffer> {
  const { fontSize = 12, fontFamily = "helvetica" } = options || {}
  const doc = new jsPDF()

  // 设置字体
  doc.setFont(fontFamily as any)

  // 分割文本为多行
  const lines = doc.splitTextToSize(text, 180) // 180mm宽度

  // 添加文本
  let y = 20
  const lineHeight = fontSize * 0.5

  for (const line of lines) {
    if (y > 280) {
      // 添加新页
      doc.addPage()
      y = 20
    }
    doc.text(line, 15, y)
    y += lineHeight
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
  return pdfBuffer
}

/**
 * PDF转文本（已存在，这里导出）
 */
export { parsePDF } from "./pdf-parser"
