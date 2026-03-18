"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MicroInteractionProps {
  children: React.ReactNode
  className?: string
  whileHover?: {
    scale?: number
    rotate?: number
    y?: number
    shadow?: boolean
  }
  whileTap?: {
    scale?: number
    y?: number
  }
  transition?: {
    type?: "spring" | "tween"
    stiffness?: number
    damping?: number
    duration?: number
  }
  onClick?: () => void
}

/**
 * Universal micro-interaction wrapper for enhanced UX
 * Adds smooth hover and tap animations to any interactive element
 */
export function MicroInteraction({
  children,
  className,
  whileHover = { scale: 1.05, y: -2, shadow: true },
  whileTap = { scale: 0.95, y: 0 },
  transition = { type: "spring", stiffness: 400, damping: 17 },
  onClick,
}: MicroInteractionProps) {
  return (
    <motion.div
      className={cn("inline-block cursor-pointer", className)}
      whileHover={
        whileHover.shadow
          ? { ...whileHover, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }
          : whileHover
      }
      whileTap={whileTap}
      transition={transition}
      onClick={onClick}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Enhanced button with micro-interactions
 */
export function InteractiveButton({
  children,
  className,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "ghost" | "outline"
}) {
  return (
    <MicroInteraction
      whileHover={{ scale: 1.08, y: -3, shadow: true }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      onClick={onClick}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 font-medium transition-colors",
          variant === "default" &&
            "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
          variant === "ghost" && "hover:bg-gray-100 dark:hover:bg-white/10",
          variant === "outline" &&
            "border-2 border-purple-500/50 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30",
          className
        )}
      >
        {children}
      </div>
    </MicroInteraction>
  )
}

/**
 * Card with subtle hover effects
 */
export function InteractiveCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <MicroInteraction
      whileHover={{ scale: 1.02, y: -4, shadow: true }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      <div
        className={cn(
          "bg-card overflow-hidden rounded-xl border p-6 transition-all",
          "hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10",
          className
        )}
      >
        {children}
      </div>
    </MicroInteraction>
  )
}

/**
 * Icon with bounce animation on hover
 */
export function InteractiveIcon({
  children,
  className,
  onClick,
  rotation = 0,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  rotation?: number
}) {
  return (
    <MicroInteraction
      whileHover={{ scale: 1.2, rotate: rotation || 0, y: -3 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
      onClick={onClick}
    >
      <div className={cn("inline-flex items-center justify-center", className)}>{children}</div>
    </MicroInteraction>
  )
}

/**
 * Floating animation for decorative elements
 */
export function FloatAnimation({
  children,
  className,
  delay = 0,
  duration = 3,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Pulse glow effect for emphasis
 */
export function PulseGlow({
  children,
  className,
  color = "purple",
  intensity = "medium",
}: {
  children: React.ReactNode
  className?: string
  color?: "purple" | "blue" | "pink" | "cyan"
  intensity?: "low" | "medium" | "high"
}) {
  const colorMap = {
    purple: "rgba(139, 92, 246, 0.5)",
    blue: "rgba(59, 130, 246, 0.5)",
    pink: "rgba(236, 72, 153, 0.5)",
    cyan: "rgba(6, 182, 212, 0.5)",
  }

  const intensityMap = {
    low: { scale: 1, opacity: 0.3 },
    medium: { scale: 1.05, opacity: 0.5 },
    high: { scale: 1.1, opacity: 0.7 },
  }

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      animate={{
        scale: [1, intensityMap[intensity].scale, 1],
        boxShadow: [
          `0 0 0 ${colorMap[color]}`,
          `0 0 20px ${colorMap[color]}`,
          `0 0 0 ${colorMap[color]}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
