"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Suspense } from "react"
import { usePathname } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {!isAdminRoute && (
          <Suspense fallback={<div>Loading...</div>}>
            <Sidebar />
          </Suspense>
        )}

        <div className={isAdminRoute ? "" : "lg:pl-64 lg:pr-4"}>
          {children}
        </div>

        {!isAdminRoute && (
          <Suspense fallback={<div>Loading...</div>}>
            <BottomNav />
          </Suspense>
        )}

        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}