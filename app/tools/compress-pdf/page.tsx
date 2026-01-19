"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null)
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

  const handleCompress = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/compress", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Compression failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "compressed.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("PDF compressed successfully!")
    } catch (error) {
      console.error("Compression error:", error)
      toast.error(error instanceof Error ? error.message : "Compression failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Compress PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Compress PDF file size to reduce file volume
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
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleCompress}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Compress PDF
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
