"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Bell, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Alert {
  id: string
  disaster_date: string
  disaster_type: string
  establishment_type: string
  suspension_start_date: string
  suspension_end_date: string
  notes: string
  status: string
}

export default function EditAlertPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Alert>({
    id: params.id,
    disaster_date: "",
    disaster_type: "",
    establishment_type: "",
    suspension_start_date: "",
    suspension_end_date: "",
    notes: "",
    status: "active",
  })

  // Fetch alert on mount
  useEffect(() => {
    const fetchAlert = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/alerts/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch alert')
        }
        
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching alert:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAlert()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`/api/alerts/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disaster_date: formData.disaster_date,
          disaster_type: formData.disaster_type,
          establishment_type: formData.establishment_type,
          suspension_start: formData.suspension_start_date,
          suspension_end: formData.suspension_end_date,
          notes: formData.notes,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update alert')
      }

      router.push('/admin/alerts')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating alert:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const disasterTypes = ["Typhoon", "Earthquake", "Flood", "Landslide", "Fire", "Other"]
  const establishmentTypes = ["School", "Hospital", "Government Office", "Market", "Public Transport", "Other"]

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/alerts">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Disaster Alert</h1>
          <p className="text-muted-foreground mt-2">Update alert details and suspension period</p>
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
          <p className="text-muted-foreground">Loading alert...</p>
        </Card>
      ) : (
        <Card className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Disaster Date *</label>
                <input
                  type="date"
                  required
                  value={formData.disaster_date}
                  onChange={(e) => setFormData({ ...formData, disaster_date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Disaster Type *</label>
                <select
                  required
                  value={formData.disaster_type}
                  onChange={(e) => setFormData({ ...formData, disaster_type: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="">Select disaster type</option>
                  {disasterTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Establishment Type *</label>
                <select
                  required
                  value={formData.establishment_type}
                  onChange={(e) => setFormData({ ...formData, establishment_type: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="">Select establishment type</option>
                  {establishmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Suspension Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.suspension_start_date}
                  onChange={(e) => setFormData({ ...formData, suspension_start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Suspension End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.suspension_end_date}
                  onChange={(e) => setFormData({ ...formData, suspension_end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 text-white">
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Update Alert
                  </>
                )}
              </Button>
              <Link href="/admin/alerts">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}