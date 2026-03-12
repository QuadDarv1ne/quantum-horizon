/**
 * Утилиты для улучшения доступности (a11y)
 */

/**
 * Приоритет объявления для скринридеров
 */
export type AnnouncePriority = "polite" | "assertive" | "off"

/**
 * Объявляет сообщение скринридерам через ARIA live region
 *
 * @param message - Сообщение для объявления
 * @param priority - Приоритет объявления (polite, assertive, off)
 *
 * @example
 * announceToScreenReader("Загрузка завершена", "polite")
 * announceToScreenReader("Ошибка! Попробуйте снова", "assertive")
 */
export function announceToScreenReader(
  message: string,
  priority: AnnouncePriority = "polite",
): void {
  // Удаляем существующие live regions с тем же приоритетом
  const existing = document.querySelector(`[data-a11y-announce="${priority}"]`)
  if (existing) {
    existing.remove()
  }

  // Создаём новую live region
  const liveRegion = document.createElement("div")
  liveRegion.setAttribute("role", "status")
  liveRegion.setAttribute("aria-live", priority)
  liveRegion.setAttribute("aria-atomic", "true")
  liveRegion.setAttribute("data-a11y-announce", priority)
  liveRegion.setAttribute("tabindex", "-1")
  liveRegion.className = "sr-only"

  // Добавляем стили для визуального скрытия
  liveRegion.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `

  liveRegion.textContent = message
  document.body.appendChild(liveRegion)

  // Удаляем через 1 секунду после прочтения
  setTimeout(() => {
    liveRegion.remove()
  }, 1000)
}

/**
 * Параметры для trapFocus
 */
export interface TrapFocusOptions {
  /** Начальный элемент для фокуса */
  initialFocus?: HTMLElement
  /** Элемент для фокуса при закрытии */
  returnFocus?: HTMLElement
  /** Callback при нажатии Escape */
  onEscape?: () => void
}

/**
 * Ловушка фокуса внутри элемента (для модалок, диалогов)
 *
 * @param container - Контейнер для ловушки фокуса
 * @param options - Опции ловушки
 * @returns Функция для очистки ловушки
 *
 * @example
 * const cleanup = trapFocus(modalElement, {
 *   onEscape: () => closeModal()
 * })
 * return cleanup
 */
export function trapFocus(
  container: HTMLElement,
  options: TrapFocusOptions = {},
): () => void {
  const { initialFocus, returnFocus, onEscape } = options

  // Сохраняем текущий элемент для возврата фокуса
  const previouslyFocused = document.activeElement as HTMLElement

  // Находим все фокусируемые элементы
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])",
  ].join(", ")

  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors),
  ).filter((el) => {
    // Проверяем видимость элемента
    const style = window.getComputedStyle(el)
    return style.display !== "none" && style.visibility !== "hidden"
  })

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  // Фокус на первом элементе или указанном
  const elementToFocus = initialFocus || firstFocusable
  if (elementToFocus) {
    setTimeout(() => elementToFocus.focus(), 0)
  } else {
    // Если нет фокусируемых элементов, фокус на контейнере
    container.setAttribute("tabindex", "-1")
    container.focus()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onEscape?.()
      return
    }

    if (event.key !== "Tab") return

    // Циклическая навигация
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown)

  // Возврат фокуса при очистке
  return () => {
    container.removeEventListener("keydown", handleKeyDown)
    if (returnFocus) {
      returnFocus.focus()
    } else if (previouslyFocused && previouslyFocused !== document.body) {
      previouslyFocused.focus()
    }
  }
}

/**
 * Проверка, является ли элемент фокусируемым
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute("disabled")) return false
  if (element.hasAttribute("tabindex") && element.tabIndex === -1) return false

  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
  ]

  return focusableSelectors.some((selector) => element.matches(selector))
}

/**
 * Обработчик навигации с клавиатуры
 */
export interface KeyboardNavigationOptions {
  /** Элементы для навигации */
  items: HTMLElement[]
  /** Ориентация навигации */
  orientation?: "horizontal" | "vertical"
  /** Циклическая навигация */
  loop?: boolean
  /** Callback при выборе элемента */
  onSelect?: (index: number) => void
  /** Callback при активации элемента */
  onActivate?: (index: number) => void
}

/**
 * Хук для клавиатурной навигации по списку элементов
 *
 * @param options - Опции навигации
 * @returns Объект с обработчиками и текущим индексом
 *
 * @example
 * const { handlers, currentIndex } = useKeyboardNavigation({
 *   items: menuItems,
 *   orientation: "vertical",
 *   onSelect: (index) => setSelectedIndex(index)
 * })
 */
export function createKeyboardNavigation(
  options: KeyboardNavigationOptions,
): {
  handlers: {
    onKeyDown: (event: React.KeyboardEvent) => void
  }
  currentIndex: number
  setCurrentIndex: (index: number) => void
} {
  const {
    items,
    orientation = "vertical",
    loop = true,
    onSelect,
    onActivate,
  } = options

  let currentIndex = 0

  const setCurrentIndex = (index: number) => {
    currentIndex = index
    items[index]?.focus()
    onSelect?.(index)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const isVertical = orientation === "vertical"
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft"
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight"

    switch (event.key) {
      case prevKey:
        event.preventDefault()
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1)
        } else if (loop) {
          setCurrentIndex(items.length - 1)
        }
        break

      case nextKey:
        event.preventDefault()
        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else if (loop) {
          setCurrentIndex(0)
        }
        break

      case "Home":
        event.preventDefault()
        setCurrentIndex(0)
        break

      case "End":
        event.preventDefault()
        setCurrentIndex(items.length - 1)
        break

      case "Enter":
      case " ":
        event.preventDefault()
        onActivate?.(currentIndex)
        break
    }
  }

  return {
    handlers: {
      onKeyDown: handleKeyDown,
    },
    currentIndex,
    setCurrentIndex,
  }
}

/**
 * Генерирует описание для скринридеров на основе состояния
 *
 * @param status - Статус операции
 * @param context - Контекст операции
 *
 * @example
 * generateStatusAnnouncement("loading", "Сохранение данных")
 * // "Загрузка: Сохранение данных"
 */
export function generateStatusAnnouncement(
  status: "loading" | "success" | "error" | "idle",
  context: string,
): string {
  const statusMessages = {
    loading: `Загрузка: ${context}`,
    success: `Успешно: ${context}`,
    error: `Ошибка: ${context}`,
    idle: context,
  }

  return statusMessages[status]
}

/**
 * Проверяет предпочтения пользователя по reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Проверяет предпочтения пользователя по contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-contrast: more)").matches
}

/**
 * Создаёт skip link для навигации к основному контенту
 *
 * @example
 * // В компоненте:
 * <div dangerouslySetInnerHTML={{ __html: createSkipLink() }} />
 */
export function createSkipLink(targetId = "main-content"): string {
  return `
    <a href="#${targetId}" 
       class="skip-link"
       style="
         position: absolute;
         left: -9999px;
         top: auto;
         width: 1px;
         height: 1px;
         overflow: hidden;
         z-index: 9999;
       "
       on:focus="
         this.style.position = 'fixed';
         this.style.left = '0';
         this.style.top = '0';
         this.style.width = 'auto';
         this.style.height = 'auto';
         this.style.overflow = 'visible';
       "
    >
      Перейти к основному контенту
    </a>
  `
}
