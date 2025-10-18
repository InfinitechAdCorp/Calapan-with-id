"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  status: "upcoming" | "ongoing" | "completed"
  image_url?: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    try {
      setDeleting(deleteConfirm)
      const response = await fetch(`/api/events/${deleteConfirm}`, {
        method: "DELETE",
      })

      // Check for 204 No Content or 200 OK
      if (response.ok || response.status === 204) {
        setEvents(events.filter((item) => item.id !== deleteConfirm))
        setDeleteConfirm(null)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete event" }))
        alert(errorData.error || "Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700"
      case "ongoing":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null
    // If it's a full URL, return as is
    if (imageUrl.startsWith('http')) return imageUrl
    // If it's a relative path, prepend the Laravel backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    // Remove /api if it exists in the backend URL
    const baseUrl = backendUrl.replace('/api', '')
    return `${baseUrl}${imageUrl}`
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage city events</p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </Link>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No events found matching your search." : "No events yet."}
            </p>
            {!searchTerm && (
              <Link href="/admin/events/create">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEvents.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div 
                        className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => item.image_url && setSelectedImage(getImageUrl(item.image_url))}
                      >
                        {item.image_url ? (
                          <img
                            src={getImageUrl(item.image_url) || ''}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(item.event_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/events/${item.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id)}
                          disabled={deleting === item.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {deleting === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleDeleteCancel}
        >
          <div 
            className="bg-background rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Event</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirm}
                disabled={deleting !== null}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Event preview"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}