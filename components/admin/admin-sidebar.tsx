"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Megaphone,
  Briefcase,
  Heart,
  AlertTriangle,
  FileText,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const contentItems = [
    { icon: Newspaper, label: "News", href: "/admin/news" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
    { icon: Briefcase, label: "Projects", href: "/admin/projects" },
    // { icon: Heart, label: "Health", href: "/admin/health" },
  ]

  const managementItems = [
    { icon: AlertTriangle, label: "Alerts", href: "/admin/alerts" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">CC</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">Calapan City</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
        {/* Dashboard */}
        <div>
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin" ? "bg-orange-50 text-orange-600" : "text-foreground hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
        </div>

        {/* Content Management */}
        <div>
          <button
            onClick={() => setExpandedMenu(expandedMenu === "content" ? null : "content")}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            Content Management
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === "content" ? "rotate-180" : ""}`} />
          </button>
          {expandedMenu === "content" && (
            <div className="mt-2 space-y-1">
              {contentItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href) ? "bg-orange-50 text-orange-600" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Management */}
        <div>
          <button
            onClick={() => setExpandedMenu(expandedMenu === "management" ? null : "management")}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            Management
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedMenu === "management" ? "rotate-180" : ""}`}
            />
          </button>
          {expandedMenu === "management" && (
            <div className="mt-2 space-y-1">
              {managementItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href) ? "bg-orange-50 text-orange-600" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2025 Calapan City</p>
      </div>
    </aside>
  )
}
