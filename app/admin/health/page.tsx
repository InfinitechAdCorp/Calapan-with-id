"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Link from "next/link"

interface HealthInfo {
  id: number
  title: string
  description: string
  category: string
  created_at: string
}

export default function HealthPage() {
  const [healthInfo, setHealthInfo] = useState<HealthInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHealthInfo()
  }, [])

  const fetchHealthInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/health")
      if (!response.ok) throw new Error("Failed to fetch health info")
      const data = await response.json()
      setHealthInfo(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch health info")
      console.error("[v0] Error fetching health info:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredHealthInfo = healthInfo.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this health info?")) return
    try {
      const response = await fetch(`/api/health/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete health info")
      setHealthInfo(healthInfo.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete health info")
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Information</h1>
          <p className="text-muted-foreground mt-2">Manage health and wellness information</p>
        </div>
        <Link href="/admin/health/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Health Info
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search health info..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredHealthInfo.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No health info found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHealthInfo.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/health/${item.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
