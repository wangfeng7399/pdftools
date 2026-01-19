"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Loader2, Download, RotateCw } from "lucide-react"
import { toast } from "sonner"

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState<"90" | "180" | "270">("90")
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

  const handleRotate = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      let indices: number[] = []
      if (pageIndices.trim()) {
        try {
          indices = JSON.parse(pageIndices)
        } catch {
          throw new Error("页面索引格式错误，请使用JSON数组格式，例如：[0,1,2]")
        }
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("angle", angle)
      if (indices.length > 0) {
        formData.append("pageIndices", JSON.stringify(indices))
      }

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/rotate", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Rotation failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "rotated.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("PDF rotated successfully!")
    } catch (error) {
      console.error("Rotation error:", error)
      toast.error(error instanceof Error ? error.message : "Rotation failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Rotate PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Rotate PDF pages. You can rotate all pages or specific pages
            </p>

            <div className="space-y-6">
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
                <Label className="mb-3 block">Rotation Angle</Label>
                <RadioGroup value={angle} onValueChange={(v) => setAngle(v as "90" | "180" | "270")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="90" />
                    <Label htmlFor="90" className="cursor-pointer">
                      <RotateCw className="h-4 w-4 inline mr-2" />
                      90° (Clockwise)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="180" id="180" />
                    <Label htmlFor="180" className="cursor-pointer">180°</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="270" id="270" />
                    <Label htmlFor="270" className="cursor-pointer">
                      <RotateCw className="h-4 w-4 inline mr-2 rotate-180" />
                      270° (Counter-clockwise 90°)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="page-indices" className="mb-2 block">
                  Page Indices (Optional, leave empty to rotate all pages)
                </Label>
                <Input
                  id="page-indices"
                  value={pageIndices}
                  onChange={(e) => setPageIndices(e.target.value)}
                  placeholder='e.g., [0,1,2] for pages 1, 2, 3 (indices start from 0)'
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave empty to rotate all pages. Use JSON array format, e.g., [0,1,2]
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleRotate}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rotating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Rotate PDF
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
