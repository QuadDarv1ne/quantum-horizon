"use client"

import { useEffect, useRef, useCallback } from "react"

export interface UseFocusTrapOptions {
  isActive?: boolean
  initialFocus?: HTMLElement
  onEscape?: () => void
}

export function useFocusTrap(options: UseFocusTrapOptions = {}) {
  const { isActive = true, initialFocus, onEscape } = options
  const containerRef = useRef<HTMLElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ")

    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter((el) => {
      const style = window.getComputedStyle(el)
      return style.display !== "none" && style.visibility !== "hidden"
    })
  }, [])

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    previouslyFocusedRef.current = document.activeElement as HTMLElement

    const focusableElements = getFocusableElements(container)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const elementToFocus = initialFocus ?? firstElement
    elementToFocus.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape?.()
        return
      }

      if (event.key !== "Tab") return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
      if (previouslyFocusedRef.current && previouslyFocusedRef.current !== document.body) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [isActive, initialFocus, onEscape, getFocusableElements])

  return containerRef
}

export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    previousFocusRef.current?.focus()
    previousFocusRef.current = null
  }, [])

  return { saveFocus, restoreFocus, previousFocusRef }
}
