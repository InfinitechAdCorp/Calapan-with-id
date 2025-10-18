"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Calendar, Eye, Share2, Bookmark } from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
  publishedAt: string
  views: number
  author: string
}

interface ApiNewsArticle {
  id: number
  title: string
  description: string
  content: string
  image_url: string | null
  status: string
  priority: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [announcements, setAnnouncements] = useState<NewsArticle[]>([])
  const [events, setEvents] = useState<NewsArticle[]>([])
  const [projects, setProjects] = useState<NewsArticle[]>([])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: "all", label: "All News" },
    { value: "announcements", label: "Announcements" },
    { value: "events", label: "Events" },
    { value: "projects", label: "Projects" },

  ]

  const transformArticle = (article: ApiNewsArticle, category: string): NewsArticle => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return {
      id: article.id.toString(),
      title: article.title,
      excerpt: article.description || article.content.substring(0, 150) + "...",
      content: article.content,
      category: category,
      image: article.image_url ? `${apiUrl}${article.image_url}` : undefined,
      publishedAt: article.published_at 
        ? new Date(article.published_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        : new Date(article.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
      views: Math.floor(Math.random() * 1000),
      author: "Admin"
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all categories in parallel
        const [newsRes, announcementsRes, eventsRes, projectsRes, healthRes] = await Promise.all([
          fetch("/api/news"),
          fetch("/api/announcements"),
          fetch("/api/events"),
          fetch("/api/projects"),
          fetch("/api/health")
        ])

        const [newsData, announcementsData, eventsData, projectsData, healthData] = await Promise.all([
          newsRes.json(),
          announcementsRes.json(),
          eventsRes.json(),
          projectsRes.json(),
          healthRes.json()
        ])

        // Transform each category
        const transformedNews = (Array.isArray(newsData) ? newsData : newsData.news || [])
          .map((article: ApiNewsArticle) => transformArticle(article, "news"))
        
        const transformedAnnouncements = (Array.isArray(announcementsData) ? announcementsData : announcementsData.announcements || [])
          .map((article: ApiNewsArticle) => transformArticle(article, "announcements"))
        
        const transformedEvents = (Array.isArray(eventsData) ? eventsData : eventsData.events || [])
          .map((article: ApiNewsArticle) => transformArticle(article, "events"))
        
        const transformedProjects = (Array.isArray(projectsData) ? projectsData : projectsData.projects || [])
          .map((article: ApiNewsArticle) => transformArticle(article, "projects"))
        
        const transformedHealth = (Array.isArray(healthData) ? healthData : healthData.health || [])
          .map((article: ApiNewsArticle) => transformArticle(article, "health"))

        setNews(transformedNews)
        setAnnouncements(transformedAnnouncements)
        setEvents(transformedEvents)
        setProjects(transformedProjects)
       
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Combine all articles based on selected category
  const getFilteredNews = () => {
    switch (selectedCategory) {
      case "all":
        return [...news, ...announcements, ...events, ...projects]
      case "announcements":
        return announcements
      case "events":
        return events
      case "projects":
        return projects
     
      default:
        return news
    }
  }

  const filteredNews = getFilteredNews()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-6 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="hover:bg-white/10 rounded-lg p-1 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">City News</h1>
          </div>
          <p className="text-orange-100 text-sm ml-10">Latest updates from Calapan City</p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-orange-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? "bg-orange-600 text-white shadow-md scale-105"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100 hover:scale-105"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading news...</p>
              </div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No news articles</h3>
              <p className="text-gray-600 text-center max-w-sm">Check back later for updates from the city.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md border border-orange-100 hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {article.image && (
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-sm">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.publishedAt}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-700">By {article.author}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            // Share functionality
                          }}
                          className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            // Bookmark functionality
                          }}
                          className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}