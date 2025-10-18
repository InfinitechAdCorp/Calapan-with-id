"use client"

import { useState } from "react"
import { ArrowLeft, Search, Home, Grid3x3, Newspaper, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("services")
  const [searchQuery, setSearchQuery] = useState("")

  const serviceCategories = [
    {
      title: "Government Services",
      services: [
        { name: "Business Permit", description: "Apply for business permits", icon: "📋", path: "/services/business-permit" },
        { name: "Building Permit", description: "Construction permits", icon: "🏗️", path: "/services/building-permit" },
        { name: "Cedula", description: "Community tax certificate", icon: "📄", path: "/services/cedula" },
        { name: "Marriage License", description: "Apply for marriage license", icon: "💍", path: "/services/marriage-license" },
      ],
    },
    {
      title: "Health Services",
      services: [
        { name: "Health Certificate", description: "Medical clearance", icon: "🏥", path: "/services/health-certificate" },
        { name: "Vaccination Records", description: "View vaccination history", icon: "💉", path: "/services/vaccination-records" },
        { name: "Medical Assistance", description: "Request medical aid", icon: "⚕️", path: "/services/medical-assistance" },
      ],
    },
    {
      title: "Public Safety",
      services: [
        { name: "Police Clearance", description: "Request police clearance", icon: "👮", path: "/services/police-clearance" },
        { name: "Fire Safety Inspection", description: "Schedule inspection", icon: "🚒", path: "/services/fire-safety-inspection" },
        { name: "Barangay Clearance", description: "Get barangay clearance", icon: "📝", path: "/services/barangay-clearance" },
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">All Services</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
        {serviceCategories.map((category, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{category.title}</h2>
            <div className="space-y-3">
              {category.services.map((service, serviceIdx) => (
                <Card key={serviceIdx} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <Link href={service.path}>
                        <Button variant="ghost" size="sm" className="text-orange-600">
                          Apply
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
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
