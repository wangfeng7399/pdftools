"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Sparkles, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function HeroSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = async (file: File) => {
    // 验证文件类型
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported")
      return
    }

    // 验证文件大小（50MB）
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("File size cannot exceed 50MB")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        
        // If it's an authentication error, redirect to login
        if (response.status === 401 || error.error === "Unauthorized") {
          toast.error("Please sign in to upload files", {
            action: {
              label: "Sign In",
              onClick: () => router.push("/auth/signin"),
            },
          })
          router.push("/auth/signin?callbackUrl=/")
          return
        }
        
        // If it's a file size limit error, show upgrade message
        if (error.maxSize) {
          const maxSizeMB = Math.round(error.maxSize / 1024 / 1024)
          toast.error(error.error || `File size exceeds ${maxSizeMB}MB limit. Please upgrade your plan.`, {
            action: {
              label: "Upgrade",
              onClick: () => router.push("/pricing"),
            },
          })
          return
        }
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      
      // 跳转到摘要页面
      router.push(`/summary/${data.fileId}`)
      
      toast.success("File uploaded successfully, generating summary...")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Upload failed, please try again")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="container relative py-20 md:py-28 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-balance">AI-Powered PDF Analysis</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-balance">
            Summarize Any PDF in <span className="text-primary">Seconds</span>
          </h1>

          <p className="mb-12 text-lg text-muted-foreground sm:text-xl text-balance max-w-2xl mx-auto">
            Let our advanced AI handle the heavy reading. Extract key insights, generate summaries, and chat with your
            documents instantly.
          </p>

          {/* Upload Card */}
          <Card
            className={`mx-auto max-w-2xl p-8 transition-all cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : ""
            } ${isUploading ? "opacity-75 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                {isUploading ? (
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-primary" />
                )}
              </div>

              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold">
                  {isUploading ? "Uploading..." : "Drop your PDF here"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isUploading ? "Please wait" : "or click to browse • Max file size: 50 MB"}
                </p>
              </div>

              {isUploading && (
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                </div>
              )}

              <Button size="lg" className="gap-2" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Upload Your File
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                By uploading, you agree to our Terms of Use and Privacy Policy
              </p>
            </div>
          </Card>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>★★★★★</span>
              <span>Trusted by 50,000+ users worldwide</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 opacity-50">
              <span className="text-sm font-semibold">GDPR Compliant</span>
              <span className="text-sm font-semibold">SSL Encrypted</span>
              <span className="text-sm font-semibold">SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
