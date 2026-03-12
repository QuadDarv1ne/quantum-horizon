import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  announceToScreenReader,
  trapFocus,
  isFocusable,
  prefersReducedMotion,
  prefersHighContrast,
  generateStatusAnnouncement,
} from "./a11y"

describe("announceToScreenReader", () => {
  beforeEach(() => {
    // Очищаем все live regions перед каждым тестом
    document.querySelectorAll("[data-a11y-announce]").forEach((el) => el.remove())
  })

  it("should create a live region with message", () => {
    announceToScreenReader("Test message")

    const liveRegion = document.querySelector("[data-a11y-announce='polite']")
    expect(liveRegion).toBeTruthy()
    expect(liveRegion?.textContent).toBe("Test message")
  })

  it("should use polite priority by default", () => {
    announceToScreenReader("Test message")

    const liveRegion = document.querySelector("[data-a11y-announce='polite']")
    expect(liveRegion?.getAttribute("aria-live")).toBe("polite")
  })

  it("should use assertive priority when specified", () => {
    announceToScreenReader("Urgent message", "assertive")

    const liveRegion = document.querySelector("[data-a11y-announce='assertive']")
    expect(liveRegion?.getAttribute("aria-live")).toBe("assertive")
  })

  it("should set aria-atomic to true", () => {
    announceToScreenReader("Test message")

    const liveRegion = document.querySelector("[data-a11y-announce='polite']")
    expect(liveRegion?.getAttribute("aria-atomic")).toBe("true")
  })

  it("should set role to status", () => {
    announceToScreenReader("Test message")

    const liveRegion = document.querySelector("[data-a11y-announce='polite']")
    expect(liveRegion?.getAttribute("role")).toBe("status")
  })

  it("should remove existing live region with same priority", () => {
    announceToScreenReader("First message")
    announceToScreenReader("Second message")

    const liveRegions = document.querySelectorAll("[data-a11y-announce='polite']")
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0]?.textContent).toBe("Second message")
  })

  it("should remove live region after timeout", () => {
    vi.useFakeTimers()

    announceToScreenReader("Test message")

    expect(document.querySelector("[data-a11y-announce='polite']")).toBeTruthy()

    vi.advanceTimersByTime(1000)

    expect(document.querySelector("[data-a11y-announce='polite']")).toBeFalsy()

    vi.useRealTimers()
  })

  it("should apply sr-only styles", () => {
    announceToScreenReader("Test message")

    const liveRegion = document.querySelector("[data-a11y-announce='polite']") as HTMLElement
    expect(liveRegion?.style.position).toBe("absolute")
    expect(liveRegion?.style.width).toBe("1px")
    expect(liveRegion?.style.height).toBe("1px")
    expect(liveRegion?.style.overflow).toBe("hidden")
  })
})

describe("trapFocus", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    container.innerHTML = `
      <button id="first">First</button>
      <input id="middle" type="text" />
      <button id="last">Last</button>
    `
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("should focus first focusable element by default", () => {
    const focusSpy = vi.spyOn(container.querySelector("#first") as HTMLElement, "focus")

    trapFocus(container)

    expect(focusSpy).toHaveBeenCalled()
  })

  it("should focus initialFocus element if specified", () => {
    const middleInput = container.querySelector("#middle") as HTMLInputElement
    const focusSpy = vi.spyOn(middleInput, "focus")

    trapFocus(container, { initialFocus: middleInput })

    expect(focusSpy).toHaveBeenCalled()
  })

  it("should trap focus with Tab key", () => {
    trapFocus(container)

    const lastButton = container.querySelector("#last") as HTMLButtonElement
    lastButton.focus()

    const tabEvent = new KeyboardEvent("keydown", { key: "Tab" })
    container.dispatchEvent(tabEvent)

    // Focus should loop to first element
    expect(document.activeElement).toBe(container.querySelector("#first"))
  })

  it("should trap focus with Shift+Tab key", () => {
    trapFocus(container)

    const firstButton = container.querySelector("#first") as HTMLButtonElement
    firstButton.focus()

    const tabEvent = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true })
    container.dispatchEvent(tabEvent)

    // Focus should loop to last element
    expect(document.activeElement).toBe(container.querySelector("#last"))
  })

  it("should call onEscape when Escape is pressed", () => {
    const onEscapeMock = vi.fn()
    trapFocus(container, { onEscape: onEscapeMock })

    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" })
    container.dispatchEvent(escapeEvent)

    expect(onEscapeMock).toHaveBeenCalled()
  })

  it("should return focus to previously focused element on cleanup", () => {
    const previousElement = document.createElement("button")
    previousElement.id = "previous"
    document.body.appendChild(previousElement)
    previousElement.focus()

    const cleanup = trapFocus(container)

    cleanup()

    expect(document.activeElement).toBe(previousElement)

    document.body.removeChild(previousElement)
  })

  it("should return focus to returnFocus element if specified", () => {
    const returnElement = document.createElement("button")
    returnElement.id = "return"
    document.body.appendChild(returnElement)

    const cleanup = trapFocus(container, { returnFocus: returnElement })

    cleanup()

    expect(document.activeElement).toBe(returnElement)

    document.body.removeChild(returnElement)
  })

  it("should remove event listener on cleanup", () => {
    const cleanup = trapFocus(container)

    cleanup()

    // Should not throw
    const tabEvent = new KeyboardEvent("keydown", { key: "Tab" })
    expect(() => container.dispatchEvent(tabEvent)).not.toThrow()
  })
})

describe("isFocusable", () => {
  it("should return true for button", () => {
    const button = document.createElement("button")
    expect(isFocusable(button)).toBe(true)
  })

  it("should return true for input", () => {
    const input = document.createElement("input")
    expect(isFocusable(input)).toBe(true)
  })

  it("should return true for link with href", () => {
    const link = document.createElement("a")
    link.href = "#test"
    expect(isFocusable(link)).toBe(true)
  })

  it("should return false for disabled button", () => {
    const button = document.createElement("button")
    button.disabled = true
    expect(isFocusable(button)).toBe(false)
  })

  it("should return false for element with tabindex=-1", () => {
    const div = document.createElement("div")
    div.tabIndex = -1
    expect(isFocusable(div)).toBe(false)
  })

  it("should return false for link without href", () => {
    const link = document.createElement("a")
    expect(isFocusable(link)).toBe(false)
  })
})

describe("prefersReducedMotion", () => {
  it("should return false by default", () => {
    expect(prefersReducedMotion()).toBe(false)
  })

  it("should return true when prefers-reduced-motion is set", () => {
    const originalMatchMedia = window.matchMedia

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(prefersReducedMotion()).toBe(true)

    window.matchMedia = originalMatchMedia
  })
})

describe("prefersHighContrast", () => {
  it("should return false by default", () => {
    expect(prefersHighContrast()).toBe(false)
  })

  it("should return true when prefers-contrast is set", () => {
    const originalMatchMedia = window.matchMedia

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("contrast: more"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    expect(prefersHighContrast()).toBe(true)

    window.matchMedia = originalMatchMedia
  })
})

describe("generateStatusAnnouncement", () => {
  it("should generate loading message", () => {
    const message = generateStatusAnnouncement("loading", "Сохранение данных")
    expect(message).toBe("Загрузка: Сохранение данных")
  })

  it("should generate success message", () => {
    const message = generateStatusAnnouncement("success", "Данные сохранены")
    expect(message).toBe("Успешно: Данные сохранены")
  })

  it("should generate error message", () => {
    const message = generateStatusAnnouncement("error", "Не удалось сохранить")
    expect(message).toBe("Ошибка: Не удалось сохранить")
  })

  it("should return context for idle status", () => {
    const message = generateStatusAnnouncement("idle", "Готово")
    expect(message).toBe("Готово")
  })
})
