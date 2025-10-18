"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Ambulance, AlertTriangle, Clock, LogOut } from "lucide-react"

export default function EmergencyResponderDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== "emergency_responder") {
      router.push("/login")
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  const stats = [
    { title: "Active Calls", value: "8", icon: Phone, color: "text-red-600" },
    { title: "Ambulance Requests", value: "3", icon: Ambulance, color: "text-orange-600" },
    { title: "Pending Response", value: "12", icon: AlertTriangle, color: "text-yellow-600" },
    { title: "Avg Response Time", value: "4.2m", icon: Clock, color: "text-blue-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emergency Response Dashboard</h1>
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

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Active Emergency Calls</CardTitle>
              <CardDescription>Respond to urgent situations immediately</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-600 hover:bg-red-700">View Active Calls</Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ambulance Dispatch</CardTitle>
                <CardDescription>Manage ambulance requests and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Requests</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response History</CardTitle>
                <CardDescription>View completed emergency responses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
