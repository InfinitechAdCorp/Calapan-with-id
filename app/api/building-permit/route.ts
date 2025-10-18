import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const url = id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/building-permit/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/building-permit`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
    console.error("Building Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Convert camelCase to snake_case for Laravel
    const payload = {
      project_type: body.projectType,
      project_scope: body.projectScope,
      project_description: body.projectDescription,
      lot_area: body.lotArea || null,
      floor_area: body.floorArea || null,
      number_of_floors: body.numberOfFloors,
      estimated_cost: body.estimatedCost,
      owner_name: body.ownerName,
      owner_email: body.ownerEmail,
      owner_phone: body.ownerPhone,
      owner_address: body.ownerAddress,
      property_address: body.propertyAddress,
      barangay: body.barangay,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/building-permit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to submit application" },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Building Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...formData } = body

    const payload = {
      project_type: formData.projectType,
      project_scope: formData.projectScope,
      project_description: formData.projectDescription,
      lot_area: formData.lotArea || null,
      floor_area: formData.floorArea || null,
      number_of_floors: formData.numberOfFloors,
      estimated_cost: formData.estimatedCost,
      owner_name: formData.ownerName,
      owner_email: formData.ownerEmail,
      owner_phone: formData.ownerPhone,
      owner_address: formData.ownerAddress,
      property_address: formData.propertyAddress,
      barangay: formData.barangay,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/building-permit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
    console.error("Building Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/building-permit/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
    console.error("Building Permit API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
