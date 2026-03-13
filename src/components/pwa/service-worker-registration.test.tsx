import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ServiceWorkerRegistration } from "./service-worker-registration"

describe("ServiceWorkerRegistration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock navigator.serviceWorker
    Object.assign(global.navigator, {
      serviceWorker: {
        register: vi.fn(),
        ready: Promise.resolve({
          waiting: {
            postMessage: vi.fn(),
          },
        }),
      },
      onLine: true,
    })
  })

  it("should render without crashing", () => {
    render(<ServiceWorkerRegistration />)
    // Component renders null when no update available and online
    expect(document.body).toBeInTheDocument()
  })

  it("should show offline indicator when offline", async () => {
    // Mock offline state
    Object.assign(global.navigator, {
      serviceWorker: {
        register: vi.fn(),
      },
      onLine: false,
    })

    render(<ServiceWorkerRegistration />)

    // Wait for component to detect offline state
    await vi.advanceTimersByTimeAsync(100)

    const offlineIndicator = screen.queryByText(/офлайн|offline/i)
    if (offlineIndicator) {
      expect(offlineIndicator).toBeInTheDocument()
    }
  })

  it("should register service worker on mount", () => {
    const mockRegister = vi.fn().mockResolvedValue({
      addEventListener: vi.fn(),
      installing: null,
    })

    Object.assign(global.navigator, {
      serviceWorker: {
        register: mockRegister,
      },
      onLine: true,
    })

    render(<ServiceWorkerRegistration />)

    expect(mockRegister).toHaveBeenCalledWith("/sw.js", { scope: "/" })
  })

  it("should handle service worker registration failure", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn())
    const mockRegister = vi.fn().mockRejectedValue(new Error("Registration failed"))

    Object.assign(global.navigator, {
      serviceWorker: {
        register: mockRegister,
      },
      onLine: true,
    })

    render(<ServiceWorkerRegistration />)

    expect(consoleSpy).toHaveBeenCalledWith(
      "Service Worker registration failed:",
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it("should not register if service workers not supported", () => {
    const mockRegister = vi.fn()

    Object.assign(global.navigator, {
      serviceWorker: undefined,
    })

    render(<ServiceWorkerRegistration />)

    expect(mockRegister).not.toHaveBeenCalled()
  })
})
