"use client"

import { useEffect, useState } from "react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
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

  if (isOnline) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      <div className="max-w-md p-8 text-center">
        <div className="mb-4 text-6xl">📡</div>
        <h1 className="mb-4 text-3xl font-bold text-white">Нет соединения</h1>
        <p className="mb-6 text-gray-300">
          Похоже, вы потеряли соединение с интернетом. Не волнуйтесь — некоторые страницы доступны
          офлайн.
        </p>
        <button
          onClick={() => {
            window.location.reload()
          }}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Попробовать снова
        </button>
        <div className="mt-8 rounded-lg bg-gray-800/50 p-4">
          <p className="text-sm text-gray-400">
            💡 Совет: Включите PWA для доступа к офлайн режиму
          </p>
        </div>
      </div>
    </div>
  )
}
