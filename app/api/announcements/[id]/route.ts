import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${API_URL}/api/announcements/${id}`, {
      headers: {
        "Accept": "application/json",
      },
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error("[v0] Laravel error response:", text.substring(0, 200))
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching announcement:", error)
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await request.formData()
    
    console.log("[v0] Updating announcement with FormData")
    
    // Laravel doesn't support PUT with FormData directly, so we need to use POST with _method
    formData.append('_method', 'PUT')
    
    const response = await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
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
    console.error("[v0] Error updating announcement:", error)
    return NextResponse.json(
      { error: "Failed to update announcement", message: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error("[v0] Laravel error response:", text.substring(0, 200))
      return NextResponse.json({ error: "Failed to delete" }, { status: response.status })
    }
    
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error("[v0] Error deleting announcement:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}