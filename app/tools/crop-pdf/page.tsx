"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileText, Loader2, Download, Crop } from "lucide-react"
import { toast } from "sonner"

export default function CropPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageIndex, setPageIndex] = useState("0")
  const [x, setX] = useState("0")
  const [y, setY] = useState("0")
  const [width, setWidth] = useState("612")
  const [height, setHeight] = useState("792")
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

  const handleCrop = async () => {
    if (!file) {
      toast.error("Please select a PDF file first")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const pageIdx = parseInt(pageIndex)
      const xVal = parseFloat(x)
      const yVal = parseFloat(y)
      const wVal = parseFloat(width)
      const hVal = parseFloat(height)

      if (isNaN(pageIdx) || isNaN(xVal) || isNaN(yVal) || isNaN(wVal) || isNaN(hVal)) {
        throw new Error("All parameters must be valid numbers")
      }

      if (wVal <= 0 || hVal <= 0) {
        throw new Error("Width and height must be greater than 0")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("pageIndex", pageIndex)
      formData.append("x", x)
      formData.append("y", y)
      formData.append("width", width)
      formData.append("height", height)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/crop", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Crop failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "cropped.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("PDF cropped successfully!")
    } catch (error) {
      console.error("Crop error:", error)
      toast.error(error instanceof Error ? error.message : "Crop failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Crop PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Crop a specific area of a PDF page. Coordinates start from top-left (0,0), unit is points (1 point = 1/72 inch)
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page-index">Page Index (starts from 0)</Label>
                  <Input
                    id="page-index"
                    type="number"
                    value={pageIndex}
                    onChange={(e) => setPageIndex(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="x">X Coordinate (left)</Label>
                  <Input
                    id="x"
                    type="number"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="y">Y Coordinate (top)</Label>
                  <Input
                    id="y"
                    type="number"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Standard A4 page size is 612×792 points. Coordinates start from top-left (0,0).
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleCrop}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cropping...
                  </>
                ) : (
                  <>
                    <Crop className="h-4 w-4 mr-2" />
                    Crop PDF
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
