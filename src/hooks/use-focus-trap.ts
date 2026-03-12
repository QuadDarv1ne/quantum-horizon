/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { useEffect, useRef } from "react"

/**
 * Хук для trap focus внутри элемента (для модальных окон, диалогов)
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Фокус на первом элементе при активации
    firstElement?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return

      if (event.shiftKey && document.activeElement === firstElement) {
        // Shift + Tab
        event.preventDefault()
        lastElement.focus()
      } else if (document.activeElement === lastElement) {
        // Tab
        event.preventDefault()
        firstElement.focus()
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    return (): void => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [isActive])

  return containerRef
}

/**
 * Хук для управления фокусом (возврат фокуса после закрытия)
 */
export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    previousFocusRef.current?.focus()
    previousFocusRef.current = null
  }

  return { saveFocus, restoreFocus, previousFocusRef }
}
