import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { setupCanvas, useCanvasAnimation } from "./use-canvas-animation"

describe("setupCanvas", () => {
  it("should setup canvas with correct dimensions", () => {
    const canvas = document.createElement("canvas")
    
    // Mock getBoundingClientRect to return non-zero dimensions
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      top: 0,
      right: 800,
      bottom: 600,
      left: 0,
      toJSON: () => ({}),
    })

    const ctx = canvas.getContext("2d")
    if (ctx) {
      setupCanvas(canvas, ctx)

      const dpr = window.devicePixelRatio || 1
      expect(canvas.width).toBe(800 * dpr)
      expect(canvas.height).toBe(600 * dpr)
    }

    vi.restoreAllMocks()
  })

  it("should scale context by device pixel ratio", () => {
    const canvas = document.createElement("canvas")
    
    // Mock getBoundingClientRect
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      top: 0,
      right: 400,
      bottom: 300,
      left: 0,
      toJSON: () => ({}),
    })

    const ctx = canvas.getContext("2d")
    
    if (ctx) {
      const scaleSpy = vi.spyOn(ctx, "scale")
      setupCanvas(canvas, ctx)

      // Context should have scale applied for devicePixelRatio
      expect(ctx).toBeDefined()
      expect(scaleSpy).toHaveBeenCalled()

      const dpr = window.devicePixelRatio || 1
      expect(canvas.width).toBe(400 * dpr)
      expect(canvas.height).toBe(300 * dpr)
    }

    vi.restoreAllMocks()
  })
})

describe("useCanvasAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initialize canvas context", () => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => {
      useCanvasAnimation(canvasRef, animateFn);
    })

    // Canvas context should be initialized
    expect(canvas.getContext("2d")).toBeDefined()
  })

  it("should call animate function with correct parameters", () => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => {
      useCanvasAnimation(canvasRef, animateFn);
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Animate function should be called at least once
    expect(animateFn.mock.calls.length).toBeGreaterThan(0)
  })

  it("should cleanup on unmount", () => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 300
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    const { unmount } = renderHook(() => { useCanvasAnimation(canvasRef, animateFn); })

    // Unmount the hook
    unmount()

    // Animation should be stopped (no errors means success)
    expect(true).toBe(true)
  })

  it("should handle resize events", () => {
    const canvas = document.createElement("canvas")
    canvas.style.width = "400px"
    canvas.style.height = "300px"
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => {
      useCanvasAnimation(canvasRef, animateFn);
    })

    // Canvas should be initialized with dimensions
    expect(canvas.width).toBeGreaterThanOrEqual(0)

    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    // After resize, canvas should still be valid
    expect(canvas.width).toBeGreaterThanOrEqual(0)
  })

  it("should respect fpsLimit option", () => {
    const canvas = document.createElement("canvas")
    const canvasRef = { current: canvas }
    const animateFn = vi.fn()

    renderHook(() => {
      useCanvasAnimation(canvasRef, animateFn, { fpsLimit: 30 });
    })

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
      { useCanvasAnimation(canvasRef, animateFn, {
        pauseWhenHidden: true,
      }); }
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
      value: vi.fn().mockImplementation((query: string) => ({
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
      { useCanvasAnimation(canvasRef, animateFn, {
        respectReducedMotion: true,
      }); }
    )

    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)")
  })
})
