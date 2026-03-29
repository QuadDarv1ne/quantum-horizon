"use client"

import { useState, useEffect } from "react"
import { useReportWebVitals } from "next/web-vitals"
import { Gauge, Activity, Clock, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"
import { createLogger } from "@/lib/logger"

const logger = createLogger("web-vitals")

interface MetricValue {
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  label: string
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export function WebVitals() {
  const [metrics, setMetrics] = useState<MetricValue[]>([])
  const [isDevVisible, setIsDevVisible] = useState(false)

  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      logger.log("[Web Vitals]", metric.name, metric.value)

      // Update metrics for display
      setMetrics((prev) => {
        const existing = prev.findIndex((m) => m.name === metric.name)
        const newValue: MetricValue = {
          name: metric.name,
          value: Number(metric.value),
          rating: metric.rating as "good" | "needs-improvement" | "poor",
          label: getMetricLabel(metric.name, Number(metric.value)),
        }

        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = newValue
          return updated
        }
        return [...prev, newValue]
      })
    }

    // Send to analytics endpoint
    const body = {
      dsn: process.env.NEXT_PUBLIC_WEB_VITALS_DSN,
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating:
        metric.rating === "good"
          ? "good"
          : metric.rating === "needs-improvement"
            ? "needs-improvement"
            : "poor",
      delta: metric.delta,
      navigationType: metric.navigationType,
    }

    // Send to /api/web-vitals endpoint if configured
    if (process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT) {
      navigator.sendBeacon(process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT, JSON.stringify(body))
    }
  })

  // Show dev panel with Ctrl+Shift+V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        setIsDevVisible((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (process.env.NODE_ENV !== "development" || !isDevVisible) return null

  return (
    <div className="fixed right-4 bottom-4 z-[9999] w-80">
      <div className="bg-card overflow-hidden rounded-lg border shadow-xl">
        {/* Header */}
        <div className="bg-muted flex items-center justify-between border-b px-4 py-2">
          <h3 className="text-sm font-semibold">Web Vitals</h3>
          <button
            onClick={() => {
              setIsDevVisible(false)
            }}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            ✕
          </button>
        </div>

        {/* Metrics */}
        <div className="space-y-2 p-4">
          {metrics.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm">
              No metrics yet. Interact with the page...
            </p>
          ) : (
            metrics.map((metric) => <MetricDisplay key={metric.name} metric={metric} />)
          )}
        </div>

        {/* Info */}
        <div className="bg-muted/50 border-t px-4 py-2">
          <p className="text-muted-foreground text-xs">Press Ctrl+Shift+V to toggle this panel</p>
        </div>
      </div>
    </div>
  )
}

function getMetricLabel(name: string, value: number): string {
  switch (name) {
    case "FCP":
      return `${(value / 1000).toFixed(2)}s`
    case "LCP":
      return `${(value / 1000).toFixed(2)}s`
    case "FID":
      return `${value.toFixed(0)}ms`
    case "CLS":
      return value.toFixed(3)
    case "INP":
      return `${value.toFixed(0)}ms`
    default:
      return value.toString()
  }
}

interface MetricDisplayProps {
  metric: MetricValue
}

function MetricDisplay({ metric }: MetricDisplayProps) {
  const config = getMetricConfig(metric.name)
  const ratingColor = {
    good: "text-green-500",
    "needs-improvement": "text-yellow-500",
    poor: "text-red-500",
  }[metric.rating]

  return (
    <div className="flex items-center gap-3 rounded-md border p-2">
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          ratingColor,
          "bg-current/10"
        )}
      >
        {config.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{config.label}</span>
          <span className={cn("text-xs font-bold", ratingColor)}>{metric.label}</span>
        </div>
        <div className="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={cn("h-full transition-all duration-500", ratingColor, "bg-current")}
            style={{ width: `${getPercentage(metric.value, metric.name).toFixed(1)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function getMetricConfig(name: string) {
  const configs: Record<string, { label: string; icon: React.ReactNode }> = {
    FCP: { label: "First Contentful Paint", icon: <Gauge className="size-4" /> },
    LCP: { label: "Largest Contentful Paint", icon: <Activity className="size-4" /> },
    FID: { label: "First Input Delay", icon: <Clock className="size-4" /> },
    CLS: { label: "Cumulative Layout Shift", icon: <LayoutList className="size-4" /> },
    INP: { label: "Interaction to Next Paint", icon: <Clock className="size-4" /> },
  }
  return configs[name] ?? { label: name, icon: <Gauge className="size-4" /> }
}

function getPercentage(value: number, name: string): number {
  const thresholds: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1000, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },
  }

  const config = thresholds[name]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (config == null) return 50

  if (value <= config.good) return Math.min(100, (value / config.good) * 100)
  if (value >= config.poor) return 100
  return 50 + ((value - config.good) / (config.poor - config.good)) * 50
}
