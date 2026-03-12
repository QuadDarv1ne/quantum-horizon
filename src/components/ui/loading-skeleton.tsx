"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "image" | "chart" | "visualization"
  width?: string | number
  height?: string | number
}

/**
 * Универсальный Skeleton для загрузки
 */
export function LoadingSkeleton({
  className = "",
  variant = "card",
  width = "100%",
  height = "auto",
}: LoadingSkeletonProps) {
  const baseStyles = "animate-pulse rounded-md bg-slate-800/50"

  const variantStyles = {
    card: "h-32 w-full",
    text: "h-4 w-full max-w-[300px]",
    image: "aspect-video w-full",
    chart: "h-64 w-full",
    visualization: "h-56 w-full rounded-lg",
  }

  return (
    <Skeleton
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
      role="status"
    />
  )
}

/**
 * Skeleton для карточки визуализации
 */
export function VisualizationCardSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton variant="visualization" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="h-6 w-3/4" />
        <LoadingSkeleton variant="text" className="h-4 w-full" />
        <LoadingSkeleton variant="text" className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <LoadingSkeleton variant="card" className="h-10 flex-1" />
        <LoadingSkeleton variant="card" className="h-10 w-20" />
      </div>
    </div>
  )
}

/**
 * Skeleton для списка элементов
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <LoadingSkeleton variant="image" className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" className="h-4 w-3/4" />
            <LoadingSkeleton variant="text" className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton для таблицы
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={i} variant="text" className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={colIndex} variant="text" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton для графика/диаграммы
 */
export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <LoadingSkeleton variant="text" className="h-6 w-1/4" />
        <LoadingSkeleton variant="text" className="h-6 w-1/6" />
      </div>
      <LoadingSkeleton variant="chart" />
      <div className="flex justify-between">
        <LoadingSkeleton variant="text" className="h-4 w-1/6" />
        <LoadingSkeleton variant="text" className="h-4 w-1/6" />
        <LoadingSkeleton variant="text" className="h-4 w-1/6" />
      </div>
    </div>
  )
}

/**
 * Skeleton для страницы с контентом
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton variant="text" className="h-10 w-1/2" />
      <LoadingSkeleton variant="text" className="h-6 w-3/4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <VisualizationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Full-screen загрузка
 */
export function FullScreenLoader({ message = "Загрузка..." }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50"
      role="status"
      aria-label={message}
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-indigo-500/50 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-slate-400 animate-pulse">{message}</p>
    </div>
  )
}

/**
 * Inline загрузка для текста
 */
export function InlineLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  )
}
