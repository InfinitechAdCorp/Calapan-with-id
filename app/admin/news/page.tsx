"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search, X } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: number
  title: string
  image_url?: string | null
  description: string
  image?: string
  created_at: string
  status: "published" | "draft" | "archived"
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news")
      if (!response.ok) throw new Error("Failed to fetch news")
      const data = await response.json()
      setNews(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news")
      console.error("[v0] Error fetching news:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news?")) return
    try {
      const response = await fetch(`/api/news/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete news")
      setNews(news.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete news")
    }
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage news articles</p>
        </div>
        <Link href="/admin/news/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredNews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No news found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-sm">
                      {item.image_url ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${item.image_url}`} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageModal(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${item.image_url}`)}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.description}</td>
                   <td className="px-6 py-4 text-sm text-muted-foreground">
  {new Date(item.created_at)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(",", "")}
</td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "published"
                            ? "bg-green-100 text-green-700"
                            : item.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/news/${item.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}