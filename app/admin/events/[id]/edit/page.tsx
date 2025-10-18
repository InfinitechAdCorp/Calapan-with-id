"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "upcoming",
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/events/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Fetched event data:", data)
        
        // Handle different possible date formats
        let dateStr = ""
        let timeStr = ""
        
        if (data.event_date) {
          try {
            const eventDate = new Date(data.event_date)
            // Check if date is valid
            if (!isNaN(eventDate.getTime())) {
              dateStr = eventDate.toISOString().split('T')[0]
              timeStr = eventDate.toTimeString().slice(0, 5)
            }
          } catch (err) {
            console.error("Error parsing date:", err)
          }
        }
        
        setFormData({
          title: data.title || "",
          date: dateStr,
          time: timeStr,
          location: data.location || "",
          description: data.description || "",
          status: data.status || "upcoming",
        })
      } catch (error) {
        console.error("Error fetching event:", error)
        setError(error instanceof Error ? error.message : "Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      // Combine date and time into event_date for Laravel
      const eventDateTime = `${formData.date} ${formData.time}:00`
      
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        event_date: eventDateTime,
        status: formData.status,
      }
      
      console.log("Submitting payload:", payload)
      
      const response = await fetch(`/api/events/${params.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update event: ${response.status}`)
      }

      router.push("/admin/events")
    } catch (error) {
      console.error("Error updating event:", error)
      setError(error instanceof Error ? error.message : "Failed to update event")
      alert(error instanceof Error ? error.message : "Failed to update event")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          </div>
        </div>
        <Card className="p-8 max-w-2xl">
          <div className="text-center text-destructive">
            <p className="mb-4">{error}</p>
            <Link href="/admin/events">
              <Button variant="outline">Back to Events</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground mt-2">Update event details</p>
        </div>
      </div>

      <Card className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Time *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              placeholder="Enter event location"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none bg-background text-foreground"
              placeholder="Enter event description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
            <Link href="/admin/events">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}