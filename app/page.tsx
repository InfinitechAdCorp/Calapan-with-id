"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (token) {
      router.push("/app")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
