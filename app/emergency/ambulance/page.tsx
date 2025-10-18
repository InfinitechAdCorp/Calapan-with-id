"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, MapPin, User, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AmbulanceRequestPage() {
  const { toast } = useToast()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    emergency: "",
    notes: "",
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter your address manually.",
            variant: "destructive",
          })
        },
      )
    }
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/emergency/ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Ambulance Request Submitted",
          description: `Request ID: ${data.data.requestId}. Estimated arrival: ${data.data.estimatedArrival}`,
        })
        setFormData({
          name: "",
          phone: "",
          address: "",
          emergency: "",
          notes: "",
        })
      } else {
        toast({
          title: "Request Failed",
          description: data.message || "Failed to submit request. Please call emergency hotline.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit request. Please call emergency hotline.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-6 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/emergency" className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">Request Ambulance</h1>
          </div>
          <p className="text-orange-100 text-sm">Fill in the details for quick response</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-xl p-5 mb-8 flex items-start gap-3 shadow-sm">
          <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-orange-900">Location Detected</p>
            <p className="text-orange-700 text-sm mt-1">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Getting your location..."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Contact Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="09XX XXX XXXX"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Exact Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street, Barangay, Landmarks"
              rows={3}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Type of Emergency *</label>
            <select
              required
              value={formData.emergency}
              onChange={(e) => setFormData({ ...formData, emergency: e.target.value })}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Select emergency type</option>
              <option value="medical">Medical Emergency</option>
              <option value="accident">Accident</option>
              <option value="cardiac">Cardiac Arrest</option>
              <option value="breathing">Breathing Difficulty</option>
              <option value="injury">Severe Injury</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information that might help responders"
              rows={3}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 rounded-xl p-5 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-900 font-medium">
              This is for emergency ambulance requests only. False reports may result in penalties.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !location}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting Request..." : "Request Ambulance Now"}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600 mb-3">Or call directly</p>
            <a
              href="tel:(043)288-8888"
              className="inline-flex items-center gap-2 text-orange-600 font-bold text-lg hover:text-orange-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (043) 288-8888
            </a>
          </div>
        </form>
      </main>
    </div>
  )
}
