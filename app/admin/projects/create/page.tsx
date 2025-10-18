"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitFormData = new FormData()
      submitFormData.append("title", formData.title)
      submitFormData.append("description", formData.description)
      submitFormData.append("content", formData.content)
      submitFormData.append("status", formData.status)
      submitFormData.append("priority", formData.priority)
      submitFormData.append("progress", formData.progress.toString())
      
      // Only send dates if they have values
      if (formData.start_date) {
        submitFormData.append("start_date", formData.start_date)
      }
      if (formData.end_date) {
        submitFormData.append("end_date", formData.end_date)
      }
      
      if (imageFile) {
        submitFormData.append("image", imageFile)
      }

      console.log("[Frontend] Submitting form data:")
      for (const [key, value] of submitFormData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value)
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        body: submitFormData,
      })

      console.log("[Frontend] Response status:", response.status)
      console.log("[Frontend] Response headers:", Object.fromEntries(response.headers.entries()))

      // Get response body
      const responseText = await response.text()
      console.log("[Frontend] Response body:", responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[Frontend] Failed to parse response as JSON:", parseError)
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`)
      }

      // Check if response is OK (200-299)
      if (!response.ok) {
        console.error("[Frontend] Request failed:", responseData)
        
        // Handle validation errors
        if (response.status === 422 && responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("\n")
          throw new Error(`Validation failed:\n${errorMessages}`)
        }
        
        // Handle other errors
        throw new Error(responseData.message || responseData.error || "Failed to create project")
      }

      console.log("[Frontend] Project created successfully:", responseData)
      
      // Success - redirect to projects page
      router.push("/admin/projects")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create project"
      setError(errorMessage)
      console.error("[Frontend] Error creating project:", err)
      
      // Don't redirect on error, stay on the page so user can see the error
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Create Project</h1>
          <p className="text-muted-foreground mt-2">Add a new development project</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-700 whitespace-pre-wrap">{error}</p>
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
              placeholder="Enter brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
              placeholder="Enter full content"
            />
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

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Progress (%)</label>
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-w-xs rounded-lg" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
              <select
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
              <label className="block text-sm font-semibold text-foreground mb-2">Priority</label>
              <select
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

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
              {loading ? "Creating..." : "Create Project"}
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