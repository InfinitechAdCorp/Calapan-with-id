import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"]

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  const token = request.cookies.get("auth_token")?.value

  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access a protected route without a token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access login/register with a valid token, redirect to app
  if (isPublicRoute && token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/app", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
