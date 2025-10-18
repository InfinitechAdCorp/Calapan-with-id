"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileText, Users, TrendingUp, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  const stats = [
    { title: "Active Reports", value: "156", icon: AlertCircle, color: "text-red-600" },
    { title: "Resolved Today", value: "34", icon: FileText, color: "text-green-600" },
    { title: "Active Citizens", value: "892", icon: Users, color: "text-blue-600" },
    { title: "Response Rate", value: "94%", icon: TrendingUp, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest citizen reports and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View All Reports</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>Active emergency situations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700">View Emergencies</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
