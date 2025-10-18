"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Bell, Loader } from "lucide-react"

interface Alert {
  id: string
  disaster_type: string
  establishment_type: string
  suspension_start_date: string
  suspension_end_date: string
  status: string
   notes: string
  created_at: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    disaster_date: new Date().toISOString().split('T')[0],
    disaster_type: "",
    establishment_type: "",
    suspension_start_date: "",
    suspension_end_date: "",
    notes: "",
    status: "active",
  })

  // Fetch alerts on mount
  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/alerts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      
      const data = await response.json()
      setAlerts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }
const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  };
  return date.toLocaleDateString('en-GB', options).toUpperCase();
};
  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg = errorData.details 
          ? `${errorData.error} - ${JSON.stringify(errorData.details)}`
          : errorData.error || 'Failed to create alert'
        throw new Error(errorMsg)
      }

      await fetchAlerts()
      setFormData({
        disaster_date: new Date().toISOString().split('T')[0],
        disaster_type: "",
        establishment_type: "",
        suspension_start_date: "",
        suspension_end_date: "",
        notes: "",
        status: "active",
      })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating alert:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) {
      return
    }

    try {
      setError(null)
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete alert')
      }

      setAlerts(alerts.filter((alert) => alert.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error deleting alert:', err)
    }
  }

  const disasterTypes = ["Typhoon", "Earthquake", "Flood", "Landslide", "Fire", "Other"]
  const establishmentTypes = ["School", "Hospital", "Government Office", "Market", "Public Transport", "Other"]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disaster Alerts</h1>
          <p className="text-muted-foreground mt-2">Manage disaster alerts and establishment suspensions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Alert
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm">{error}</p>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleAddAlert} className="space-y-4">
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Alert & Create
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-orange-600 mb-4" />
          <p className="text-muted-foreground">Loading alerts...</p>
        </Card>
      )}

      {/* Alerts List */}
      {!loading && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No alerts yet. Create your first alert to get started.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Disaster Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Establishment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Suspension Period</th>
                         <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Notes</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{alert.disaster_type}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{alert.establishment_type}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
  {formatDate(alert.suspension_start_date)} to {formatDate(alert.suspension_end_date)}
</td>
      <td className="px-6 py-4 text-sm text-foreground font-medium">{alert.notes}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/alerts/${alert.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(alert.id)}
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
      )}
    </div>
  )
}