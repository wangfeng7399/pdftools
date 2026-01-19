import { PDFDocument } from "pdf-lib"
import mammoth from "mammoth"
import * as XLSX from "xlsx"
import PptxGenJS from "pptxgenjs"
import jsPDF from "jspdf"
import sharp from "sharp"

/**
 * Word/DOCX转PDF
 */
export async function wordToPDF(docxBuffer: Buffer): Promise<Buffer> {
  // 将DOCX转换为HTML
  const result = await mammoth.convertToHtml({ buffer: docxBuffer })
  const html = result.value

  // HTML转PDF（使用html2canvas + jsPDF）
  // 注意：这需要浏览器环境，在Node.js中需要使用puppeteer
  throw new Error("Word转PDF功能需要在浏览器环境或使用puppeteer")
}

/**
 * Excel转PDF
 */
export async function excelToPDF(excelBuffer: Buffer): Promise<Buffer> {
  // 读取Excel文件
  const workbook = XLSX.read(excelBuffer, { type: "buffer" })
  const pdf = await PDFDocument.create()

  // 遍历每个工作表
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    // 创建PDF页面
    const page = pdf.addPage([612, 792])
    const { width, height } = page.getSize()

    // 简单文本渲染（实际应该使用表格库）
    let y = height - 50
    const fontSize = 10
    const lineHeight = 15

    for (const row of data.slice(0, 40)) {
      // 限制行数
      if (y < 50) break
      const text = row.map((cell) => String(cell || "")).join(" | ")
      page.drawText(text.substring(0, 80), {
        x: 50,
        y: y,
        size: fontSize,
      })
      y -= lineHeight
    }
  }

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * PPTX转PDF
 */
export async function pptxToPDF(pptxBuffer: Buffer): Promise<Buffer> {
  // pptxgenjs主要用于创建PPTX，读取需要其他库
  // 这里提供一个基础框架
  throw new Error("PPTX转PDF功能需要使用专门的转换库或服务")
}

/**
 * HTML转PDF
 */
export async function htmlToPDF(html: string): Promise<Buffer> {
  // 在Node.js环境中，需要使用puppeteer
  throw new Error("HTML转PDF功能需要使用puppeteer")
}

/**
 * CSV转PDF
 */
export async function csvToPDF(csvBuffer: Buffer): Promise<Buffer> {
  // 读取CSV
  const csvText = csvBuffer.toString("utf-8")
  const lines = csvText.split("\n").filter((line) => line.trim())

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([612, 792])
  const { width, height } = page.getSize()

  let y = height - 50
  const fontSize = 10
  const lineHeight = 15

  for (const line of lines.slice(0, 40)) {
    if (y < 50) break
    page.drawText(line.substring(0, 80), {
      x: 50,
      y: y,
      size: fontSize,
    })
    y -= lineHeight
  }

  const pdfBytes = await pdf.save()
  return Buffer.from(pdfBytes)
}

/**
 * CSV转Excel
 */
export async function csvToExcel(csvBuffer: Buffer): Promise<Buffer> {
  const csvText = csvBuffer.toString("utf-8")
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(
    csvText.split("\n").map((line) => line.split(","))
  )
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
  return Buffer.from(excelBuffer)
}
