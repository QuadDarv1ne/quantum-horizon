"use client"

import { useEffect, useState } from "react"
import { createLogger } from "@/lib/logger"

const logger = createLogger("service-worker")

export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      return
    }

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        logger.log("Service Worker registered:", registration.scope)

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })

        // Handle updates from service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (event.data?.type === "UPDATE_AVAILABLE") {
            setUpdateAvailable(true)
          }
        })
      } catch {
        // Service Worker registration failed silently
      }
    }

    void registerSW()

    // Online/offline status
    const handleOnline = () => {
      setIsOnline(true)
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const updateServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready
      registration.waiting?.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  return (
    <>
      {/* Update notification */}
      {updateAvailable && (
        <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-indigo-600 p-4 text-white shadow-lg">
          <p className="text-sm font-medium">Доступно обновление!</p>
          <button
            onClick={() => {
              void updateServiceWorker()
            }}
            className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-gray-100"
          >
            Обновить
          </button>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-amber-600 px-4 py-2 text-white shadow-lg">
          <p className="text-sm font-medium">⚠️ Вы офлайн</p>
        </div>
      )}
    </>
  )
}
