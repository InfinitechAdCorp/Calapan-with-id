"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    status: "draft",
    published_at: "",
  })

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/announcements/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch announcement: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Fetched announcement data:", data)
        
        // Format the published_at date for the date input
        let publishedDate = ""
        if (data.published_at) {
          try {
            const date = new Date(data.published_at)
            if (!isNaN(date.getTime())) {
              publishedDate = date.toISOString().split('T')[0]
            }
          } catch (err) {
            console.error("Error parsing published_at date:", err)
          }
        }
        
        setFormData({
          title: data.title || "",
          content: data.content || "",
          priority: data.priority || "medium",
          status: data.status || "draft",
          published_at: publishedDate,
        })
        
        // Set image preview if exists
        if (data.image_url) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          setImagePreview(`${API_URL}${data.image_url}`)
        }
      } catch (error) {
        console.error("Error fetching announcement:", error)
        setError(error instanceof Error ? error.message : "Failed to load announcement")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnnouncement()
    }
  }, [params.id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('priority', formData.priority)
      formDataToSend.append('status', formData.status)
      if (formData.published_at) {
        formDataToSend.append('published_at', formData.published_at)
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      
      console.log("Submitting update for announcement:", params.id)
      
      const response = await fetch(`/api/announcements/${params.id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Failed to update announcement: ${response.status}`)
      }

      const result = await response.json()
      console.log("Updated successfully:", result)
      router.push("/admin/announcements")
    } catch (error) {
      console.error("Error updating announcement:", error)
      setError(error instanceof Error ? error.message : "Failed to update announcement")
      alert(error instanceof Error ? error.message : "Failed to update announcement")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-muted-foreground">Loading announcement...</p>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/announcements">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Announcement</h1>
          </div>
        </div>
        <Card className="p-8 max-w-2xl">
          <div className="text-center text-destructive">
            <p className="mb-4">{error}</p>
            <Link href="/admin/announcements">
              <Button variant="outline">Back to Announcements</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/announcements">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Announcement</h1>
          <p className="text-muted-foreground mt-2">Update announcement details</p>
        </div>
      </div>

      <Card className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-foreground mb-2">
              Content *
            </label>
            <textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none bg-background text-foreground"
              placeholder="Enter announcement content"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Image
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload image</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 2MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-foreground mb-2">
                Priority *
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-foreground mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="published_at" className="block text-sm font-semibold text-foreground mb-2">
              Published Date
            </label>
            <input
              id="published_at"
              type="date"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 bg-background text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current date</p>
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
                "Update Announcement"
              )}
            </Button>
            <Link href="/admin/announcements">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}