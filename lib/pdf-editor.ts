import { PDFDocument } from "pdf-lib"
import fs from "fs/promises"

/**
 * 合并多个PDF文件
 */
export async function mergePDFs(pdfBuffers: Buffer[]): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create()

  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => mergedPdf.addPage(page))
  }

  const pdfBytes = await mergedPdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 拆分PDF文件
 */
export async function splitPDF(pdfBuffer: Buffer, pageRanges: number[][]): Promise<Buffer[]> {
  const sourcePdf = await PDFDocument.load(pdfBuffer)
  const results: Buffer[] = []

  for (const range of pageRanges) {
    const [start, end] = range
    const newPdf = await PDFDocument.create()
    const pages = await newPdf.copyPages(sourcePdf, Array.from({ length: end - start + 1 }, (_, i) => start + i))
    pages.forEach((page) => newPdf.addPage(page))
    const pdfBytes = await newPdf.save()
    results.push(Buffer.from(pdfBytes))
  }

  return results
}

/**
 * 旋转PDF页面
 */
export async function rotatePDF(pdfBuffer: Buffer, pageIndices: number[], angle: 90 | 180 | 270): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer)
  const pages = pdf.getPages()

  pageIndices.forEach((index) => {
    if (pages[index]) {
      pages[index].setRotation(pages[index].getRotation().angle + angle)
    }
  })

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 裁剪PDF页面
 */
export async function cropPDF(
  pdfBuffer: Buffer,
  pageIndex: number,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer)
  const page = pdf.getPage(pageIndex)

  page.setCropBox(x, y, width, height)

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 删除PDF页面
 */
export async function deletePDFPages(pdfBuffer: Buffer, pageIndices: number[]): Promise<Buffer> {
  const pdf = await PDFDocument.load(pdfBuffer)
  const totalPages = pdf.getPageCount()

  // 从后往前删除，避免索引变化
  const sortedIndices = [...pageIndices].sort((a, b) => b - a)

  for (const index of sortedIndices) {
    if (index >= 0 && index < totalPages) {
      pdf.removePage(index)
    }
  }

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 提取PDF页面
 */
export async function extractPDFPages(pdfBuffer: Buffer, pageIndices: number[]): Promise<Buffer> {
  const sourcePdf = await PDFDocument.load(pdfBuffer)
  const newPdf = await PDFDocument.create()

  const pages = await newPdf.copyPages(sourcePdf, pageIndices)
  pages.forEach((page) => newPdf.addPage(page))

  const pdfBytes = await newPdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 重新组织PDF页面顺序
 */
export async function organizePDF(pdfBuffer: Buffer, newPageOrder: number[]): Promise<Buffer> {
  const sourcePdf = await PDFDocument.load(pdfBuffer)
  const newPdf = await PDFDocument.create()

  const pages = await newPdf.copyPages(sourcePdf, newPageOrder)
  pages.forEach((page) => newPdf.addPage(page))

  const pdfBytes = await newPdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * 为PDF添加密码保护
 */
export async function passwordProtectPDF(
  pdfBuffer: Buffer,
  userPassword: string,
  ownerPassword?: string
): Promise<Buffer> {
  // pdf-lib 不直接支持密码保护，需要使用其他方法
  // 这里返回原PDF，实际实现可能需要使用其他库如pdf-lib + 加密
  // 或者使用命令行工具如pdftk
  throw new Error("密码保护功能需要使用额外的加密库，暂未实现")
}

/**
 * 压缩PDF（通过优化）
 */
export async function compressPDF(pdfBuffer: Buffer): Promise<Buffer> {
  // pdf-lib 不直接支持压缩，但可以通过优化来减少大小
  const pdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true })
  
  // 重新保存可以移除一些冗余数据
  const pdfBytes = await pdf.save({ useObjectStreams: false })
  return Buffer.from(pdfBytes)
}

/**
 * 创建空白PDF
 */
export async function createPDF(width: number = 612, height: number = 792): Promise<Buffer> {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([width, height])
  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}
