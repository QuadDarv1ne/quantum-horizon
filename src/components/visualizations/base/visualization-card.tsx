"use client"

import { FullscreenWrapper } from "./fullscreen-wrapper"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cardHoverEffects } from "@/lib/micro-interactions"
import { cn } from "@/lib/utils"

type CardColor = "purple" | "blue" | "green" | "orange" | "yellow" | "red" | "cyan" | "pink"

interface VisualizationCardProps {
  title: string
  description: string
  children: React.ReactNode
  color: CardColor
  isDark: boolean
}

const borderColors: Record<CardColor, string> = {
  purple: "border-purple-500/30 hover:border-purple-500/50",
  blue: "border-blue-500/30 hover:border-blue-500/50",
  green: "border-green-500/30 hover:border-green-500/50",
  orange: "border-orange-500/30 hover:border-orange-500/50",
  yellow: "border-yellow-500/30 hover:border-yellow-500/50",
  red: "border-red-500/30 hover:border-red-500/50",
  cyan: "border-cyan-500/30 hover:border-cyan-500/50",
  pink: "border-pink-500/30 hover:border-pink-500/50",
}

const textColors: Record<CardColor, string> = {
  purple: "text-purple-400 dark:text-purple-600",
  blue: "text-blue-400 dark:text-blue-600",
  green: "text-green-400 dark:text-green-600",
  orange: "text-orange-400 dark:text-orange-600",
  yellow: "text-yellow-400 dark:text-yellow-600",
  red: "text-red-400 dark:text-red-600",
  cyan: "text-cyan-400 dark:text-cyan-600",
  pink: "text-pink-400 dark:text-pink-600",
}

const bgGradients: Record<CardColor, string> = {
  purple: "from-purple-500/5 to-blue-500/5",
  blue: "from-blue-500/5 to-cyan-500/5",
  green: "from-green-500/5 to-emerald-500/5",
  orange: "from-orange-500/5 to-amber-500/5",
  yellow: "from-yellow-500/5 to-orange-500/5",
  red: "from-red-500/5 to-pink-500/5",
  cyan: "from-cyan-500/5 to-blue-500/5",
  pink: "from-pink-500/5 to-rose-500/5",
}

export function VisualizationCard({
  title,
  description,
  children,
  color,
  isDark,
}: VisualizationCardProps) {
  const bgColor = isDark ? "bg-gradient-to-br from-gray-900 to-gray-950" : "bg-white"

  const descColor = isDark ? "" : "text-gray-600"

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all duration-500",
        borderColors[color],
        bgColor,
        cardHoverEffects({ effect: "combined" })
      )}
      role="region"
      aria-labelledby={`card-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
      aria-describedby={`card-desc-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradients[color]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-px bg-gradient-to-r ${bgGradients[color]} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`}
      />

      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full bg-gradient-to-r ${bgGradients[color].replace("from-", "from-").split(" ")[0].replace("/5", "")} animate-pulse`}
          />
          <CardTitle
            id={`card-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className={`text-lg transition-colors duration-300 ${textColors[color]}`}
          >
            {title}
          </CardTitle>
        </div>
        <CardDescription
          id={`card-desc-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className={`relative text-xs transition-colors duration-300 ${descColor}`}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <FullscreenWrapper title={title} isDark={isDark}>
          <ErrorBoundary name={`${title}Visualization`}>{children}</ErrorBoundary>
        </FullscreenWrapper>
      </CardContent>
    </Card>
  )
}
