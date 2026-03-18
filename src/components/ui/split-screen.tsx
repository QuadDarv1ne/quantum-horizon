"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Columns, X, ArrowRightLeft, Maximize, Minimize, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useVisualizationStore, type VisualizationType } from "@/stores/visualization-store"
import { cn } from "@/lib/utils"

// Список визуализаций, доступных для сравнения
const COMPARABLE_VISUALIZATIONS: { value: VisualizationType; label: string }[] = [
  { value: "waveFunction", label: "Волновая функция" },
  { value: "uncertainty", label: "Принцип неопределённости" },
  { value: "tunneling", label: "Туннелирование" },
  { value: "timeDilation", label: "Замедление времени" },
  { value: "lengthContraction", label: "Сокращение длины" },
  { value: "massEnergy", label: "E = mc²" },
  { value: "blackHole", label: "Чёрная дыра" },
  { value: "doubleSlit", label: "Две щели" },
  { value: "darkMatter", label: "Тёмная материя" },
]

interface SplitScreenProps {
  leftVisualization?: VisualizationType
  rightVisualization?: VisualizationType
}

export function SplitScreen({
  leftVisualization: initialLeft,
  rightVisualization: initialRight,
}: SplitScreenProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [leftVis, setLeftVis] = useState<VisualizationType | null>(initialLeft || null)
  const [rightVis, setRightVis] = useState<VisualizationType | null>(initialRight || null)
  const [splitPosition, setSplitPosition] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const setSelectedVisualization = useVisualizationStore((state) => state.setSelectedVisualization)

  const handleSwap = useCallback(() => {
    const temp = leftVis
    setLeftVis(rightVis)
    setRightVis(temp)
  }, [leftVis, rightVis])

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const container = e.currentTarget as HTMLElement
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      setSplitPosition(Math.max(20, Math.min(80, percentage)))
    },
    [isDragging]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        // При закрытии возвращаемся к обычной визуализации
        if (leftVis) {
          setSelectedVisualization(leftVis)
        }
      }
    },
    [leftVis, setSelectedVisualization]
  )

  const handleStartComparison = useCallback(() => {
    if (leftVis && rightVis) {
      // Открываем split-screen режим
    }
  }, [leftVis, rightVis])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns className="h-4 w-4" />
          Сравнить
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "flex w-full max-w-[95vw] flex-col overflow-hidden p-0",
          isFullscreen ? "h-[95vh]" : "h-[80vh]"
        )}
      >
        <DialogHeader className="flex-shrink-0 border-b p-4">
          <DialogTitle className="sr-only">Сравнение визуализаций</DialogTitle>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex flex-1 items-center gap-2">
                <Select
                  value={leftVis || ""}
                  onValueChange={(v) => setLeftVis(v as VisualizationType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Левая" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPARABLE_VISUALIZATIONS.map((vis) => (
                      <SelectItem
                        key={vis.value}
                        value={vis.value}
                        disabled={vis.value === rightVis}
                      >
                        {vis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwap}
                disabled={!leftVis || !rightVis}
                className="shrink-0"
                aria-label="Поменять местами"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>

              <div className="flex flex-1 items-center gap-2">
                <Select
                  value={rightVis || ""}
                  onValueChange={(v) => setRightVis(v as VisualizationType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Правая" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPARABLE_VISUALIZATIONS.map((vis) => (
                      <SelectItem
                        key={vis.value}
                        value={vis.value}
                        disabled={vis.value === leftVis}
                      >
                        {vis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {!leftVis || !rightVis ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="space-y-4 text-center">
              <Columns className="text-muted-foreground mx-auto h-16 w-16" />
              <h3 className="text-xl font-semibold">Выберите две визуализации для сравнения</h3>
              <p className="text-muted-foreground">
                Используйте выпадающие списки выше для выбора визуализаций
              </p>
            </div>
          </div>
        ) : (
          <div
            className="relative flex-1 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute inset-0 flex">
              {/* Левая панель */}
              <div className="bg-muted/30 relative" style={{ width: `${splitPosition}%` }}>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="space-y-2 text-center">
                    <h4 className="text-lg font-semibold">
                      {COMPARABLE_VISUALIZATIONS.find((v) => v.value === leftVis)?.label}
                    </h4>
                    <p className="text-muted-foreground text-sm">Визуализация будет здесь</p>
                    {/* Здесь будет компонент визуализации */}
                  </div>
                </div>
              </div>

              {/* Разделитель */}
              <div
                className="bg-primary/50 hover:bg-primary flex w-1 cursor-col-resize items-center justify-center transition-colors"
                onMouseDown={handleMouseDown}
              >
                <GripVertical className="h-6 w-6 text-white/50" />
              </div>

              {/* Правая панель */}
              <div className="bg-muted/30 relative" style={{ width: `${100 - splitPosition}%` }}>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="space-y-2 text-center">
                    <h4 className="text-lg font-semibold">
                      {COMPARABLE_VISUALIZATIONS.find((v) => v.value === rightVis)?.label}
                    </h4>
                    <p className="text-muted-foreground text-sm">Визуализация будет здесь</p>
                    {/* Здесь будет компонент визуализации */}
                  </div>
                </div>
              </div>
            </div>

            {/* Индикатор положения */}
            <div className="bg-background/80 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-sm backdrop-blur">
              {Math.round(splitPosition)}% / {Math.round(100 - splitPosition)}%
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
