import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    // Forward request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
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
