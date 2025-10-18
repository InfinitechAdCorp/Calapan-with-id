import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, address, emergency, notes, location, timestamp } = body

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      return NextResponse.json({ success: false, message: "API URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${apiUrl}/api/emergency/ambulance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        emergency,
        notes,
        location,
        timestamp,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to process ambulance request" },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false, message: "Failed to process ambulance request" }, { status: 500 })
  }
}