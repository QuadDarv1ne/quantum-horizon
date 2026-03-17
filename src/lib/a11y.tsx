/**
 * Утилиты для улучшения доступности (a11y)
 */

/**
 * Генерирует ID для aria-атрибутов
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Хук для управления фокусом и keyboard navigation
 */
export function useKeyboardNavigation(itemCount: number, onSelect?: (index: number) => void) {
  return {
    onKeyDown: (event: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          newIndex = (currentIndex + 1) % itemCount
          break
        case "ArrowUp":
          event.preventDefault()
          newIndex = (currentIndex - 1 + itemCount) % itemCount
          break
        case "Home":
          event.preventDefault()
          newIndex = 0
          break
        case "End":
          event.preventDefault()
          newIndex = itemCount - 1
          break
        case "Enter":
        case " ":
          event.preventDefault()
          onSelect?.(currentIndex)
          return
        default:
          return
      }

      // Фокус на новом элементе
      const element = document.querySelector(
        `[data-keyboard-index="${String(newIndex)}"]`
      ) as HTMLElement | null
      element?.focus()
    },
  }
}

/**
 * ARIA-атрибуты для canvas визуализаций
 */
export function getCanvasAriaProps({
  title,
  description,
  isInteractive = true,
}: {
  title: string
  description?: string
  isInteractive?: boolean
}) {
  return {
    role: "img" as const,
    "aria-label": title,
    "aria-describedby": description ? `${title}-description` : undefined,
    "aria-busy": isInteractive ? undefined : "false",
    tabIndex: isInteractive ? 0 : -1,
  }
}

/**
 * ARIA-атрибуты для интерактивных элементов управления
 */
export function getControlAriaProps({
  label,
  expanded,
  controls,
  disabled,
}: {
  label: string
  expanded?: boolean
  controls?: string
  disabled?: boolean
}) {
  return {
    "aria-label": label,
    "aria-expanded": expanded,
    "aria-controls": controls,
    "aria-disabled": disabled,
  }
}

/**
 * Skip link компонент для пропуска к основному контенту
 */
export const SkipLink = () => (
  <a
    href="#main-content"
    className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2"
  >
    Перейти к основному контенту
  </a>
)
