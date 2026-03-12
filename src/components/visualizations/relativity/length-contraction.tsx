"use client"

import { useMemo, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface LengthContractionVisualizationProps {
  isDark: boolean
}

export function LengthContractionVisualization({ isDark }: LengthContractionVisualizationProps) {
  const [velocity, setVelocity] = useState(0.8)
  const [showGrid, setShowGrid] = useState(true)

  const gamma = useMemo(() => 1 / Math.sqrt(1 - velocity * velocity), [velocity])
  const contractedLength = useMemo(() => 100 / gamma, [gamma])

  return (
    <div className="space-y-4">
      <div
        className="relative h-40 rounded-lg overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #0a0515 0%, #150a20 100%)"
            : "linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 100%)",
        }}
      >
        {/* Grid */}
        {showGrid && (
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[...Array(20)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={`${String(i * 5)}%`}
                y1="0"
                x2={`${String(i * 5)}%`}
                y2="100%"
                stroke={isDark ? "#444" : "#888"}
                strokeWidth="0.5"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={`${String(i * 10)}%`}
                x2="100%"
                y2={`${String(i * 10)}%`}
                stroke={isDark ? "#444" : "#888"}
                strokeWidth="0.5"
              />
            ))}
          </svg>
        )}

        {/* Moving object */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div
            className={`h-8 rounded ${
              isDark
                ? "bg-gradient-to-r from-blue-500 to-blue-400"
                : "bg-gradient-to-r from-blue-600 to-blue-400"
            }`}
            style={{ width: `${String(contractedLength)}px` }}
          />
          <div className={`text-center text-xs mt-1 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
            Moving: {contractedLength.toFixed(1)} m
          </div>
        </div>

        {/* Stationary reference */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div
            className={`h-8 rounded ${
              isDark
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : "bg-gradient-to-r from-green-600 to-green-400"
            }`}
            style={{ width: "100px" }}
          />
          <div
            className={`text-center text-xs mt-1 ${isDark ? "text-green-300" : "text-green-700"}`}
          >
            At rest: 100 m
          </div>
        </div>

        {/* Velocity arrow */}
        <div
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-sm ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`}
        >
          → v = {String((velocity * 100).toFixed(0))}% c
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={isDark ? "text-orange-400" : "text-orange-700"}>Velocity</span>
          <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            {String((velocity * 100).toFixed(0))}% c
          </span>
        </div>
        <Slider
          value={[velocity * 100]}
          onValueChange={(v) => {
            setVelocity(v[0] / 100)
          }}
          min={0}
          max={99}
          step={1}
        />
      </div>

      <Button
        onClick={() => {
          setShowGrid(!showGrid)
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        {showGrid ? "🔲 Hide grid" : "🔲 Show grid"}
      </Button>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-purple-900/20 border-purple-500/20" : "bg-purple-50 border-purple-200"
        }`}
      >
        <div className={`font-semibold mb-1 ${isDark ? "text-purple-300" : "text-purple-700"}`}>
          📐 Length contraction formula:
        </div>
        <div className={`font-mono text-center ${isDark ? "text-white" : "text-gray-900"}`}>
          L = L₀ / γ = L₀ · √(1 - v²/c²)
        </div>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          The object contracts only in the direction of motion! Transverse dimensions do not change.
        </p>
      </div>
    </div>
  )
}
