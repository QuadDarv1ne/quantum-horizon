"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, Minimize2, Settings, Save, RotateCcw, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MicroInteraction } from "./micro-interactions"
import { cn } from "@/lib/utils"

interface PresentationModeProps {
  isActive?: boolean
  onToggle?: (active: boolean) => void
  children: React.ReactNode
  className?: string
}

export function PresentationMode({
  isActive = false,
  onToggle,
  children,
  className,
}: PresentationModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const handleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleToggle = useCallback(() => {
    onToggle?.(!isActive)
  }, [isActive, onToggle])

  const handleSavePreset = useCallback(() => {
    const preset = {
      timestamp: Date.now(),
      settings: { isFullscreen, showControls },
    }
    localStorage.setItem("presentation-preset", JSON.stringify(preset))
  }, [isFullscreen, showControls])

  const handleReset = useCallback(() => {
    localStorage.removeItem("presentation-preset")
    setIsFullscreen(false)
    setShowControls(true)
  }, [])

  return (
    <div className={cn("relative", className)}>
      {/* Floating Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-background/80 absolute top-4 right-4 z-50 flex gap-2 rounded-lg border p-2 backdrop-blur-sm"
          >
            <MicroInteraction whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                title={isActive ? "Exit presentation mode" : "Enter presentation mode"}
              >
                <Presentation className="h-4 w-4" />
              </Button>
            </MicroInteraction>

            <MicroInteraction whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </MicroInteraction>

            <MicroInteraction whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSavePreset}
                title="Save current settings as preset"
              >
                <Save className="h-4 w-4" />
              </Button>
            </MicroInteraction>

            <MicroInteraction whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset to default settings"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </MicroInteraction>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with enhanced styling for presentation mode */}
      <div
        className={cn("transition-all duration-500", isActive && "scale-105 shadow-2xl")}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {children}
      </div>

      {/* Bottom Progress Bar for Presentations */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed right-0 bottom-0 left-0 z-50 h-1 bg-gray-200 dark:bg-gray-800"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 30, ease: "linear" }}
          />
        </motion.div>
      )}
    </div>
  )
}

/**
 * Quick settings panel for presentations
 */
interface QuickSettingsProps {
  isOpen: boolean
  onClose: () => void
  settings: Record<string, any>
  onSettingChange: (key: string, value: any) => void
}

export function QuickSettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingChange,
}: QuickSettingsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-background fixed top-0 right-0 z-50 h-full w-80 overflow-y-auto border-l p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Quick Settings</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Example Settings - Customize based on needs */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Animation Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.animationSpeed || 1}
                  onChange={(e) => onSettingChange("animationSpeed", parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Slow</span>
                  <span>{settings.animationSpeed?.toFixed(1) || "1.0"}x</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Show Labels</label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.showLabels ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingChange("showLabels", true)}
                  >
                    On
                  </Button>
                  <Button
                    variant={!settings.showLabels ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingChange("showLabels", false)}
                  >
                    Off
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <div className="grid grid-cols-3 gap-2">
                  {["purple", "blue", "pink"].map((color) => (
                    <Button
                      key={color}
                      variant={settings.colorScheme === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSettingChange("colorScheme", color)}
                      className={cn(
                        "capitalize",
                        color === "purple" && "bg-purple-600 hover:bg-purple-700",
                        color === "blue" && "bg-blue-600 hover:bg-blue-700",
                        color === "pink" && "bg-pink-600 hover:bg-pink-700"
                      )}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
