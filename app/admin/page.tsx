"use client"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "News", count: 24 },
  { name: "Events", count: 18 },
  { name: "Announcements", count: 32 },
  { name: "Projects", count: 12 },
  { name: "Health", count: 8 },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total News</div>
          <div className="text-3xl font-bold text-foreground mt-2">24</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Events</div>
          <div className="text-3xl font-bold text-foreground mt-2">18</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Pending Reports</div>
          <div className="text-3xl font-bold text-foreground mt-2">7</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Active Alerts</div>
          <div className="text-3xl font-bold text-foreground mt-2">3</div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Content Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
