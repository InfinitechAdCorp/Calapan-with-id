import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Dashboard routes that require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard")

  // If trying to access dashboard without token, redirect to login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If logged in and trying to access login/register, redirect to home
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
}
