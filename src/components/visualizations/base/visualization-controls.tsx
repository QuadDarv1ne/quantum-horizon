"use client"

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VisualizationControlsProps {
  isPlaying: boolean
  animationSpeed: number
  onTogglePlay: () => void
  onSpeedChange: (speed: number) => void
  onReset?: () => void
  isDark: boolean
}

export function VisualizationControls({
  isPlaying,
  animationSpeed,
  onTogglePlay,
  onSpeedChange,
  onReset,
  isDark,
}: VisualizationControlsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        onTogglePlay()
      } else if (e.code === "KeyR" && onReset) {
        e.preventDefault()
        onReset()
      }
    },
    [onTogglePlay, onReset]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const textColor = isDark ? "text-gray-400" : "text-gray-600"
  const textMuted = isDark ? "text-gray-500" : "text-gray-500"
  const bgClass = isDark ? "bg-gray-800/50" : "bg-gray-100/50"
  const buttonBg = isDark ? "bg-gray-700 hover:bg-gray-600" : ""

  return (
    <div
      className={cn("flex items-center gap-4 rounded-lg p-3 backdrop-blur-sm", bgClass)}
      role="toolbar"
      aria-label="Visualization controls"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePlay}
        className={buttonBg}
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
        aria-pressed={isPlaying}
        aria-keyshortcuts="Space"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </Button>

      <div
        className="flex flex-1 items-center gap-2"
        role="group"
        aria-label="Animation speed control"
      >
        <span className={textColor} id="speed-label">
          Speed: {animationSpeed.toFixed(1)}x
        </span>
        <Slider
          value={[animationSpeed]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={(v) => {
            onSpeedChange(v[0])
          }}
          className="flex-1"
          aria-labelledby="speed-label"
          aria-valuetext={`Animation speed ${animationSpeed.toFixed(1)} times normal speed`}
        />
      </div>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className={buttonBg}
          aria-label="Reset animation"
          aria-keyshortcuts="R"
        >
          Reset
        </Button>
      )}
      <div className={textMuted} aria-hidden="true">
        <kbd className="rounded bg-gray-700/50 px-1.5 py-0.5">Space</kbd> Play/Pause
        {onReset && (
          <>
            {" "}
            |<kbd className="rounded bg-gray-700/50 px-1.5 py-0.5">R</kbd> Reset
          </>
        )}
      </div>
    </div>
  )
}
