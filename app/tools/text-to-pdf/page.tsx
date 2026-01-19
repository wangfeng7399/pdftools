"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

export default function TextToPDFPage() {
  const [text, setText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleConvert = async () => {
    if (!text.trim()) {
      toast.error("Please enter text content")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/convert/text-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Conversion failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "text.pdf"
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Conversion successful!")
    } catch (error) {
      console.error("Conversion error:", error)
      toast.error(error instanceof Error ? error.message : "Conversion failed")
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
            <h1 className="text-3xl font-bold mb-2 text-center">Text to PDF</h1>
            <p className="text-muted-foreground mb-6 text-center">
              Enter text content and convert it to a PDF file
            </p>

            <div className="space-y-4">
              <div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text content to convert..."
                  className="min-h-[300px]"
                  disabled={isProcessing}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Character count: {text.length}
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <Button
                onClick={handleConvert}
                disabled={!text.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to PDF
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
