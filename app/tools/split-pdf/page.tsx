"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [ranges, setRanges] = useState("")
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

  const handleSplit = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    if (!ranges.trim()) {
      toast.error("Please enter page ranges, e.g., [[0,2],[3,5]] for pages 1-3 and 4-6")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      let pageRanges: number[][]
      try {
        pageRanges = JSON.parse(ranges)
      } catch {
        throw new Error("Invalid page range format, please use JSON format, e.g., [[0,2],[3,5]]")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("ranges", JSON.stringify(pageRanges))

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Split failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "split.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("PDF split successfully!")
    } catch (error) {
      console.error("Split error:", error)
      toast.error(error instanceof Error ? error.message : "Split failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Split PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Split a PDF file into multiple files. Enter page ranges, e.g., [[0,2],[3,5]] for pages 1-3 and 4-6
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
                <label className="text-sm font-medium mb-2 block">Page Ranges (JSON format)</label>
                <Input
                  value={ranges}
                  onChange={(e) => setRanges(e.target.value)}
                  placeholder='e.g., [[0,2],[3,5]]'
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Page indices start from 0. [[0,2]] means pages 1-3, [[3,5]] means pages 4-6
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleSplit}
                disabled={!file || !ranges.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Splitting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Split PDF
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
