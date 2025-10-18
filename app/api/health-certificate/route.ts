import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const url = id
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/health-certificate/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/health-certificate`

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
    console.error("Health Certificate API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payload = {
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      birth_date: body.birthDate,
      age: body.age,
      sex: body.sex,
      purpose: body.purpose,
      has_allergies: body.hasAllergies,
      allergies: body.allergies,
      has_medications: body.hasMedications,
      medications: body.medications,
      has_conditions: body.hasConditions,
      conditions: body.conditions,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-certificate`, {
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
    console.error("Health Certificate API Error:", error)
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
      age: formData.age,
      sex: formData.sex,
      purpose: formData.purpose,
      has_allergies: formData.hasAllergies,
      allergies: formData.allergies,
      has_medications: formData.hasMedications,
      medications: formData.medications,
      has_conditions: formData.hasConditions,
      conditions: formData.conditions,
      status: formData.status,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-certificate/${id}`, {
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
    console.error("Health Certificate API Error:", error)
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-certificate/${id}`, {
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
    console.error("Health Certificate API Error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
