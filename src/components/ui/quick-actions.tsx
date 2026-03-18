"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, Lightbulb, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MicroInteraction } from "./micro-interactions"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
  className?: string
}

/**
 * Floating Quick Actions - Always accessible utilities
 */
export function QuickActions({ className }: QuickActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show scroll-to-top button when scrolled down more than 300px
      setShowScrollTop(currentScrollY > 300)

      // Auto-hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 500) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openFeedback = () => {
    // TODO: Implement feedback modal
    console.log("Opening feedback...")
  }

  const openHelp = () => {
    // TODO: Implement help/tour
    console.log("Opening help...")
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn("fixed right-6 bottom-6 z-40 flex flex-col gap-2", className)}
        >
          {/* Scroll to Top */}
          <AnimatePresence>
            {showScrollTop && (
              <MicroInteraction whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  onClick={scrollToTop}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-700 hover:to-blue-700"
                  title="Scroll to top"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </MicroInteraction>
            )}
          </AnimatePresence>

          {/* Help / Tips */}
          <MicroInteraction whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              onClick={openHelp}
              className="bg-background/80 h-12 w-12 rounded-full border shadow-lg backdrop-blur-sm"
              title="Help & Tips"
            >
              <Lightbulb className="h-5 w-5 text-yellow-500" />
            </Button>
          </MicroInteraction>

          {/* Feedback */}
          <MicroInteraction whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              onClick={openFeedback}
              className="bg-background/80 h-12 w-12 rounded-full border shadow-lg backdrop-blur-sm"
              title="Send Feedback"
            >
              <MessageCircle className="h-5 w-5 text-blue-500" />
            </Button>
          </MicroInteraction>

          {/* Documentation */}
          <MicroInteraction whileHover={{ scale: 1.1, rotate: -15 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              onClick={() => window.open("/docs", "_blank")}
              className="bg-background/80 h-12 w-12 rounded-full border shadow-lg backdrop-blur-sm"
              title="Documentation"
            >
              <BookOpen className="h-5 w-5 text-green-500" />
            </Button>
          </MicroInteraction>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Breadcrumb Navigation with animations
 */
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <span className="text-muted-foreground mx-2">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Helper component for breadcrumb separator
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

/**
 * Loading Progress Bar for page transitions
 */
export function PageTransitionProgress() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Simulate page load progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setActive(false), 500)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 200)

    setActive(true)

    return () => clearInterval(timer)
  }, [])

  if (!active) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 right-0 left-0 z-[9999] h-1 bg-gray-200 dark:bg-gray-800"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  )
}
