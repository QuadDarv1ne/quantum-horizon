import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useIsMobile } from "./use-mobile"

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it("should return undefined initially", () => {
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBeUndefined()
  })

  it("should return true for mobile screen sizes", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => expect(result.current).toBe(true))
    expect(result.current).toBe(true)
  })

  it("should return false for desktop screen sizes", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => expect(result.current).toBe(false))
    expect(result.current).toBe(false)
  })

  it("should use 768px as mobile breakpoint", async () => {
    // Just below breakpoint
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 767,
    })

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => expect(result.current).toBe(true))
  })

  it("should listen to matchMedia changes", () => {
    const addEventListenerMock = vi.fn()
    const removeEventListenerMock = vi.fn()

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "(max-width: 767px)",
      onchange: null,
      addListener: addEventListenerMock,
      removeListener: removeEventListenerMock,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }))

    const { unmount } = renderHook(() => useIsMobile())

    expect(addEventListenerMock).toHaveBeenCalled()

    unmount()

    expect(removeEventListenerMock).toHaveBeenCalled()
  })

  it("should handle window resize", async () => {
    let currentMatches = true

    window.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return currentMatches
      },
      media: "(max-width: 767px)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result, rerender } = renderHook(() => useIsMobile())

    await waitFor(() => expect(result.current).toBe(true))

    // Simulate resize to desktop
    currentMatches = false
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    rerender()

    await waitFor(() => expect(result.current).toBe(false))
  })
})
