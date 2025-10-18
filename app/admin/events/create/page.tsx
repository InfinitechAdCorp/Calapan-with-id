"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateEventPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    status: "upcoming",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Combine date and time into event_date for Laravel
      const eventDateTime = `${formData.date} ${formData.time}:00`
      
      // Create FormData to send multipart/form-data
      const submitFormData = new FormData()
      submitFormData.append('title', formData.title)
      submitFormData.append('description', formData.description)
      submitFormData.append('location', formData.location)
      submitFormData.append('event_date', eventDateTime)
      submitFormData.append('status', formData.status)
      
      // Add image if selected
      if (imageFile) {
        submitFormData.append('image', imageFile)
      }
      
      console.log("Sending FormData with image:", imageFile?.name)
      
      const response = await fetch("/api/events", {
        method: "POST",
        body: submitFormData, // Send as FormData, not JSON
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/events")
      } else {
        console.error("Server error:", data)
        alert(`Failed to create event: ${data.error || data.details || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Create Event</h1>
          <p className="text-muted-foreground mt-2">Add a new city event</p>
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
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Time *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
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
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
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
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
              placeholder="Enter event description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Event Image</label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative border border-border rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
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
              {submitting ? "Creating..." : "Create Event"}
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