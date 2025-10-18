"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, Newspaper, AlertTriangle, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Grid3x3, label: "Services", href: "/services" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: AlertTriangle, label: "Emergency", href: "/emergency" },
    { icon: User, label: "Account", href: "/account" },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
