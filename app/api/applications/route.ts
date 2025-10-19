// app/api/applications/route.ts
import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface Application {
  [key: string]: unknown
  id?: number
  status?: string
  created_at?: string
}

interface ApiResponse {
  success?: boolean
  data?: Application[] | { data?: Application[] }
}

type ApplicationWithType = Application & { type: string }

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    const headers = {
      Authorization: authHeader,
      Accept: "application/json",
    }

    // Fetch all application types in parallel - matching your Laravel routes
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
      fetch(`${API_URL}/api/cedula`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Cedula error:", e); return {} }),
      fetch(`${API_URL}/api/marriage-license`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Marriage error:", e); return {} }),
      fetch(`${API_URL}/api/business-permit`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Business error:", e); return {} }),
      fetch(`${API_URL}/api/health-certificate`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Health error:", e); return {} }),
      fetch(`${API_URL}/api/building-permit`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Building error:", e); return {} }),
      fetch(`${API_URL}/api/medical-assistance`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Medical error:", e); return {} }),
      fetch(`${API_URL}/api/police-clearance`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Police error:", e); return {} }),
      fetch(`${API_URL}/api/fire-safety-inspection`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Fire error:", e); return {} }),
      fetch(`${API_URL}/api/barangay-clearance`, { headers }).then(r => r.json() as Promise<ApiResponse>).catch(e => { console.error("Barangay error:", e); return {} }),
    ])

    // Helper to extract array from response
    const extractArray = (response: ApiResponse): Application[] => {
      if (Array.isArray(response)) return response
      if (response?.success && response?.data) {
        if (Array.isArray(response.data)) return response.data
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          const nested = response.data as { data?: unknown }
          if (Array.isArray(nested.data)) return nested.data
        }
      }
      if (response?.data && Array.isArray(response.data)) return response.data
      return []
    }

    // Combine all applications with their type
    const allApplications: ApplicationWithType[] = [
      ...extractArray(cedulas).map((app: Application) => ({ ...app, type: "Cedula" })),
      ...extractArray(marriageLicenses).map((app: Application) => ({ ...app, type: "Marriage License" })),
      ...extractArray(businessPermits).map((app: Application) => ({ ...app, type: "Business Permit" })),
      ...extractArray(healthCerts).map((app: Application) => ({ ...app, type: "Health Certificate" })),
      ...extractArray(buildingPermits).map((app: Application) => ({ ...app, type: "Building Permit" })),
      ...extractArray(medicalAssistance).map((app: Application) => ({ ...app, type: "Medical Assistance" })),
      ...extractArray(policeClearance).map((app: Application) => ({ ...app, type: "Police Clearance" })),
      ...extractArray(fireSafety).map((app: Application) => ({ ...app, type: "Fire Safety Inspection" })),
      ...extractArray(barangayClearance).map((app: Application) => ({ ...app, type: "Barangay Clearance" })),
    ]

    console.log(`[Applications API] Fetched ${allApplications.length} total applications`)

    return NextResponse.json(allApplications)
  } catch (error) {
    console.error("[Applications API] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications", details: String(error) },
      { status: 500 }
    )
  }
}