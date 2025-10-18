import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This would fetch from your Laravel backend
    // For now, returning location data
    const locations = [
      {
        id: "1",
        name: "Calapan City Hospital",
        category: "hospital",
        address: "J.P. Rizal St, Calapan City",
        phone: "(043) 288-8888",
        lat: 13.4119,
        lng: 121.1803,
        icon: "hospital",
        hours: "24/7",
        services: ["Emergency", "Outpatient", "Laboratory"],
      },
      {
        id: "2",
        name: "Calapan City Police Station",
        category: "police",
        address: "Magsaysay St, Calapan City",
        phone: "(043) 288-6666",
        lat: 13.4125,
        lng: 121.1795,
        icon: "police",
        hours: "24/7",
        services: ["Emergency Response", "Crime Reporting", "Traffic Management"],
      },
      {
        id: "3",
        name: "Calapan Fire Station",
        category: "fire",
        address: "Rizal Ave, Calapan City",
        phone: "(043) 288-7777",
        lat: 13.413,
        lng: 121.181,
        icon: "fire",
        hours: "24/7",
        services: ["Fire Response", "Rescue Operations", "Fire Safety Inspection"],
      },
      {
        id: "4",
        name: "Calapan City Hall",
        category: "government",
        address: "Magsaysay St, Calapan City",
        phone: "(043) 288-5555",
        lat: 13.4115,
        lng: 121.18,
        icon: "government",
        hours: "Mon-Fri 8:00 AM - 5:00 PM",
        services: ["Business Permits", "Civil Registry", "City Planning"],
      },
      {
        id: "5",
        name: "Oriental Mindoro State College",
        category: "school",
        address: "Bongabong Rd, Calapan City",
        phone: "(043) 288-4444",
        lat: 13.41,
        lng: 121.182,
        icon: "school",
        hours: "Mon-Fri 7:00 AM - 6:00 PM",
        services: ["Higher Education", "Vocational Training", "Library"],
      },
      {
        id: "6",
        name: "Calapan City Public Market",
        category: "landmark",
        address: "Market St, Calapan City",
        lat: 13.412,
        lng: 121.179,
        icon: "landmark",
        hours: "Daily 5:00 AM - 6:00 PM",
        services: ["Fresh Produce", "Meat & Seafood", "Dry Goods"],
      },
    ]

    return NextResponse.json({
      success: true,
      locations,
    })
  } catch (error) {
    console.error("[v0] Error fetching locations:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch locations" }, { status: 500 })
  }
}
