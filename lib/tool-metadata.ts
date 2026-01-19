import type { Metadata } from "next"
import { siteUrl } from "@/lib/constants"

export const toolMetadataMap: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "merge-pdf": {
    title: "Merge PDF Files - Combine Multiple PDFs into One",
    description:
      "Merge multiple PDF files into a single document. Combine PDFs quickly and easily with our free online tool.",
    keywords: ["merge PDF", "combine PDF", "join PDF", "PDF merger", "merge PDF files"],
  },
  "split-pdf": {
    title: "Split PDF - Divide PDF into Multiple Files",
    description:
      "Split PDF documents into separate files by pages or ranges. Extract specific pages from your PDF easily.",
    keywords: ["split PDF", "divide PDF", "extract PDF pages", "PDF splitter", "separate PDF"],
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages - Rotate PDF Documents",
    description: "Rotate PDF pages 90, 180, or 270 degrees. Fix orientation issues in your PDF documents quickly.",
    keywords: ["rotate PDF", "PDF rotation", "flip PDF", "PDF orientation", "rotate PDF pages"],
  },
  "crop-pdf": {
    title: "Crop PDF - Trim PDF Pages",
    description: "Crop PDF pages to remove unwanted margins or focus on specific content areas. Precision cropping tool.",
    keywords: ["crop PDF", "trim PDF", "PDF cropping", "edit PDF margins", "PDF crop tool"],
  },
  "delete-pages": {
    title: "Delete PDF Pages - Remove Pages from PDF",
    description: "Delete unwanted pages from your PDF documents. Remove specific pages quickly and easily.",
    keywords: ["delete PDF pages", "remove PDF pages", "PDF page removal", "edit PDF pages"],
  },
  "extract-pages": {
    title: "Extract PDF Pages - Extract Pages from PDF",
    description: "Extract specific pages from PDF documents. Create new PDFs from selected pages.",
    keywords: ["extract PDF pages", "PDF extraction", "extract pages", "PDF page extractor"],
  },
  "compress-pdf": {
    title: "Compress PDF - Reduce PDF File Size",
    description:
      "Compress PDF files to reduce file size while maintaining quality. Optimize PDFs for sharing and storage.",
    keywords: ["compress PDF", "PDF compression", "reduce PDF size", "PDF optimizer", "shrink PDF"],
  },
  "create-pdf": {
    title: "Create PDF - Generate New PDF Documents",
    description: "Create new PDF documents from scratch. Generate PDFs with custom dimensions and content.",
    keywords: ["create PDF", "generate PDF", "new PDF", "PDF creator", "make PDF"],
  },
  "image-to-pdf": {
    title: "Image to PDF - Convert Images to PDF",
    description: "Convert images (JPG, PNG, etc.) to PDF format. Combine multiple images into a single PDF document.",
    keywords: ["image to PDF", "JPG to PDF", "PNG to PDF", "convert image PDF", "image PDF converter"],
  },
  "text-to-pdf": {
    title: "Text to PDF - Convert Text to PDF",
    description: "Convert plain text to PDF format. Create PDF documents from text content with customizable formatting.",
    keywords: ["text to PDF", "convert text PDF", "create PDF from text", "text PDF converter"],
  },
  "excel-to-pdf": {
    title: "Excel to PDF - Convert Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format. Preserve formatting and layout in your PDF documents.",
    keywords: ["Excel to PDF", "XLSX to PDF", "convert Excel PDF", "spreadsheet to PDF"],
  },
  "csv-to-pdf": {
    title: "CSV to PDF - Convert CSV to PDF",
    description: "Convert CSV files to PDF format. Transform your data files into professional PDF documents.",
    keywords: ["CSV to PDF", "convert CSV PDF", "CSV PDF converter", "data to PDF"],
  },
  "csv-to-excel": {
    title: "CSV to Excel - Convert CSV to Excel",
    description: "Convert CSV files to Excel format. Transform your data files into Excel spreadsheets.",
    keywords: ["CSV to Excel", "convert CSV XLSX", "CSV Excel converter", "data conversion"],
  },
}

export function getToolMetadata(toolName: string): Metadata {
  const metadata = toolMetadataMap[toolName] || {
    title: "PDF Tool - PDF Summarizer",
    description: "Powerful PDF processing tool for all your document needs.",
    keywords: ["PDF tool", "PDF processing"],
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${siteUrl}/tools/${toolName}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: `${siteUrl}/tools/${toolName}`,
    },
  }
}
