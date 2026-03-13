import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function themeClasses(isDark: boolean) {
  return {
    bg: isDark ? "bg-gray-900" : "bg-white",
    bgSecondary: isDark ? "bg-gray-800" : "bg-gray-100",
    bgTertiary: isDark ? "bg-gray-700" : "bg-gray-50",
    border: isDark ? "border-gray-800" : "border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    textMuted: isDark ? "text-gray-500" : "text-gray-400",
    card: isDark ? "bg-gray-900/50" : "bg-white/50",
  }
}
