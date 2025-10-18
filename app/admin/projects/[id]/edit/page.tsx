"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    status: "draft",
    priority: "medium",
    progress: 0,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) throw new Error("Failed to fetch project")
      const data = await response.json()
      
      setFormData({
        title: data.title || "",
        description: data.description || "",
        content: data.content || "",
        status: data.status || "draft",
        priority: data.priority || "medium",
        progress: data.progress || 0,
        start_date: data.start_date || "",
        end_date: data.end_date || "",
      })
      
      if (data.image_url) {
        setImagePreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${data.image_url}`)
      }
      
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project")
      console.error("Error fetching project:", err)
    } finally {
      setLoading(false)
    }
  }

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
    
    try {
      setSubmitting(true)
      setError(null)

      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("priority", formData.priority)
      formDataToSend.append("progress", formData.progress.toString())
      if (formData.start_date) formDataToSend.append("start_date", formData.start_date)
      if (formData.end_date) formDataToSend.append("end_date", formData.end_date)
      
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update project")
      }

      router.push("/admin/projects")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
      console.error("Error updating project:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground mt-2">Update project details</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200 max-w-2xl">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Enter project title"
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
              placeholder="Enter project description"
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
              placeholder="Enter detailed project content"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Project Image</label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-48 border-2 border-dashed border-border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Priority *</label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Progress (%) *</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-foreground w-12">{formData.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: `${formData.progress}%` }} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Project"}
            </Button>
            <Link href="/admin/projects">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}