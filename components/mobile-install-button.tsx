"use client"

import { useState, useEffect } from "react"
import { Download, X, Sparkles } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function MobileInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    console.log("Mobile install button effect running")
    
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
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-mobile")
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        console.log("Install prompt was recently dismissed on mobile, days since:", daysSinceDismissed)
        return
      }
    }

    const handler = (e: Event) => {
      console.log("beforeinstallprompt event fired on mobile")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      console.log("App installed successfully from mobile")
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
      localStorage.removeItem("pwa-install-dismissed-mobile")
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

  const handleDismiss = () => {
    setShowInstallButton(false)
    localStorage.setItem("pwa-install-dismissed-mobile", Date.now().toString())
    console.log("Install prompt dismissed on mobile")
  }

  if (!showInstallButton || isInstalled) return null

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Install Calapan Connect</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="text-sm text-white/95">Quick Access</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-white/95 mb-4 leading-relaxed">
            Add to your device for instant access to all city services
          </p>
          
          <button
            onClick={handleInstallClick}
            className="w-full bg-white text-orange-600 px-4 py-3 rounded-lg text-base font-bold hover:bg-orange-50 active:scale-95 transition-all shadow-lg"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  )
}
