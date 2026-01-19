"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Merge,
  Scissors,
  RotateCw,
  Crop,
  Trash2,
  Download,
  Image as ImageIcon,
  Type,
  FileSpreadsheet,
  FileCode,
  Minimize2,
  Plus,
  Lock,
  FileEdit,
} from "lucide-react"
import Link from "next/link"

const tools = [
  {
    category: "Edit & Sign",
    color: "bg-green-500/10 border-green-500/20",
    items: [
      { name: "Edit PDF", icon: FileEdit, href: "/tools/edit-pdf" },
      { name: "Merge PDF", icon: Merge, href: "/tools/merge-pdf" },
      { name: "Split PDF", icon: Scissors, href: "/tools/split-pdf" },
      { name: "Compress PDF", icon: Minimize2, href: "/tools/compress-pdf" },
      { name: "Rotate PDF", icon: RotateCw, href: "/tools/rotate-pdf" },
      { name: "Crop PDF", icon: Crop, href: "/tools/crop-pdf" },
      { name: "Delete PDF Pages", icon: Trash2, href: "/tools/delete-pages" },
      { name: "Extract PDF Pages", icon: Download, href: "/tools/extract-pages" },
      { name: "Create PDF", icon: Plus, href: "/tools/create-pdf" },
      { name: "Password Protect PDF", icon: Lock, href: "/tools/password-protect" },
      { name: "PDF Summarizer", icon: FileText, href: "/" },
    ],
  },
  {
    category: "Convert from PDF",
    color: "bg-pink-500/10 border-pink-500/20",
    items: [
      { name: "PDF to Text", icon: Type, href: "/tools/pdf-to-text" },
      { name: "PDF to Image", icon: ImageIcon, href: "/tools/pdf-to-image" },
    ],
  },
  {
    category: "Convert to PDF",
    color: "bg-purple-500/10 border-purple-500/20",
    items: [
      { name: "Image to PDF", icon: ImageIcon, href: "/tools/image-to-pdf" },
      { name: "Text to PDF", icon: Type, href: "/tools/text-to-pdf" },
      { name: "Word to PDF", icon: FileText, href: "/tools/word-to-pdf" },
      { name: "Excel to PDF", icon: FileSpreadsheet, href: "/tools/excel-to-pdf" },
      { name: "CSV to PDF", icon: FileSpreadsheet, href: "/tools/csv-to-pdf" },
    ],
  },
  {
    category: "Other Formats",
    color: "bg-orange-500/10 border-orange-500/20",
    items: [
      { name: "CSV to Excel", icon: FileSpreadsheet, href: "/tools/csv-to-excel" },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">PDF Tools</h1>
          <p className="text-muted-foreground text-lg">
            Powerful PDF processing tools for all your needs
          </p>
        </div>

        <div className="space-y-8">
          {tools.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((tool) => (
                  <Link key={tool.name} href={tool.href}>
                    <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${category.color}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <tool.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tool.name}</h3>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
