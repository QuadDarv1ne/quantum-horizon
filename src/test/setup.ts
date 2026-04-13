/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// Vitest setup file

import { vi } from "vitest"
import "@testing-library/jest-dom/vitest"

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => {
    const translate = (key: string) => key
    return translate
  },
  useLocale: () => "ru",
  IntlProvider: ({ children }: { children: React.ReactNode }) => children,
  getMessage: () => "",
}))

// Polyfill for ResizeObserver
class ResizeObserverPolyfill {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

global.ResizeObserver = ResizeObserverPolyfill

// Polyfill for HTMLCanvasElement
// Using real canvas implementation from npm package when available
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
let canvasContextMock: any

try {
  // Try to use real canvas package
  const { createCanvas } = require("canvas")
  const testCanvas = createCanvas(1, 1)
  canvasContextMock = testCanvas.getContext("2d")
} catch {
  // Fallback to mock if canvas package not installed
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {}
  
  canvasContextMock = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    lineJoin: "miter" as CanvasLineJoin,
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: "source-over" as GlobalCompositeOperation,
    font: "10px sans-serif",
    textAlign: "start" as CanvasTextAlign,
    textBaseline: "alphabetic" as CanvasTextBaseline,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low" as ImageSmoothingQuality,
    direction: "inherit" as CanvasDirection,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    fillText: noop,
    strokeText: noop,
    measureText: () => ({ width: 100, height: 10 } as TextMetrics),
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    arcTo: noop,
    ellipse: noop,
    rect: noop,
    stroke: noop,
    fill: noop,
    clip: noop,
    drawImage: noop,
    save: noop,
    restore: noop,
    scale: noop,
    rotate: noop,
    translate: noop,
    transform: noop,
    setTransform: noop,
    resetTransform: noop,
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } as DOMMatrix),
    createLinearGradient: () => ({
      addColorStop: noop,
    }),
    createRadialGradient: () => ({
      addColorStop: noop,
    }),
    createPattern: () => null,
    isPointInPath: () => false,
    isPointInStroke: () => false,
    putImageData: noop,
    getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 } as ImageData),
    createImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 } as ImageData),
    setLineDash: noop,
    getLineDash: () => [],
  }
}

class HTMLCanvasElementMock extends HTMLElement {
  getContext = () => canvasContextMock
  toDataURL = () => "data:image/png;base64,"
  toBlob = () => null
  width = 0
  height = 0
}

// @ts-expect-error - Mock for testing
global.HTMLCanvasElement = HTMLCanvasElementMock

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) =>
  setTimeout(() => {
    callback(0)
  }, 0)
) as unknown as typeof requestAnimationFrame
global.cancelAnimationFrame = vi.fn()

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

// Mock localStorage
const localStorageMock: Storage = {
  store: {} as Record<string, string>,
  getItem(key) {
    return this.store[key] ?? null
  },
  setItem(key, value) {
    this.store[key] = value
  },
  removeItem(key) {
    delete this.store[key]
  },
  clear() {
    this.store = {}
  },
  get length() {
    return Object.keys(this.store).length
  },
  key(index) {
    return Object.keys(this.store)[index] ?? null
  },
}

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
})

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(global.window, "matchMedia", {
  writable: true,
  value: matchMediaMock,
})
