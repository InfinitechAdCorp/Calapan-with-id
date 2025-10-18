"use client"

import { useState } from "react"
import { ArrowLeft, Home, Grid3x3, Newspaper, AlertTriangle, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function EServicesPage() {
  const [activeTab, setActiveTab] = useState("services")

  const eServices = [
    {
      name: "Online Business Registration",
      description: "Register your business online",
      status: "Available",
      icon: "💼",
      url: "/services/business-permit",
    },
    {
      name: "Tax Payment Portal",
      description: "Pay your taxes online",
      status: "Available",
      icon: "💳",
      url: "/services/tax-payment",
    },
    {
      name: "Permit Tracking",
      description: "Track your permit applications",
      status: "Available",
      icon: "📊",
      url: "/services/permit-tracking",
    },
    {
      name: "Document Request",
      description: "Request official documents",
      status: "Available",
      icon: "📄",
      url: "/services/document-request",
    },
    {
      name: "Online Appointment",
      description: "Schedule appointments with city offices",
      status: "Available",
      icon: "📅",
      url: "/services/online-appointment",
    },
    {
      name: "Bill Payment",
      description: "Pay utility bills online",
      status: "Coming Soon",
      icon: "💰",
      url: "/services/bill-payment",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">e-Services</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Digital Government Services</h2>
            <p className="text-sm text-gray-700">
              Access government services online anytime, anywhere. Fast, convenient, and secure.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {eServices.map((service, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <Badge
                        variant={service.status === "Available" ? "default" : "secondary"}
                        className={service.status === "Available" ? "bg-green-100 text-green-700" : ""}
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    {service.status === "Available" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-orange-600 border-orange-300 bg-transparent"
                        onClick={() => window.location.href = service.url}
                      >
                        Access Service <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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