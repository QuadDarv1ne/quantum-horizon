import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Enhanced button variants with micro-interactions
 * Includes scale, shadow, and glow effects
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 active:scale-95",
        outline:
          "border-2 bg-transparent hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all duration-300",
        secondary:
          "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 shadow-sm hover:shadow-md hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Micro-interaction utilities
 */
export const microInteractions = {
  // Scale effects
  scale: {
    hover: "hover:scale-105",
    active: "active:scale-95",
    tap: "active:scale-90",
  },
  
  // Shadow effects
  shadow: {
    glow: "hover:shadow-lg hover:shadow-purple-500/25",
    elevation: "hover:-translate-y-0.5 hover:shadow-xl",
    pulse: "animate-pulse-shadow",
  },
  
  // Gradient effects
  gradient: {
    shift: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600",
    shimmer: "animate-shimmer",
  },
  
  // Opacity effects
  opacity: {
    fade: "hover:opacity-90",
    highlight: "hover:opacity-100 opacity-70",
  },
}

/**
 * Card hover effects
 */
export const cardHoverEffects = cva(
  "transition-all duration-300",
  {
    variants: {
      effect: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-xl",
        glow: "hover:shadow-2xl hover:shadow-purple-500/20",
        border: "hover:border-purple-500/50 hover:shadow-lg",
        gradient: "hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10",
        combined: "hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50",
      },
    },
    defaultVariants: {
      effect: "lift",
    },
  }
)

/**
 * Icon animation utilities
 */
export const iconAnimations = {
  spin: "hover:rotate-180 transition-transform duration-500",
  bounce: "hover:animate-bounce",
  pulse: "hover:animate-pulse",
  shake: "hover:animate-shake",
  wiggle: "hover:animate-wiggle",
}

/**
 * Text gradient effects
 */
export const textGradientEffects = cva(
  "bg-clip-text text-transparent transition-all duration-300",
  {
    variants: {
      gradient: {
        purple: "bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-300 hover:to-purple-500",
        blue: "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500",
        cosmos: "bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 hover:via-blue-300",
        fire: "bg-gradient-to-r from-orange-400 to-red-500 hover:from-yellow-300 hover:to-red-400",
      },
    },
    defaultVariants: {
      gradient: "purple",
    },
  }
)

export function cnMicro(...classes: Array<string | undefined>) {
  return cn(...classes)
}
