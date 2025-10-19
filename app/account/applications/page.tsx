"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Application {
  id: number
  reference_number: string
  status: string
  created_at: string
  type: string
  [key: string]: unknown
}

export default function ApplicationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    fetchApplications()

    const success = searchParams.get("success")
    if (success) {
      console.log(`Successfully submitted ${success} application`)
    }
  }, [router, searchParams])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("No authentication token found. Please log in again.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }

      const data = await response.json()
      console.log("Applications data:", data)

      // Extract applications from response
      const apps = Array.isArray(data) ? data : data.data || data.applications || []
      setApplications(apps.sort((a: Application, b: Application) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))

      if (apps.length === 0) {
        console.log("No applications found for user")
      }
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true
    return app.status.toLowerCase() === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Applications</h1>
              <p className="text-sm text-muted-foreground">Track your submitted applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <Button variant="link" onClick={fetchApplications} className="ml-2 text-red-700">
              Retry
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({applications.filter((a) => a.status.toLowerCase() === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({applications.filter((a) => a.status.toLowerCase() === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({applications.filter((a) => a.status.toLowerCase() === "rejected").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all"
                      ? "You haven't submitted any applications yet."
                      : `You don't have any ${activeTab} applications.`}
                  </p>
                  <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((app) => (
                <Card key={`${app.type}-${app.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{app.type}</CardTitle>
                        <CardDescription>Reference: {app.reference_number}</CardDescription>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Submitted on</p>
                        <p className="font-medium">{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applicant</p>
                        <p className="font-medium">
                          {String(
                            app.full_name ||
                            app.owner_name ||
                            app.groom_name ||
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedApp?.type} Application</DialogTitle>
            <DialogDescription>Reference Number: {selectedApp?.reference_number}</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted on</p>
                  <p className="font-medium mt-1">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(selectedApp).map(([key, value]) => {
                  if (["id", "type", "created_at", "status", "reference_number"].includes(key)) return null
                  return (
                    <div key={key} className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
                      <dd className="text-sm col-span-2">{String(value || "N/A")}</dd>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}