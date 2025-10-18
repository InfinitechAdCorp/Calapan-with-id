"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface NewsItem {
  id: number
  title: string
  description: string
  content: string
  image?: string
  status: "published" | "draft" | "archived"
}

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewsItem>({
    id: 0,
    title: "",
    description: "",
    content: "",
    image: "",
    status: "draft",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/news/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch news")
        const data = await response.json()
        setFormData(data)
        if (data.image) {
          setImagePreview(data.image)
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news")
        console.error("[v0] Error fetching news:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [params.id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image: file.name })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      let imagePath = formData.image
      if (imagePreview && formData.image && !formData.image.startsWith("/")) {
        const imageFormData = new FormData()
        const file = (e.target as HTMLFormElement).image.files?.[0]
        if (file) {
          imageFormData.append("file", file)
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: imageFormData,
          })
          if (!uploadResponse.ok) throw new Error("Failed to upload image")
          const uploadData = await uploadResponse.json()
          imagePath = uploadData.path
        }
      }

      const response = await fetch(`/api/news/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imagePath,
        }),
      })

      if (!response.ok) throw new Error("Failed to update news")
      router.push("/admin/news")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update news")
      console.error("[v0] Error updating news:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit News</h1>
          <p className="text-muted-foreground mt-2">Update news article</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

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
              placeholder="Enter news title"
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
            <label className="block text-sm font-semibold text-foreground mb-2">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            {imagePreview && (
              <div className="mt-4 relative w-full max-w-xs h-48">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "published" | "draft" | "archived" })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 text-white">
              {submitting ? "Updating..." : "Update News"}
            </Button>
            <Link href="/admin/news">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}