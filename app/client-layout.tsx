"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Suspense } from "react"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const isAuthRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password")
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <>
      {!isAuthRoute && !isAdminRoute && (
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
      )}

      <div className={!isAuthRoute && !isAdminRoute ? "lg:pl-64 lg:pr-4" : ""}>
        {children}
      </div>

      {!isAuthRoute && !isAdminRoute && (
        <Suspense fallback={<div>Loading...</div>}>
          <BottomNav />
        </Suspense>
      )}

      <Analytics />
      <Toaster />
    </>
  )
}
