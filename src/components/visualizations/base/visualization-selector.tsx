"use client"

import { Button } from "@/components/ui/button"
import type { VisualizationType } from "@/stores/visualization-store"

interface VisualizationSelectorProps {
  selected: VisualizationType | null
  onSelect: (type: VisualizationType) => void
  isDark: boolean
}

interface VisualizationOption {
  id: VisualizationType
  label: string
  icon: string
}

const quantumVisualizations: VisualizationOption[] = [
  { id: "waveFunction", label: "Wave Function", icon: "🌊" },
  { id: "uncertainty", label: "Uncertainty", icon: "📐" },
  { id: "tunneling", label: "Tunneling", icon: "🚧" },
  { id: "doubleSlit", label: "Double Slit", icon: "🔬" },
]

const relativityVisualizations: VisualizationOption[] = [
  { id: "timeDilation", label: "Time Dilation", icon: "⏱️" },
  { id: "lengthContraction", label: "Length", icon: "📏" },
  { id: "massEnergy", label: "E = mc²", icon: "💥" },
]

const cosmosVisualizations: VisualizationOption[] = [
  { id: "hrDiagram", label: "HR Diagram", icon: "📊" },
  { id: "neutronStar", label: "Neutron Star", icon: "💫" },
  { id: "blackHole", label: "Black Hole", icon: "🕳️" },
  { id: "darkMatter", label: "Dark Matter", icon: "🌀" },
]

export function VisualizationSelector({
  selected,
  onSelect,
  isDark,
}: VisualizationSelectorProps) {
  const buttonClass = (isActive: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
      isActive
        ? isDark
          ? "bg-blue-600 text-white"
          : "bg-blue-500 text-white"
        : isDark
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }`

  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ⚛️ Quantum
        </h3>
        <div className="flex flex-wrap gap-2">
          {quantumVisualizations.map((viz) => (
            <Button
              key={viz.id}
              variant="ghost"
              size="sm"
              onClick={() => { onSelect(viz.id) }}
              className={buttonClass(selected === viz.id)}
            >
              <span>{viz.icon}</span>
              <span className="text-xs">{viz.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          🚀 Relativity
        </h3>
        <div className="flex flex-wrap gap-2">
          {relativityVisualizations.map((viz) => (
            <Button
              key={viz.id}
              variant="ghost"
              size="sm"
              onClick={() => { onSelect(viz.id) }}
              className={buttonClass(selected === viz.id)}
            >
              <span>{viz.icon}</span>
              <span className="text-xs">{viz.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3
          className={`text-sm font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          🌌 Cosmos
        </h3>
        <div className="flex flex-wrap gap-2">
          {cosmosVisualizations.map((viz) => (
            <Button
              key={viz.id}
              variant="ghost"
              size="sm"
              onClick={() => { onSelect(viz.id) }}
              className={buttonClass(selected === viz.id)}
            >
              <span>{viz.icon}</span>
              <span className="text-xs">{viz.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
