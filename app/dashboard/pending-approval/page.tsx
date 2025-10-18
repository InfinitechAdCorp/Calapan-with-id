"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, LogOut } from "lucide-react"

export default function PendingApprovalPage() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
    }
    if (currentUser?.is_approved) {
      // Redirect to appropriate dashboard if already approved
      switch (currentUser.role) {
        case "super_admin":
          router.push("/dashboard/super-admin")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
        case "emergency_responder":
          router.push("/dashboard/emergency")
          break
        case "department_staff":
          router.push("/dashboard/department")
          break
        default:
          router.push("/")
      }
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription className="text-base">
            Your {user.role.replace("_", " ")} account is currently under review by the city administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>What happens next?</strong>
              <br />
              Our team will verify your credentials and approve your account within 24-48 hours. You will receive an email
              notification once approved.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Account Details:</strong>
            </p>
            <div className="text-sm space-y-1">
              <p>
                Name: {user.first_name} {user.last_name}
              </p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role.replace("_", " ").toUpperCase()}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
