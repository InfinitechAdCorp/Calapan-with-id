"use client"
import {
  Bell,
  Phone,
  AlertTriangle,
  MapPin,
  FileText,
  Briefcase,
  GraduationCap,
  Rocket,
  Grid3x3,
  List,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, logoutAsync } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = async () => {
    await logoutAsync()
    router.push("/login")
  }

  const services = [
    { icon: List, label: "Services", href: "/services", color: "bg-orange-100" },
    { icon: FileText, label: "Citizen Guide", href: "/citizen-guide", color: "bg-teal-100" },
    // { icon: Grid3x3, label: "e-Services", href: "/e-services", color: "bg-orange-100" },
    { icon: AlertTriangle, label: "Emergency", href: "/emergency", color: "bg-red-100" },
    { icon: GraduationCap, label: "Students", href: "/students", color: "bg-orange-100" },
    { icon: Rocket, label: "Startup", href: "/startup", color: "bg-orange-100" },
    { icon: Briefcase, label: "Business", href: "/business", color: "bg-orange-100" },
    { icon: Grid3x3, label: "View All", href: "/all-services", color: "bg-teal-100" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-4 lg:px-8 pt-4 pb-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center lg:hidden">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <input
                type="search"
                placeholder="Search 'Business Permit'"
                className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border-none outline-none w-48 lg:w-96"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/alerts" className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Logout
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-purple-900 leading-tight">
              Magandang umaga,
              <br />
              Calapeño!
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Question */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What would you like to do?</h2>

          {/* Services Grid */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            {services.map((service, index) => (
              <Link key={index} href={service.href} className="flex flex-col items-center gap-2">
                <div
                  className={`${service.color} w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-105`}
                >
                  <service.icon
                    className={`w-6 h-6 lg:w-7 lg:h-7 ${service.label === "Emergency" ? "text-red-600" : "text-orange-600"}`}
                  />
                </div>
                <span className="text-xs lg:text-sm text-gray-700 text-center leading-tight">{service.label}</span>
              </Link>
            ))}
          </div>

          {/* City Improvement Card */}
          <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-5 lg:p-6 text-white mb-6">
            <h3 className="text-lg lg:text-xl font-bold mb-2">Help us improve our city</h3>
            <p className="text-sm lg:text-base text-purple-100 mb-4">
              Spotted an issue in your area? Contact us so we can fix it together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reports"
                className="bg-white text-purple-900 px-4 py-2 rounded-lg text-sm font-semibold flex-1 text-center hover:bg-gray-100 transition-colors"
              >
                View Reports
              </Link>
              <Link
                href="/report"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex-1 text-center hover:bg-orange-600 transition-colors"
              >
                Report an Issue
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Quick Actions</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Link
                href="/emergency"
                className="flex items-center gap-4 bg-red-50 p-4 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Emergency Call</h4>
                  <p className="text-sm text-gray-600">One-tap emergency hotline</p>
                </div>
              </Link>

              <Link
                href="/map"
                className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">City Map</h4>
                  <p className="text-sm text-gray-600">Find key locations nearby</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
