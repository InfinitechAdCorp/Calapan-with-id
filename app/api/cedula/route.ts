import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const url = id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/cedula/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/cedula`

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
    console.error("Cedula API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Convert camelCase to snake_case for Laravel
    const payload = {
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      birth_date: body.birthDate,
      civil_status: body.civilStatus,
      citizenship: body.citizenship,
      occupation: body.occupation,
      tin_number: body.tinNumber,
      height: body.height,
      weight: body.weight,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cedula`, {
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
    console.error("Cedula API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...formData } = body

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      birth_date: formData.birthDate,
      civil_status: formData.civilStatus,
      citizenship: formData.citizenship,
      occupation: formData.occupation,
      tin_number: formData.tinNumber,
      height: formData.height,
      weight: formData.weight,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cedula/${id}`, {
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
    console.error("Cedula API Error:", error)
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cedula/${id}`, {
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
    console.error("Cedula API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
