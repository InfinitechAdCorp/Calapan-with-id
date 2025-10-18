"use client"

import { useState } from "react"
import { Phone, Ambulance, FireExtinguisher, Shield, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function EmergencyPage() {
  const [calling, setCalling] = useState(false)

  const emergencyContacts = [
    {
      icon: Phone,
      label: "Emergency Hotline",
      number: "911",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      icon: Ambulance,
      label: "Ambulance",
      number: "(043) 288-8888",
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      icon: FireExtinguisher,
      label: "Fire Department",
      number: "(043) 288-7777",
      color: "bg-gradient-to-br from-orange-600 to-red-600",
    },
    {
      icon: Shield,
      label: "Police Station",
      number: "(043) 288-6666",
      color: "bg-gradient-to-br from-orange-700 to-orange-800",
    },
  ]

  const handleEmergencyCall = async (number: string) => {
    setCalling(true)
    setTimeout(() => {
      window.location.href = `tel:${number}`
      setCalling(false)
    }, 500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 sm:px-6 py-4 sm:py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Link href="/" className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">Emergency Services</h1>
          </div>
          <p className="text-orange-100 text-xs sm:text-sm">
            Quick access to emergency contacts and services
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full overflow-y-auto pb-16">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-l-4 border-orange-600 p-5 rounded-xl mb-8 shadow-sm">
          <p className="text-orange-900 font-semibold">
            For life-threatening emergencies, call{" "}
            <span className="text-red-600 font-extrabold text-lg underline">911</span>{" "}
            immediately
          </p>
        </div>

        {/* One-Tap Call */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">One-Tap Emergency Call</h2>
          <button
            onClick={() => handleEmergencyCall("911")}
            disabled={calling}
            className="w-full bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Phone className="w-12 h-12 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">Call <span className="text-yellow-300">911</span></p>
                <p className="text-orange-100 text-sm mt-1">Emergency Hotline</p>
              </div>
            </div>
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleEmergencyCall(contact.number)}
                className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-100 active:scale-98 transition-all group w-full"
              >
                <div
                  className={`${contact.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <contact.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-lg">{contact.label}</h3>
                  <p
                    className={`text-sm mt-0.5 ${
                      contact.number === "911"
                        ? "text-red-600 font-bold text-base"
                        : "text-gray-600"
                    }`}
                  >
                    {contact.number}
                  </p>
                </div>
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Request Assistance */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Request Assistance</h2>
          <Link
            href="/emergency/ambulance"
            className="flex items-center gap-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ambulance className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-xl">Request Ambulance</h3>
              <p className="text-orange-100 text-sm mt-1">Share your location for quick response</p>
            </div>
          </Link>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Safety Tips</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="text-orange-600 font-bold text-lg">•</span>
              <span>Stay calm and speak clearly when calling emergency services</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-600 font-bold text-lg">•</span>
              <span>Provide your exact location and describe the emergency</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-600 font-bold text-lg">•</span>
              <span>Follow the dispatchers instructions carefully</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
