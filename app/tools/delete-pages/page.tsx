"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Loader2, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function DeletePagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageIndices, setPageIndices] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      toast.error("Please select a PDF file")
    }
  }

  const handleDelete = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    if (!pageIndices.trim()) {
      toast.error("Please enter the page indices to delete")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      let indices: number[]
      try {
        indices = JSON.parse(pageIndices)
        if (!Array.isArray(indices)) {
          throw new Error("Page indices must be an array")
        }
      } catch {
        throw new Error("Invalid page indices format, please use JSON array format, e.g., [0,1,2]")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("pageIndices", JSON.stringify(indices))

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/delete-pages", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Delete failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "edited.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Pages deleted successfully!")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error(error instanceof Error ? error.message : "Delete failed")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <Link href="/tools">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-center">Delete PDF Pages</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Delete specified pages from a PDF file
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                  disabled={isProcessing}
                />
                <label htmlFor="file-input">
                  <Button asChild variant="outline" className="w-full" disabled={isProcessing}>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {file ? file.name : "Select PDF File"}
                    </span>
                  </Button>
                </label>
              </div>

              <div>
                <Label htmlFor="page-indices" className="mb-2 block">
                  Page Indices to Delete
                </Label>
                <Input
                  id="page-indices"
                  value={pageIndices}
                  onChange={(e) => setPageIndices(e.target.value)}
                  placeholder='e.g., [0,1,2] to delete pages 1, 2, 3 (indices start from 0)'
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use JSON array format, e.g., [0,1,2] or [5,6,7]
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleDelete}
                disabled={!file || !pageIndices.trim() || isProcessing}
                className="w-full"
                size="lg"
                variant="destructive"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Pages
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
