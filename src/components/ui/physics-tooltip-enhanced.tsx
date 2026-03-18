"use client"

import { useState } from "react"
import { Info, X, ExternalLink, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PhysicsTooltipProps {
  title: string
  description: string
  formula?: string
  learnMoreUrl?: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function PhysicsTooltip({
  title,
  description,
  formula,
  learnMoreUrl,
  children,
  side = "top",
  className,
}: PhysicsTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-0 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-0 mr-2",
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute z-50 w-72 transform transition-all duration-200",
          "animate-in fade-in zoom-in-95",
          isVisible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          positionClasses[side]
        )}
        role="tooltip"
      >
        {/* Content */}
        <div
          className={cn(
            "overflow-hidden rounded-lg border shadow-lg",
            "bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10",
            "backdrop-blur-xl"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">{title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={() => setIsVisible(false)}
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* Body */}
          <div className="space-y-3 px-4 py-3">
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

            {formula && (
              <div className="rounded-md bg-black/20 p-3 text-center font-mono text-xs">
                {formula}
              </div>
            )}

            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-purple-400 transition-colors hover:text-purple-300"
              >
                <BookOpen className="size-3" />
                Learn more
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div
          className={cn(
            "absolute size-2 rotate-45 border-r border-b",
            side === "top" && "-bottom-1 left-1/2 -translate-x-1/2 bg-purple-500/10",
            side === "right" && "top-2 -left-1 bg-purple-500/10",
            side === "bottom" && "-top-1 left-1/2 -translate-x-1/2 bg-purple-500/10",
            side === "left" && "top-2 -right-1 bg-purple-500/10"
          )}
        />
      </div>
    </div>
  )
}

// Enhanced tooltip trigger component
interface TooltipTriggerProps {
  children: React.ReactNode
  className?: string
}

export function TooltipTrigger({ children, className }: TooltipTriggerProps) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex cursor-help items-center gap-1",
        "hover:text-foreground transition-colors",
        className
      )}
    >
      {children}
      <Info className="size-3 opacity-50" />
    </span>
  )
}
