"use client"

import { useState } from "react"
import { ArrowLeft, Home, Grid3x3, Newspaper, AlertTriangle, User, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AllServicesPage() {
  const [activeTab, setActiveTab] = useState("services")
  const [searchQuery, setSearchQuery] = useState("")

  const allCategories = [
    { name: "Services", href: "/services", icon: "📋", color: "bg-orange-100" },
    { name: "Citizen Guide", href: "/citizen-guide", icon: "📖", color: "bg-amber-100" },
    { name: "e-Services", href: "/e-services", icon: "💻", color: "bg-orange-200" },
    { name: "Emergency", href: "/emergency", icon: "🚨", color: "bg-red-100" },
    { name: "Students", href: "/students", icon: "🎓", color: "bg-orange-100" },
    { name: "Startup", href: "/startup", icon: "🚀", color: "bg-amber-100" },
    { name: "Business", href: "/business", icon: "💼", color: "bg-orange-200" },
    { name: "City Map", href: "/map", icon: "🗺️", color: "bg-amber-100" },
    { name: "Report Issue", href: "/report", icon: "📝", color: "bg-orange-100" },
    { name: "My Reports", href: "/reports", icon: "📊", color: "bg-orange-200" },
    { name: "Alerts", href: "/alerts", icon: "🔔", color: "bg-red-100" },
    { name: "News", href: "/news", icon: "📰", color: "bg-amber-100" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white px-4 md:px-8 lg:px-12 py-4 border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50">
                <ArrowLeft className="w-5 h-5 text-orange-600" />
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-orange-900">All Services</h1>
          </div>

          <div className="relative md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            <Input
              type="search"
              placeholder="Search all services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-orange-50 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {allCategories.map((category, idx) => (
              <Link key={idx} href={category.href} className="flex flex-col items-center group">
                <Card className="w-full border-orange-200 mb-2 transition-all group-hover:shadow-lg group-hover:scale-105 group-hover:border-orange-300 p-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className={`${category.color} aspect-square flex items-center justify-center transition-colors group-hover:brightness-95`}
                    >
                      <span className="text-3xl md:text-4xl lg:text-3xl">{category.icon}</span>
                    </div>
                  </CardContent>
                </Card>
                <span className="text-xs md:text-sm text-orange-900 text-center leading-tight font-medium">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-4 py-3 md:hidden shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" onClick={() => setActiveTab("home")} className="flex flex-col items-center gap-1">
            <Home className={`w-6 h-6 ${activeTab === "home" ? "text-orange-500" : "text-gray-400"}`} />
            <span className={`text-xs ${activeTab === "home" ? "text-orange-500 font-semibold" : "text-gray-500"}`}>
              Home
            </span>
          </Link>

          <Link href="/services" onClick={() => setActiveTab("services")} className="flex flex-col items-center gap-1">
            <Grid3x3 className={`w-6 h-6 ${activeTab === "services" ? "text-orange-500" : "text-gray-400"}`} />
            <span className={`text-xs ${activeTab === "services" ? "text-orange-500 font-semibold" : "text-gray-500"}`}>
              Services
            </span>
          </Link>

          <Link href="/news" onClick={() => setActiveTab("news")} className="flex flex-col items-center gap-1">
            <Newspaper className={`w-6 h-6 ${activeTab === "news" ? "text-orange-500" : "text-gray-400"}`} />
            <span className={`text-xs ${activeTab === "news" ? "text-orange-500 font-semibold" : "text-gray-500"}`}>
              News
            </span>
          </Link>

          <Link
            href="/emergency"
            onClick={() => setActiveTab("emergency")}
            className="flex flex-col items-center gap-1"
          >
            <AlertTriangle className={`w-6 h-6 ${activeTab === "emergency" ? "text-orange-500" : "text-gray-400"}`} />
            <span
              className={`text-xs ${activeTab === "emergency" ? "text-orange-500 font-semibold" : "text-gray-500"}`}
            >
              Emergency
            </span>
          </Link>

          <Link href="/account" onClick={() => setActiveTab("account")} className="flex flex-col items-center gap-1">
            <User className={`w-6 h-6 ${activeTab === "account" ? "text-orange-500" : "text-gray-400"}`} />
            <span className={`text-xs ${activeTab === "account" ? "text-orange-500 font-semibold" : "text-gray-500"}`}>
              Account
            </span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
