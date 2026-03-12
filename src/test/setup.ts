// Vitest setup file
import "@testing-library/jest-dom/vitest"
import { afterEach, beforeEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// Polyfill for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
}

// Polyfill for HTMLCanvasElement
const canvasContextMock = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  lineCap: "butt",
  lineJoin: "miter",
  miterLimit: 10,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  font: "10px sans-serif",
  textAlign: "start",
  textBaseline: "alphabetic",
  imageSmoothingEnabled: true,
  imageSmoothingQuality: "low",
  direction: "inherit",
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  clearRect: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 100, height: 10 }),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  ellipse: vi.fn(),
  rect: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  clip: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  getTransform: vi.fn().mockReturnValue({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  createPattern: vi.fn(),
  isPointInPath: vi.fn().mockReturnValue(false),
  isPointInStroke: vi.fn().mockReturnValue(false),
  putImageData: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
  createImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
  setLineDash: vi.fn(),
  getLineDash: vi.fn().mockReturnValue([]),
}

class HTMLCanvasElementMock extends HTMLElement {
  constructor() {
    super()
  }

  getContext(contextType: string) {
    if (contextType === "2d") {
      return canvasContextMock
    }
    return null
  }

  toDataURL() {
    return "data:image/png;base64,"
  }

  get width() {
    return 800
  }

  set width(value: number) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  get height() {
    return 600
  }

  set height(value: number) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  getBoundingClientRect() {
    return {
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }
  }
}

// Register the custom element
if (typeof customElements !== "undefined" && !customElements.get("canvas-mock")) {
  customElements.define("canvas-mock", HTMLCanvasElementMock)
}

// Override createElement to return canvas mock for canvas elements
const originalCreateElement = document.createElement.bind(document)
document.createElement = function (tagName: string, options?: ElementCreationOptions) {
  if (tagName.toLowerCase() === "canvas") {
    return new HTMLCanvasElementMock()
  }
  return originalCreateElement(tagName, options)
} as typeof document.createElement

// Polyfill for matchMedia
Object.defineProperty(global, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Polyfill for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
} as unknown as typeof IntersectionObserver

// Polyfill for localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  clear() {
    this.store = {}
  },
  getItem(key: string) {
    return this.store[key] || null
  },
  setItem(key: string, value: string) {
    this.store[key] = String(value)
  },
  removeItem(key: string) {
    delete this.store[key]
  },
}
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  localStorageMock.clear()
  vi.clearAllMocks()
})
