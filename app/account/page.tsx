"use client"

import { useState } from "react"
import { ArrowLeft, Home, Grid3x3, Newspaper, AlertTriangle, User, ChevronRight, LogOut } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("account")

  const menuItems = [
    { name: "Profile Settings", href: "/account/profile", icon: "👤" },
    { name: "My Applications", href: "/account/applications", icon: "📋" },
    { name: "Payment History", href: "/account/payments", icon: "💳" },
    { name: "Notifications", href: "/account/notifications", icon: "🔔" },
    { name: "Privacy & Security", href: "/account/privacy", icon: "🔒" },
    { name: "Help & Support", href: "/account/support", icon: "❓" },
    { name: "About", href: "/account/about", icon: "ℹ️" },
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
          <h1 className="text-xl font-bold text-gray-900">Account</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
        {/* Profile Card */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="bg-orange-500 text-white text-xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">Juan Dela Cruz</h2>
                <p className="text-sm text-gray-600">juan.delacruz@email.com</p>
                <p className="text-xs text-gray-500 mt-1">Calapan City Resident</p>
              </div>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 bg-transparent">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardContent className="p-0">
                <Link href={item.href} className="flex items-center gap-4 p-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1 font-medium text-gray-900">{item.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Button variant="outline" className="w-full mt-6 text-red-600 border-red-300 bg-transparent">
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-gray-500 mt-6">Calapan City Connect v1.0.0</p>
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
