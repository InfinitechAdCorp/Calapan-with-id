"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HealthInfo {
  id: string
  title: string
  description: string
  content: string
  category: string
}

export default function EditHealthPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<HealthInfo>({
    id: params.id,
    title: "",
    description: "",
    content: "",
    category: "Prevention",
  })

  // Fetch health info on mount
  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/health/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch health information')
        }
        
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching health info:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHealthInfo()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`/api/health/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update health information')
      }

      router.push('/admin/health')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating health info:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/health">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Health Information</h1>
          <p className="text-muted-foreground mt-2">Update health information details</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Card className="p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-orange-600 mb-4" />
          <p className="text-muted-foreground">Loading health information...</p>
        </Card>
      ) : (
        <Card className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Enter health information title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                placeholder="Enter brief description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Content *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                placeholder="Enter full content"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="Prevention">Prevention</option>
                <option value="Treatment">Treatment</option>
                <option value="Wellness">Wellness</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 text-white">
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Health Info"
                )}
              </Button>
              <Link href="/admin/health">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}