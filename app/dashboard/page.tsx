"use client"

import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, MessageSquare, CreditCard, Settings, History, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodEnd: string | null
}

interface UserFile {
  id: string
  fileId: string
  fileName: string
  fileSize: number
  numPages: number | null
  createdAt: string
}

interface UsageRecord {
  id: string
  type: string
  fileId: string | null
  createdAt: string
}

interface UserHistory {
  files: UserFile[]
  usage: {
    summaries: number
    chats: number
    total: number
  }
  recentUsage: UsageRecord[]
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useSupabase()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [history, setHistory] = useState<UserHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
      return
    }

    if (user) {
      // Fetch user subscription and history
      Promise.all([fetchSubscription(), fetchHistory()])
    }
  }, [authLoading, user, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/user/files")
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const plan = subscription?.plan || "free"
  const isActive = subscription?.status === "active"

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Subscription Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </p>
              </div>
            </div>
            {isActive && subscription?.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground mb-4">
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {!isActive && (
              <Button asChild className="w-full mt-4">
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload PDF
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/tools">
                  <Settings className="h-4 w-4 mr-2" />
                  PDF Tools
                </Link>
              </Button>
            </div>
          </Card>

          {/* Usage Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-medium">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{subscription?.status || "free"}</span>
              </div>
              {history && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Summaries</span>
                    <span className="font-medium">{history.usage.summaries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Chat Messages</span>
                    <span className="font-medium">{history.usage.chats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Files</span>
                    <span className="font-medium">{history.files.length}</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* File History Section */}
        {history && history.files.length > 0 && (
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Recent Files</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your uploaded PDF files (showing last {history.files.length > 6 ? "6" : history.files.length} of {history.files.length})
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {history.files.slice(0, 6).map((file) => (
                <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.numPages ? `${file.numPages} pages` : "Unknown pages"} •{" "}
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/summary/${file.fileId}`}>View</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {history && history.recentUsage.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <Card className="p-6">
              <div className="space-y-3">
                {history.recentUsage.slice(0, 10).map((usage) => (
                  <div
                    key={usage.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {usage.type === "summary" ? (
                        <FileText className="h-4 w-4 text-primary" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      )}
                      <div>
                        <p className="text-sm font-medium capitalize">{usage.type}</p>
                        {usage.fileId && (
                          <p className="text-xs text-muted-foreground">File: {usage.fileId.slice(0, 8)}...</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(usage.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
