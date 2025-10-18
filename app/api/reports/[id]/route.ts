import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // Resolve the Promise to get `id`

    // Forward the request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch report',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // Resolve the Promise to get `id`
    const body = await request.json()

    // Forward the request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update report',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // Resolve the Promise to get `id`

    // Forward the request to Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      {
        success: false,
      message: 'Failed to delete report',
      error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
