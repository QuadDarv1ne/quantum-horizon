"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface VisualizationLoaderProps {
  className?: string
}

export function VisualizationLoader({ className }: VisualizationLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex h-[400px] w-full flex-col overflow-hidden rounded-xl border",
        "bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5",
        className
      )}
    >
      {/* Animated gradient overlay */}
      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Canvas placeholder */}
      <div className="relative flex-1">
        <Skeleton className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-lg" />

        {/* Floating particles animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-2">
            <div className="size-2 animate-bounce rounded-full bg-purple-500/50 delay-0" />
            <div className="size-2 animate-bounce rounded-full bg-blue-500/50 delay-100" />
            <div className="size-2 animate-bounce rounded-full bg-pink-500/50 delay-200" />
          </div>
        </div>
      </div>

      {/* Controls placeholder */}
      <div className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-6 w-32 rounded-md" />
      </div>
    </div>
  )
}

interface CardLoaderProps {
  className?: string
}

export function CardLoader({ className }: CardLoaderProps) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col overflow-hidden rounded-xl border p-4",
        "shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <VisualizationLoader className="min-h-[300px]" />
      </div>
    </div>
  )
}

interface SectionLoaderProps {
  title?: string
  cards?: number
  className?: string
}

export function SectionLoader({ title, cards = 3, className }: SectionLoaderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Section header */}
      {title && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <CardLoader key={i} />
        ))}
      </div>
    </div>
  )
}
