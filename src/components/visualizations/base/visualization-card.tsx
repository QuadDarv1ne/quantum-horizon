"use client"

import { FullscreenWrapper } from "./fullscreen-wrapper"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type CardColor = "purple" | "blue" | "green" | "orange" | "yellow" | "red" | "cyan" | "pink"

interface VisualizationCardProps {
  title: string
  description: string
  children: React.ReactNode
  color: CardColor
  isDark: boolean
}

const borderColors: Record<CardColor, string> = {
  purple: "border-purple-500/30",
  blue: "border-blue-500/30",
  green: "border-green-500/30",
  orange: "border-orange-500/30",
  yellow: "border-yellow-500/30",
  red: "border-red-500/30",
  cyan: "border-cyan-500/30",
  pink: "border-pink-500/30",
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
    <Card className={`${borderColors[color]} ${bgColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${textColors[color]}`}>{title}</CardTitle>
        <CardDescription className={`text-xs ${descColor}`}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <FullscreenWrapper title={title} isDark={isDark}>
          <ErrorBoundary name={`${title}Visualization`}>{children}</ErrorBoundary>
        </FullscreenWrapper>
      </CardContent>
    </Card>
  )
}
