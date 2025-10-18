"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, AlertCircle, LogOut } from "lucide-react"

export default function DepartmentStaffDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== "department_staff") {
      router.push("/login")
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  const stats = [
    { title: "Assigned Reports", value: "24", icon: FileText, color: "text-blue-600" },
    { title: "In Progress", value: "12", icon: Clock, color: "text-orange-600" },
    { title: "Resolved", value: "89", icon: CheckCircle, color: "text-green-600" },
    { title: "Urgent", value: "5", icon: AlertCircle, color: "text-red-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Staff Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {user.first_name} {user.last_name}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Reports</CardTitle>
              <CardDescription>Reports assigned to your department</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Update progress on ongoing reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Manage Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
