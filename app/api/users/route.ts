import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("authorization")
    
    console.log("=== DEBUG INFO ===")
    console.log("All headers:", Object.fromEntries(request.headers))
    console.log("Auth header received:", authHeader)
    console.log("Auth header type:", typeof authHeader)
    
    if (!authHeader || authHeader.trim() === "") {
      console.log("ERROR: No auth header or empty auth header")
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    const fullUrl = `${API_URL}/api/users`
    
    console.log("Fetching from:", fullUrl)
    console.log("Forwarding auth header:", authHeader)

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader, // Forward the token to Laravel
      },
    })

    console.log("Response status:", response.status)
    const responseText = await response.text()
    console.log("Response body:", responseText)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, details: responseText },
        { status: response.status }
      )
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[users] Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}

// PUT update user status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, status, verification_status, verification_notes } = body

    if (!userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fullUrl = `${API_URL}/api/users/${userId}`
    console.log("Updating at:", fullUrl)
    console.log("Forwarding auth header:", authHeader)

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader, // Forward the token to Laravel
      },
      body: JSON.stringify({
        status,
        verification_status,
        verification_notes,
      }),
    })

    console.log("Response status:", response.status)
    const responseText = await response.text()
    console.log("Response body:", responseText)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, details: responseText },
        { status: response.status }
      )
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[users] Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}