"use client"

import { FullscreenWrapper } from "./fullscreen-wrapper"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface VisualizationCardProps {
  title: string
  description: string
  children: React.ReactNode
  color: string
  isDark: boolean
}

export function VisualizationCard({
  title,
  description,
  children,
  color,
  isDark,
}: VisualizationCardProps) {
  const borderColors: Record<string, string> = {
    purple: isDark ? "border-purple-500/30" : "border-purple-300",
    blue: isDark ? "border-blue-500/30" : "border-blue-300",
    green: isDark ? "border-green-500/30" : "border-green-300",
    orange: isDark ? "border-orange-500/30" : "border-orange-300",
    yellow: isDark ? "border-yellow-500/30" : "border-yellow-300",
    red: isDark ? "border-red-500/30" : "border-red-300",
    cyan: isDark ? "border-cyan-500/30" : "border-cyan-300",
    pink: isDark ? "border-pink-500/30" : "border-pink-300",
  }

  const textColors: Record<string, string> = {
    purple: isDark ? "text-purple-400" : "text-purple-600",
    blue: isDark ? "text-blue-400" : "text-blue-600",
    green: isDark ? "text-green-400" : "text-green-600",
    orange: isDark ? "text-orange-400" : "text-orange-600",
    yellow: isDark ? "text-yellow-400" : "text-yellow-600",
    red: isDark ? "text-red-400" : "text-red-600",
    cyan: isDark ? "text-cyan-400" : "text-cyan-600",
    pink: isDark ? "text-pink-400" : "text-pink-600",
  }

  const borderColor = borderColors[color] || borderColors.purple
  const textColor = textColors[color] || textColors.purple

  return (
    <Card className={`${borderColor} bg-gradient-to-br from-gray-900 to-gray-950`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${textColor}`}>{title}</CardTitle>
        <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
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
