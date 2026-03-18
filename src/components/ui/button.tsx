import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Enhanced button variants with micro-interactions
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 active:scale-95 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-purple-500/30 bg-transparent shadow-sm transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 hover:border-purple-500/50 active:scale-95 dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400 shadow-sm transition-all duration-300 hover:scale-105 hover:from-purple-500/20 hover:to-blue-500/20 active:scale-95",
        ghost:
          "transition-all duration-300 hover:scale-105 hover:bg-purple-500/10 hover:text-purple-600 active:scale-95 dark:hover:bg-purple-500/10 dark:hover:text-purple-400",
        link: "text-primary underline-offset-4 transition-all duration-300 hover:scale-105 hover:underline hover:text-purple-600 dark:hover:text-purple-400",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
