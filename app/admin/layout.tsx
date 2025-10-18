import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileBottomNav } from "@/components/admin/mobile-bottom-nav"

export const metadata: Metadata = {
  title: "Admin Dashboard - Calapan City",
  description: "Admin management dashboard",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  )
}
