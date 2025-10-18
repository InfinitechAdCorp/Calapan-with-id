import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
