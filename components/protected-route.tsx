"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, type User } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User["role"][]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const user = getUser()

    if (!user) {
      router.push("/login")
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/")
      return
    }

    setIsAuthorized(true)
  }, [router, allowedRoles])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
