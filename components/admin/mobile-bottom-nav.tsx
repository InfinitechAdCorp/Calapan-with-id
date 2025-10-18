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
} from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Newspaper, label: "News", href: "/admin/news" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
    { icon: Briefcase, label: "Projects", href: "/admin/projects" },
    { icon: Heart, label: "Health", href: "/admin/health" },
    { icon: AlertTriangle, label: "Alerts", href: "/admin/alerts" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden">
      <div className="flex overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-max text-xs font-medium transition-colors ${
              isActive(item.href) ? "text-orange-600 bg-orange-50" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
