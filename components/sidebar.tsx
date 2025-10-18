"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  List,
  FileText,
  GraduationCap,
  Rocket,
  Briefcase,
  MapPin,
  Bell,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Grid3x3, label: "Services", href: "/services" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: AlertTriangle, label: "Emergency", href: "/emergency" },
    { icon: User, label: "Account", href: "/account" },
  ]

  const quickAccessItems = [
    { icon: List, label: "All Services", href: "/all-services" },
    { icon: FileText, label: "Citizen Guide", href: "/citizen-guide" },
    { icon: Grid3x3, label: "e-Services", href: "/e-services" },
    { icon: GraduationCap, label: "Students", href: "/students" },
    { icon: Rocket, label: "Startup", href: "/startup" },
    { icon: Briefcase, label: "Business", href: "/business" },
    { icon: MapPin, label: "City Map", href: "/map" },
    { icon: Bell, label: "Alerts", href: "/alerts" },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">CC</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">Calapan City</h1>
          <p className="text-xs text-gray-500">Connect</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Quick Access */}
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Access</h3>
          <div className="space-y-1">
            {quickAccessItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2025 Calapan City</p>
      </div>
    </aside>
  )
}
