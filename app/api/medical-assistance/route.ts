import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const url = id ? `${API_URL}/api/medical-assistance/${id}` : `${API_URL}/api/medical-assistance`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("[v0] Non-JSON response from backend:", text)
      data = {
        success: false,
        message: "Server returned an invalid response. Please check your backend API.",
        error: text.substring(0, 200),
      }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching medical assistances:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const snakeCaseFormData = new FormData()

    formData.forEach((value, key) => {
      const snakeKey = camelToSnake(key)
      snakeCaseFormData.append(snakeKey, value)
    })

    const response = await fetch(`${API_URL}/api/medical-assistance`, {
      method: "POST",
      body: snakeCaseFormData,
    })

    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("[v0] Non-JSON response from backend:", text)
      data = {
        success: false,
        message: "Server returned an invalid response. Please check your backend API.",
        error: text.substring(0, 200),
      }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error creating medical assistance:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 })
    }

    const formData = await request.formData()
    const snakeCaseFormData = new FormData()

    formData.forEach((value, key) => {
      const snakeKey = camelToSnake(key)
      snakeCaseFormData.append(snakeKey, value)
    })

    snakeCaseFormData.append("_method", "PUT")

    const response = await fetch(`${API_URL}/api/medical-assistance/${id}`, {
      method: "POST",
      body: snakeCaseFormData,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error updating medical assistance:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 })
    }

    const response = await fetch(`${API_URL}/api/medical-assistance/${id}`, {
      method: "DELETE",
    })

    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("[v0] Non-JSON response from backend:", text)
      data = {
        success: false,
        message: "Server returned an invalid response. Please check your backend API.",
        error: text.substring(0, 200),
      }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error deleting medical assistance:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
