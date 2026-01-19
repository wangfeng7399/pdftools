"use client"

import { Card } from "@/components/ui/card"
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
  Minimize2,
  Plus,
  FileEdit,
} from "lucide-react"
import Link from "next/link"

const tools = [
  {
    category: "PDF Editing",
    color: "bg-green-500/10 border-green-500/20",
    items: [
      { name: "Merge PDF", icon: Merge, href: "/tools/merge-pdf" },
      { name: "Split PDF", icon: Scissors, href: "/tools/split-pdf" },
      { name: "Compress PDF", icon: Minimize2, href: "/tools/compress-pdf" },
      { name: "Rotate PDF", icon: RotateCw, href: "/tools/rotate-pdf" },
      { name: "Crop PDF", icon: Crop, href: "/tools/crop-pdf" },
      { name: "Delete Pages", icon: Trash2, href: "/tools/delete-pages" },
      { name: "Extract Pages", icon: Download, href: "/tools/extract-pages" },
      { name: "Create PDF", icon: Plus, href: "/tools/create-pdf" },
    ],
  },
  {
    category: "Convert to PDF",
    color: "bg-purple-500/10 border-purple-500/20",
    items: [
      { name: "Image to PDF", icon: ImageIcon, href: "/tools/image-to-pdf" },
      { name: "Text to PDF", icon: Type, href: "/tools/text-to-pdf" },
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

export function ToolsSection() {
  return (
    <section id="tools" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">All PDF Tools</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive PDF processing tools for all your document needs
          </p>
        </div>

        <div className="space-y-12">
          {tools.map((category) => (
            <div key={category.category}>
              <h3 className="text-2xl font-semibold mb-6 text-center">{category.category}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((tool) => (
                  <Link key={tool.name} href={tool.href}>
                    <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${category.color} h-full`}>
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <tool.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-semibold">{tool.name}</h4>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tools">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              View All Tools
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
