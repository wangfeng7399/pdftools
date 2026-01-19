"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, MessageSquare, Download, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { ChatInterface } from "@/components/chat-interface"

interface SummaryData {
  fileId: string
  summary: string
  metadata: {
    title?: string
    author?: string
    pages: number
  }
  numPages: number
  createdAt: string
}

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = params.fileId as string

  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  useEffect(() => {
    loadSummary()
  }, [fileId])

  const loadSummary = async () => {
    try {
      const response = await fetch(`/api/summary/${fileId}`)
      
      if (response.status === 404) {
        // Summary doesn't exist, need to generate
        setIsGenerating(true)
        await generateSummary()
        return
      }

      if (!response.ok) {
        throw new Error("Failed to load summary")
      }

      const data = await response.json()
      setSummaryData(data)
    } catch (error) {
      console.error("Load summary error:", error)
      toast.error("Failed to load summary, generating...")
      setIsGenerating(true)
      await generateSummary()
    } finally {
      setIsLoading(false)
    }
  }

  const generateSummary = async () => {
    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 5, 95))
      }, 500)

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId }),
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (!response.ok) {
        const error = await response.json()
        // If it's a limit error, show upgrade message
        if (error.upgradeRequired) {
          toast.error(error.error || "Summary limit reached", {
            description: `You've used ${error.used} of ${error.limit} free summaries.`,
            action: {
              label: "Upgrade",
              onClick: () => router.push("/pricing"),
            },
          })
          // Redirect to home after a delay
          setTimeout(() => {
            router.push("/")
          }, 3000)
          return
        }
        throw new Error(error.error || "Summary generation failed")
      }

      const data = await response.json()
      setSummaryData(data)
      toast.success("Summary generated successfully!")
    } catch (error) {
      console.error("Summary generation error:", error)
      toast.error(error instanceof Error ? error.message : "Summary generation failed")
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!summaryData) return

    const content = `PDF Summary\n\nFile ID: ${summaryData.fileId}\nGenerated at: ${new Date(summaryData.createdAt).toLocaleString("en-US")}\n\n${summaryData.summary}`
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `summary-${fileId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {isGenerating ? "Generating summary..." : "Loading..."}
              </h2>
              {isGenerating && (
                <div className="mt-4 w-full">
                  <Progress value={generationProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{generationProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Failed to load summary</h2>
            <Button onClick={() => router.push("/")} className="mt-4">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container py-8 mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto w-full">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">PDF Summary</h1>
                <div className="text-sm text-muted-foreground space-y-1">
                  {summaryData.metadata.title && (
                    <p>Title: {summaryData.metadata.title}</p>
                  )}
                  {summaryData.metadata.author && (
                    <p>Author: {summaryData.metadata.author}</p>
                  )}
                  <p>Pages: {summaryData.numPages}</p>
                  <p>Generated at: {new Date(summaryData.createdAt).toLocaleString("en-US")}</p>
                </div>
              </div>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Summary
              </Button>
            </div>
          </Card>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">
                <FileText className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <Card className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-foreground break-words overflow-wrap-anywhere">
                    {summaryData.summary}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <ChatInterface fileId={fileId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
