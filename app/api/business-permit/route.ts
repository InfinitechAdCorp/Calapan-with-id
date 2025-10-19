import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const authHeader = request.headers.get("authorization")

    const url = id
      ? `${API_URL}/api/business-permit/${id}`
      : `${API_URL}/api/business-permit`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch data" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Business Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 },
      )
    }

    const body = await request.json()

    // Convert camelCase to snake_case for Laravel
    const payload = {
      business_name: body.businessName,
      business_type: body.businessType,
      business_category: body.businessCategory,
      business_description: body.businessDescription,
      owner_name: body.ownerName,
      owner_email: body.ownerEmail,
      owner_phone: body.ownerPhone,
      owner_address: body.ownerAddress,
      business_address: body.businessAddress,
      barangay: body.barangay,
      lot_number: body.lotNumber,
      floor_area: body.floorArea,
    }

    console.log("[Business Permit] Submitting with token:", authHeader.substring(0, 30) + "...")

    const response = await fetch(`${API_URL}/api/business-permit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log("[Business Permit] Response status:", response.status)
    console.log("[Business Permit] Response data:", data)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to submit application" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Business Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { id, ...formData } = body

    const payload = {
      business_name: formData.businessName,
      business_type: formData.businessType,
      business_category: formData.businessCategory,
      business_description: formData.businessDescription,
      owner_name: formData.ownerName,
      owner_email: formData.ownerEmail,
      owner_phone: formData.ownerPhone,
      owner_address: formData.ownerAddress,
      business_address: formData.businessAddress,
      barangay: formData.barangay,
      lot_number: formData.lotNumber,
      floor_area: formData.floorArea,
    }

    const response = await fetch(`${API_URL}/api/business-permit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update application" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Business Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No authorization token provided" },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const response = await fetch(`${API_URL}/api/business-permit/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete application" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Business Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}