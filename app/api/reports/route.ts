import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()

    // Forward the request to Laravel backend
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reports${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
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
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reports',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}