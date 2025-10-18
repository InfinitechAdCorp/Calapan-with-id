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

interface ApiResponse {
  success?: boolean
  data?: {
    data?: Application[]
    items?: Application[]
    records?: Application[]
  } | Application[]
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
    fetchApplications()

    const success = searchParams.get("success")
    if (success) {
      console.log(`Successfully submitted ${success} application`)
    }
  }, [searchParams])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        cedulas,
        marriageLicenses,
        businessPermits,
        healthCerts,
        buildingPermits,
        medicalAssistance,
        policeClearance,
        fireSafety,
        barangayClearance,
      ] = await Promise.all([
        fetch("/api/cedula").then((res) => res.json()),
        fetch("/api/marriage-license").then((res) => res.json()),
        fetch("/api/business-permit").then((res) => res.json()),
        fetch("/api/health-certificate").then((res) => res.json()),
        fetch("/api/building-permit").then((res) => res.json()),
        fetch("/api/medical-assistance").then((res) => res.json()),
        fetch("/api/police-clearance").then((res) => res.json()),
        fetch("/api/fire-safety-inspection").then((res) => res.json()),
        fetch("/api/barangay-clearance").then((res) => res.json()),
      ])

      const extractData = (response: ApiResponse): Application[] => {
        if (!response) return []

        if (response.success && response.data) {
          if (Array.isArray(response.data)) return response.data
          if (response.data.data && Array.isArray(response.data.data)) return response.data.data
          if (response.data.items && Array.isArray(response.data.items)) return response.data.items
          if (response.data.records && Array.isArray(response.data.records)) return response.data.records
          return []
        }

        if (Array.isArray(response)) return response

        if (response.data && Array.isArray(response.data)) return response.data

        return []
      }

      const allApplications: Application[] = [
        ...extractData(cedulas).map((app) => ({ ...app, type: "Cedula" })),
        ...extractData(marriageLicenses).map((app) => ({ ...app, type: "Marriage License" })),
        ...extractData(businessPermits).map((app) => ({ ...app, type: "Business Permit" })),
        ...extractData(healthCerts).map((app) => ({ ...app, type: "Health Certificate" })),
        ...extractData(buildingPermits).map((app) => ({ ...app, type: "Building Permit" })),
        ...extractData(medicalAssistance).map((app) => ({ ...app, type: "Medical Assistance" })),
        ...extractData(policeClearance).map((app) => ({ ...app, type: "Police Clearance" })),
        ...extractData(fireSafety).map((app) => ({ ...app, type: "Fire Safety Inspection" })),
        ...extractData(barangayClearance).map((app) => ({ ...app, type: "Barangay Clearance" })),
      ]

      allApplications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setApplications(allApplications)
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

  const renderApplicationDetails = (app: Application) => {
    switch (app.type) {
      case "Cedula":
        return (
          <div className="space-y-4">
            <DetailRow label="Full Name" value={String(app.full_name || '')} />
            <DetailRow label="Email" value={String(app.email || '')} />
            <DetailRow label="Phone" value={String(app.phone || '')} />
            <DetailRow label="Address" value={String(app.address || '')} />
            <DetailRow label="Birth Date" value={new Date(app.birth_date as string).toLocaleDateString()} />
            <DetailRow label="Civil Status" value={String(app.civil_status || '')} />
            <DetailRow label="Citizenship" value={String(app.citizenship || '')} />
            <DetailRow label="Occupation" value={String(app.occupation || '')} />
            <DetailRow label="TIN Number" value={String(app.tin_number || "N/A")} />
            <DetailRow label="Height" value={`${app.height} cm`} />
            <DetailRow label="Weight" value={`${app.weight} kg`} />
          </div>
        )
      case "Marriage License":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Groom Information</h4>
              <div className="space-y-3">
                <DetailRow label="Name" value={String(app.groom_name || '')} />
                <DetailRow label="Birth Date" value={new Date(app.groom_birth_date as string).toLocaleDateString()} />
                <DetailRow label="Birth Place" value={String(app.groom_birth_place || '')} />
                <DetailRow label="Citizenship" value={String(app.groom_citizenship || '')} />
                <DetailRow label="Civil Status" value={String(app.groom_civil_status || '')} />
                <DetailRow label="Address" value={String(app.groom_address || '')} />
                <DetailRow label="Phone" value={String(app.groom_phone || '')} />
                <DetailRow label="Email" value={String(app.groom_email || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Bride Information</h4>
              <div className="space-y-3">
                <DetailRow label="Name" value={String(app.bride_name || '')} />
                <DetailRow label="Birth Date" value={new Date(app.bride_birth_date as string).toLocaleDateString()} />
                <DetailRow label="Birth Place" value={String(app.bride_birth_place || '')} />
                <DetailRow label="Citizenship" value={String(app.bride_citizenship || '')} />
                <DetailRow label="Civil Status" value={String(app.bride_civil_status || '')} />
                <DetailRow label="Address" value={String(app.bride_address || '')} />
                <DetailRow label="Phone" value={String(app.bride_phone || '')} />
                <DetailRow label="Email" value={String(app.bride_email || '')} />
              </div>
            </div>
          </div>
        )
      case "Business Permit":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Business Information</h4>
              <div className="space-y-3">
                <DetailRow label="Business Name" value={String(app.business_name || '')} />
                <DetailRow label="Business Type" value={String(app.business_type || '')} />
                <DetailRow label="Category" value={String(app.business_category || '')} />
                <DetailRow label="Description" value={String(app.business_description || '')} />
                <DetailRow label="Business Address" value={String(app.business_address || '')} />
                <DetailRow label="Barangay" value={String(app.barangay || '')} />
                <DetailRow label="Lot Number" value={String(app.lot_number || "N/A")} />
                <DetailRow label="Floor Area" value={`${app.floor_area} sq.m.`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Owner Information</h4>
              <div className="space-y-3">
                <DetailRow label="Name" value={String(app.owner_name || '')} />
                <DetailRow label="Email" value={String(app.owner_email || '')} />
                <DetailRow label="Phone" value={String(app.owner_phone || '')} />
                <DetailRow label="Address" value={String(app.owner_address || '')} />
              </div>
            </div>
          </div>
        )
      case "Health Certificate":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Personal Information</h4>
              <div className="space-y-3">
                <DetailRow label="Full Name" value={String(app.full_name || '')} />
                <DetailRow label="Email" value={String(app.email || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Address" value={String(app.address || '')} />
                <DetailRow label="Birth Date" value={new Date(app.birth_date as string).toLocaleDateString()} />
                <DetailRow label="Age" value={String(app.age || '')} />
                <DetailRow label="Sex" value={String(app.sex || '')} />
                <DetailRow label="Purpose" value={String(app.purpose || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Medical History</h4>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Medical History</h4>
              <div className="space-y-3">
                <DetailRow label="Has Allergies" value={Boolean(app.has_allergies) ? "Yes" : "No"} />
                {Boolean(app.has_allergies) && <DetailRow label="Allergies" value={String(app.allergies || '')} />}
                <DetailRow label="Has Medications" value={Boolean(app.has_medications) ? "Yes" : "No"} />
                {Boolean(app.has_medications) && <DetailRow label="Medications" value={String(app.medications || '')} />}
                <DetailRow label="Has Conditions" value={Boolean(app.has_conditions) ? "Yes" : "No"} />
                {Boolean(app.has_conditions) && <DetailRow label="Conditions" value={String(app.conditions || '')} />}
              </div>
            </div>
          </div>
          </div>
        )
      case "Building Permit":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Project Information</h4>
              <div className="space-y-3">
                <DetailRow label="Project Type" value={String(app.project_type || '')} />
                <DetailRow label="Project Scope" value={String(app.project_scope || '')} />
                <DetailRow label="Description" value={String(app.project_description || '')} />
                <DetailRow label="Lot Area" value={app.lot_area ? `${app.lot_area} sq.m.` : "N/A"} />
                <DetailRow label="Floor Area" value={app.floor_area ? `${app.floor_area} sq.m.` : "N/A"} />
                <DetailRow label="Number of Floors" value={String(app.number_of_floors || '')} />
                <DetailRow label="Estimated Cost" value={`₱${Number(app.estimated_cost).toLocaleString()}`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Owner Information</h4>
              <div className="space-y-3">
                <DetailRow label="Name" value={String(app.owner_name || '')} />
                <DetailRow label="Email" value={String(app.owner_email || '')} />
                <DetailRow label="Phone" value={String(app.owner_phone || '')} />
                <DetailRow label="Address" value={String(app.owner_address || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Property Information</h4>
              <div className="space-y-3">
                <DetailRow label="Property Address" value={String(app.property_address || '')} />
                <DetailRow label="Barangay" value={String(app.barangay || '')} />
              </div>
            </div>
          </div>
        )
      case "Medical Assistance":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Patient Information</h4>
              <div className="space-y-3">
                <DetailRow label="Reference Number" value={app.reference_number} />
                <DetailRow label="Full Name" value={String(app.full_name || '')} />
                <DetailRow label="Email" value={String(app.email || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Address" value={String(app.address || '')} />
                <DetailRow label="Birth Date" value={new Date(app.birth_date as string).toLocaleDateString()} />
                <DetailRow label="Age" value={String(app.age || '')} />
                <DetailRow label="Sex" value={String(app.sex || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Medical Information</h4>
              <div className="space-y-3">
                <DetailRow label="Diagnosis" value={String(app.diagnosis || '')} />
                <DetailRow label="Hospital Name" value={String(app.hospital_name || '')} />
                <DetailRow label="Doctor Name" value={String(app.doctor_name || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Financial Information</h4>
              <div className="space-y-3">
                <DetailRow label="Estimated Cost" value={`₱${parseFloat(String(app.estimated_cost || "0")).toLocaleString()}`} />
                <DetailRow label="Monthly Income" value={`₱${parseFloat(String(app.monthly_income || "0")).toLocaleString()}`} />
                <DetailRow label="Assistance Amount Requested" value={`₱${parseFloat(String(app.assistance_amount_requested || "0")).toLocaleString()}`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Documents & Status</h4>
              <div className="space-y-3">
                <DetailRow label="Supporting Documents" value={String(app.supporting_documents || '')} />
                <DetailRow label="Status" value={app.status} />
                <DetailRow label="Created At" value={new Date(app.created_at).toLocaleString()} />
                <DetailRow label="Updated At" value={new Date(app.updated_at as string).toLocaleString()} />
              </div>
            </div>
          </div>
        )
      case "Police Clearance":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Personal Information</h4>
              <div className="space-y-3">
                <DetailRow label="Full Name" value={String(app.full_name || '')} />
                <DetailRow label="Email" value={String(app.email || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Birth Date" value={new Date(app.birth_date as string).toLocaleDateString()} />
                <DetailRow label="Birth Place" value={String(app.birth_place || '')} />
                <DetailRow label="Age" value={String(app.age || '')} />
                <DetailRow label="Sex" value={String(app.sex || '')} />
                <DetailRow label="Civil Status" value={String(app.civil_status || '')} />
                <DetailRow label="Nationality" value={String(app.nationality || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Address Information</h4>
              <div className="space-y-3">
                <DetailRow label="Current Address" value={String(app.address || '')} />
                <DetailRow label="Height" value={`${app.height} cm`} />
                <DetailRow label="Weight" value={`${app.weight} kg`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Purpose</h4>
              <div className="space-y-3">
                <DetailRow label="Purpose" value={String(app.purpose || '')} />
              </div>
            </div>
          </div>
        )
      case "Fire Safety Inspection":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Property Information</h4>
              <div className="space-y-3">
                <DetailRow label="Property Name" value={String(app.establishment_name || '')} />
                <DetailRow label="Property Type" value={String(app.building_type || '')} />
                <DetailRow label="Property Address" value={String(app.address || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Barangay" value={String(app.barangay || '')} />
                <DetailRow label="Floor Area" value={`${app.floor_area} sq.m.`} />
                <DetailRow label="Number of Floors" value={String(app.number_of_floors || '')} />
                <DetailRow label="Occupancy Type" value={String(app.occupancy_type || '')} />
                <DetailRow label="Has fire Extinguisher" value={String(app.has_fire_extinguisher || '')} />
                <DetailRow label="Has fire Alarm" value={String(app.has_fire_alarm || '')} />
                <DetailRow label="Has fire Sprinkler" value={String(app.has_sprinkler || '')} />
                <DetailRow label="Has Emergency Exit" value={String(app.has_emergency_exit || '')} />
                <DetailRow label="Inspection Date Preference" value={String(app.inspection_date_preference || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Owner Information</h4>
              <div className="space-y-3">
                <DetailRow label="Owner Name" value={String(app.owner_name || '')} />
                <DetailRow label="Email" value={String(app.email || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Address" value={String(app.address || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Inspection Details</h4>
              <div className="space-y-3">
                <DetailRow label="Inspection Type" value={String(app.inspection_type || '')} />
                <DetailRow label="Preferred Date" value={new Date(app.preferred_inspection_date as string).toLocaleDateString()} />
              </div>
            </div>
          </div>
        )
      case "Barangay Clearance":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Personal Information</h4>
              <div className="space-y-3">
                <DetailRow label="Full Name" value={String(app.full_name || '')} />
                <DetailRow label="Email" value={String(app.email || '')} />
                <DetailRow label="Phone" value={String(app.phone || '')} />
                <DetailRow label="Birth Date" value={new Date(app.birth_date as string).toLocaleDateString()} />
                <DetailRow label="Birth Place" value={String(app.birth_place || '')} />
                <DetailRow label="Age" value={String(app.age || '')} />
                <DetailRow label="Sex" value={String(app.sex || '')} />
                <DetailRow label="Civil Status" value={String(app.civil_status || '')} />
                <DetailRow label="Nationality" value={String(app.nationality || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Address & Residency</h4>
              <div className="space-y-3">
                <DetailRow label="Current Address" value={String(app.address || '')} />
                <DetailRow label="Length of Residency" value={String(app.length_of_residency || '')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Purpose</h4>
              <div className="space-y-3">
                <DetailRow label="Purpose" value={String(app.purpose || '')} />
              </div>
            </div>
          </div>
        )
      default:
        return <p>No details available</p>
    }
  }

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
                            app.patient_name ||
                            app.guardian_name ||
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

              {renderApplicationDetails(selectedApp)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2">{value}</dd>
    </div>
  )
}