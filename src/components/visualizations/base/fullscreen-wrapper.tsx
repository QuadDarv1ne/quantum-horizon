"use client"

import { useState, useEffect, useRef } from "react"

interface FullscreenWrapperProps {
  children: React.ReactNode
  title: string
  isDark: boolean
}

export function FullscreenWrapper({ children, title, isDark }: FullscreenWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Handle F key for fullscreen toggle and Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen])

  // Focus close button when fullscreen opens
  useEffect(() => {
    if (isFullscreen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isFullscreen])

  return (
    <>
      {/* Fullscreen button */}
      <button
        onClick={() => {
          setIsFullscreen(true)
        }}
        className={`absolute top-2 right-2 z-10 rounded-lg p-1.5 transition-all ${
          isDark
            ? "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white"
            : "bg-white/80 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        } backdrop-blur-sm`}
        title="Fullscreen (F)"
        aria-label={`Open ${title} in fullscreen mode`}
        aria-expanded={isFullscreen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => {
            setIsFullscreen(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullscreen-title"
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 ${isDark ? "bg-black/95" : "bg-white/95"} backdrop-blur-sm`}
            aria-hidden="true"
          />

          {/* Content container */}
          <div
            className={`relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-xl shadow-2xl ${
              isDark ? "border border-gray-700 bg-gray-900" : "border border-gray-200 bg-white"
            }`}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 ${
                isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
              }`}
            >
              <h3
                id="fullscreen-title"
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {title}
              </h3>
              <button
                ref={closeButtonRef}
                onClick={() => {
                  setIsFullscreen(false)
                }}
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-label="Close fullscreen view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Visualization content - enlarged */}
            <div className="p-4">
              <div className="scale-100 transform">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
