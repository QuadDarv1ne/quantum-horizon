"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

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
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg ${
        isDark ? "bg-gray-800/50" : "bg-gray-100/50"
      } backdrop-blur-sm`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onTogglePlay()}
        className={isDark ? "bg-gray-700 hover:bg-gray-600" : ""}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
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
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </Button>

      <div className="flex items-center gap-2 flex-1">
        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Speed: {animationSpeed.toFixed(1)}x
        </span>
        <Slider
          value={[animationSpeed]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={(v) => onSpeedChange(v[0])}
          className="flex-1"
        />
      </div>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className={isDark ? "bg-gray-700 hover:bg-gray-600" : ""}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
