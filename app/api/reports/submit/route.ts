import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Forward the request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/submit`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let the browser set it with boundary
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error submitting report:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit report',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}