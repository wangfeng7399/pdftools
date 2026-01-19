"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Loader2, Download, Plus } from "lucide-react"
import { toast } from "sonner"

export default function CreatePDFPage() {
  const [width, setWidth] = useState("612")
  const [height, setHeight] = useState("792")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const presetSizes = [
    { name: "A4", width: 612, height: 792 },
    { name: "Letter", width: 612, height: 792 },
    { name: "Legal", width: 612, height: 1008 },
    { name: "A3", width: 842, height: 1191 },
    { name: "A5", width: 420, height: 595 },
  ]

  const handlePreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width.toString())
    setHeight(preset.height.toString())
  }

  const handleCreate = async () => {
    const w = parseFloat(width)
    const h = parseFloat(height)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      toast.error("Width and height must be valid numbers greater than 0")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/pdf/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ width: w, height: h }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Creation failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "new.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("PDF created successfully!")
    } catch (error) {
      console.error("Creation error:", error)
      toast.error(error instanceof Error ? error.message : "Creation failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Create PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Create a blank PDF file. Size unit is points (1 point = 1/72 inch)
            </p>

            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Preset Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {presetSizes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreset(preset)}
                      disabled={isProcessing}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (points)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (points)</Label>
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
                  <strong>Common Sizes:</strong>
                  <br />
                  A4: 612 × 792 points
                  <br />
                  Letter: 612 × 792 points
                  <br />
                  Legal: 612 × 1008 points
                  <br />
                  A3: 842 × 1191 points
                  <br />
                  A5: 420 × 595 points
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleCreate}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create PDF
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
