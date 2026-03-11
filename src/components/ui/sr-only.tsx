"use client"

import { useEffect, useState } from "react"

/**
 * Компонент для объявления изменений скринридерам
 * Использует aria-live регионы
 */
export function SrOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">{children}</span>
  )
}

/**
 * Хук для announcement изменений скринридерам
 */
export function useAnnounce() {
  const [message, setMessage] = useState<string>("")

  const announce = (
    newMessage: string,
    priority: "polite" | "assertive" = "polite",
  ) => {
    setMessage("")
    // Небольшая задержка для гарантированного обновления
    setTimeout(() => {
      setMessage(newMessage)
    }, priority === "assertive" ? 0 : 100)
  }

  return { message, announce, LiveRegion: () => (
    <LiveRegion message={message} />
  ) }
}

interface LiveRegionProps {
  message: string
  priority?: "polite" | "assertive"
}

/**
 * ARIA live регион для announcements
 */
export function LiveRegion({ message, priority = "polite" }: LiveRegionProps) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * Компонент обёртка для announcements
 */
export function Announcer({
  message,
  priority = "polite",
}: { message: string; priority?: "polite" | "assertive" }) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
