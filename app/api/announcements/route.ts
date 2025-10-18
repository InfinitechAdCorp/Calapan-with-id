import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/announcements`, {
      headers: {
        "Accept": "application/json",
      },
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error("[v0] Laravel error response:", text.substring(0, 200))
      return NextResponse.json({ error: "Failed to fetch announcements" }, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching announcements:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get FormData from request (includes image file)
    const formData = await request.formData()
    
    console.log("[v0] Creating announcement with FormData")
    
    // Forward the FormData directly to Laravel
    const response = await fetch(`${API_URL}/api/announcements`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        // Don't set Content-Type - let the browser set it with boundary for multipart/form-data
      },
      body: formData,
    })
    
    console.log("[v0] Laravel response status:", response.status)
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response:", text.substring(0, 500))
      return NextResponse.json(
        { error: "Server returned non-JSON response", details: text.substring(0, 200) }, 
        { status: 500 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Error creating announcement:", error)
    return NextResponse.json(
      { error: "Failed to create announcement", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    )
  }
}