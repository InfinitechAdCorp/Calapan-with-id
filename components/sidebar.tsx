"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Home,
  Grid3x3,
  Newspaper,
  AlertTriangle,
  User,
  List,
  FileText,
  GraduationCap,
  Rocket,
  Briefcase,
  MapPin,
  Bell,
  Download,
  X,
  Sparkles,
} from "lucide-react"

// Custom type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function Sidebar() {
  const pathname = usePathname()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    console.log("Sidebar PWA effect running")
    
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isIOSInstalled = (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      
      if (isStandalone || isIOSInstalled) {
        console.log("App is already installed")
        setIsInstalled(true)
        setShowInstallButton(false)
        return true
      }
      return false
    }

    if (checkInstalled()) return

    // Check if user dismissed the prompt recently (within 7 days)
    const dismissedTime = localStorage.getItem("pwa-install-dismissed")
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        console.log("Install prompt was recently dismissed, days since:", daysSinceDismissed)
        // Don't return - still listen for the event but don't show automatically
      }
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      console.log("beforeinstallprompt event fired in Sidebar")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Only show if not recently dismissed
      if (!dismissedTime || (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24) >= 7) {
        setShowInstallButton(true)
      }
    }

    const handleAppInstalled = () => {
      console.log("App installed successfully")
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
      localStorage.removeItem("pwa-install-dismissed")
    }

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("No deferred prompt available")
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User choice: ${outcome}`)

      if (outcome === "accepted") {
        setShowInstallButton(false)
        setIsInstalled(true)
      }
    } catch (error) {
      console.error("Error during install prompt:", error)
    }

    setDeferredPrompt(null)
  }

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Grid3x3, label: "Services", href: "/services" },
    { icon: Newspaper, label: "News", href: "/news" },
    { icon: AlertTriangle, label: "Emergency", href: "/emergency" },
    { icon: User, label: "Account", href: "/account" },
  ]

  const quickAccessItems = [
    { icon: List, label: "All Services", href: "/all-services" },
    { icon: FileText, label: "Citizen Guide", href: "/citizen-guide" },
    { icon: GraduationCap, label: "Students", href: "/students" },
    { icon: Rocket, label: "Startup", href: "/startup" },
    { icon: Briefcase, label: "Business", href: "/business" },
    { icon: MapPin, label: "City Map", href: "/map" },
    { icon: Bell, label: "Alerts", href: "/alerts" },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">CC</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white">Calapan City</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Connect</p>
        </div>
      </div>

      {/* PWA Install Banner */}
      {showInstallButton && !isInstalled && (
        <div className="mx-2 mt-3 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg opacity-90"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative p-3 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Install App</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs text-white/90">Quick Access</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInstallButton(false)
                  localStorage.setItem("pwa-install-dismissed", Date.now().toString())
                }}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-white/95 mb-3 leading-relaxed">
              Add to your device for instant access to all city services
            </p>
            
            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-orange-600 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-50 active:bg-white transition-all shadow-sm hover:shadow-md"
            >
              Install Now
            </button>
          </div>
        </div>
      )}

      {/* App Installed Badge */}
      {isInstalled && (
        <div className="mx-2 mt-3 mb-2 p-2.5 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 rounded-md dark:bg-green-900/40">
              <Sparkles className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs font-medium text-green-700 dark:text-green-400">
              App Installed ✓
            </p>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Quick Access */}
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Quick Access
          </h3>
          <div className="space-y-1">
            {quickAccessItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Calapan City</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Connect Platform</p>
      </div>
    </aside>
  )
}
