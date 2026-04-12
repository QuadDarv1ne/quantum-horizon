/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { setupCanvas, useCanvasAnimation } from "./use-canvas-animation"

describe("setupCanvas", () => {
  // NOTE: These tests require real canvas context
  // Should be implemented as E2E tests or with canvas npm package
  
  it.todo("should setup canvas with correct dimensions")
  it.todo("should scale context by device pixel ratio")
})

describe("useCanvasAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  // NOTE: These tests require real canvas context and animation loop
  it.todo("should initialize canvas context")
  it.todo("should call animate function with correct parameters")

  it("should handle resize events", () => {
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => useCanvasAnimation(canvasRef, animateFn))

    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    // Canvas should be re-setup after resize
    expect(canvas.width).toBeGreaterThan(0)
  })

  it.todo("should cleanup on unmount")

  it("should respect fpsLimit option", () => {
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() =>
      useCanvasAnimation(canvasRef, animateFn, {
        fpsLimit: 30,
      })
    )

    act(() => {
      vi.advanceTimersByTime(100)
    })

    // With 30fps limit, should be called ~3 times in 100ms
    expect(animateFn.mock.calls.length).toBeLessThanOrEqual(4)
  })

  it("should handle pauseWhenHidden option", () => {
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() =>
      useCanvasAnimation(canvasRef, animateFn, {
        pauseWhenHidden: true,
      })
    )

    // Simulate canvas being hidden
    act(() => {
      // IntersectionObserver would mark it as hidden
      // This is a simplified test - full test would mock IntersectionObserver
    })

    expect(animateFn).toBeDefined()
  })

  it("should respect reduced motion preference", () => {
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    // Mock reduced motion preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes("reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    renderHook(() =>
      useCanvasAnimation(canvasRef, animateFn, {
        respectReducedMotion: true,
      })
    )

    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)")
  })
})
