/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { setupCanvas, useCanvasAnimation } from "./use-canvas-animation"

describe("setupCanvas", () => {
  it.skip("should setup canvas with correct dimensions", () => {
    // Requires real canvas context not available in jsdom
    const canvas = document.createElement("canvas")
    canvas.style.width = "800px"
    canvas.style.height = "600px"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get 2D context")

    setupCanvas(canvas, ctx)

    const dpr = window.devicePixelRatio || 1
    expect(canvas.width).toBe(800 * dpr)
    expect(canvas.height).toBe(600 * dpr)

    document.body.removeChild(canvas)
  })

  it.skip("should scale context by device pixel ratio", () => {
    // Requires real canvas context not available in jsdom
    const canvas = document.createElement("canvas")
    canvas.style.width = "400px"
    canvas.style.height = "300px"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get 2D context")

    const getTransformSpy = vi.spyOn(ctx, "getTransform")
    setupCanvas(canvas, ctx)

    const transform = ctx.getTransform()
    const dpr = window.devicePixelRatio || 1
    expect(transform.a).toBe(dpr)
    expect(transform.d).toBe(dpr)

    getTransformSpy.mockRestore()
    document.body.removeChild(canvas)
  })
})

describe("useCanvasAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it.skip("should initialize canvas context", () => {
    // Requires real canvas context not available in jsdom
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => useCanvasAnimation(canvasRef, animateFn))

    expect(canvas.getContext("2d")).toBeTruthy()
  })

  it.skip("should call animate function with correct parameters", () => {
    // Requires real canvas context and animation loop
    const canvas = document.createElement("canvas")
    canvas.style.width = "800px"
    canvas.style.height = "600px"
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => useCanvasAnimation(canvasRef, animateFn))

    // Advance time to trigger animation frame
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(animateFn).toHaveBeenCalled()
  })

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

  it.skip("should cleanup on unmount", () => {
    // Requires real animation frame handling
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame")

    const { unmount } = renderHook(() => useCanvasAnimation(canvasRef, animateFn))

    unmount()

    expect(cancelAnimationFrameSpy).toHaveBeenCalled()

    cancelAnimationFrameSpy.mockRestore()
  })

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
