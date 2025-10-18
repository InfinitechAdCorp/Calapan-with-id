"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function EditHealthPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    title: "Dengue Prevention Tips",
    description: "Important tips to prevent dengue fever",
    content: "Dengue is a mosquito-borne disease. Here are key prevention measures...",
    category: "Prevention",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updating:", formData)
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/health">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Health Information</h1>
          <p className="text-muted-foreground mt-2">Update health information details</p>
        </div>
      </div>

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
              placeholder="Enter health information title"
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
            <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              <option value="Prevention">Prevention</option>
              <option value="Treatment">Treatment</option>
              <option value="Wellness">Wellness</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
              Update Health Info
            </Button>
            <Link href="/admin/health">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
