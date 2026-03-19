/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      console.log("PWA: Install prompt available")
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 30 seconds or on second visit
      const hasVisited = localStorage.getItem("qh_visited")
      if (hasVisited) {
        setShowPrompt(true)
      } else {
        localStorage.setItem("qh_visited", "true")
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice

      console.log(`PWA: User ${choice.outcome}`)
      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch {
      // Install failed silently
    }
  }

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      setShowPrompt(false)
      localStorage.setItem("qh_dismiss_install", "true")
    }
  }

  // Don't show if dismissed
  if (typeof window !== "undefined" && localStorage.getItem("qh_dismiss_install") === "true") {
    return null
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="bg-card fixed right-4 bottom-20 z-50 max-w-sm rounded-lg border p-4 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Установить Quantum Horizon</h4>
            <p className="text-muted-foreground text-xs">Быстрый доступ к приложению офлайн</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:bg-accent hover:text-foreground rounded p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={handleInstall} size="sm" className="flex-1">
          Установить
        </Button>
        <Button onClick={handleDismiss} variant="outline" size="sm" className="flex-1">
          Позже
        </Button>
      </div>
    </div>
  )
}
