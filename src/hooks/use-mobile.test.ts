/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useIsMobile } from "./use-mobile"

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default matchMedia mock for each test
    window.matchMedia = vi.fn().mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )
  })

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it("should return false for desktop initially", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })
    const { result } = renderHook(() => useIsMobile())

    // useIsMobile returns false initially when innerWidth > breakpoint
    expect(result.current).toBe(false)
  })

  it("should return true for mobile screen sizes", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    window.matchMedia = vi.fn().mockImplementation(
      (query) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

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

    window.matchMedia = vi.fn().mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

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

    window.matchMedia = vi.fn().mockImplementation(
      (query) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => expect(result.current).toBe(true))
  })

  it("should listen to matchMedia changes", () => {
    const addEventListenerMock = vi.fn()
    const removeEventListenerMock = vi.fn()

    window.matchMedia = vi.fn().mockImplementation(
      () =>
        ({
          matches: false,
          media: "(max-width: 767px)",
          onchange: null,
          addListener: addEventListenerMock,
          removeListener: removeEventListenerMock,
          addEventListener: addEventListenerMock,
          removeEventListener: removeEventListenerMock,
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

    const { unmount } = renderHook(() => useIsMobile())

    expect(addEventListenerMock).toHaveBeenCalled()

    unmount()

    expect(removeEventListenerMock).toHaveBeenCalled()
  })

  it("should handle window resize", async () => {
    let currentMatches = true
    let changeCallback: ((event: MediaQueryListEvent) => void) | undefined

    window.matchMedia = vi.fn().mockImplementation(
      () =>
        ({
          get matches() {
            return currentMatches
          },
          media: "(max-width: 767px)",
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn().mockImplementation((event, callback) => {
            if (event === "change") {
              changeCallback = callback
            }
          }),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

    // Start with mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result, rerender } = renderHook(() => useIsMobile())

    // Wait for initial effect
    await waitFor(() => expect(result.current).toBe(true))

    // Simulate resize to desktop
    currentMatches = false
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    // Trigger change event
    changeCallback?.({ matches: false, media: "(max-width: 767px)" } as MediaQueryListEvent)

    // Rerender to get updated state
    rerender()

    await waitFor(() => expect(result.current).toBe(false))
  })
})
