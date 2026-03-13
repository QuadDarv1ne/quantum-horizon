import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import OfflinePage from "@/app/offline/page"

describe("OfflinePage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock navigator.onLine
    Object.assign(global.navigator, {
      onLine: false,
    })
  })

  it("should render offline message when offline", () => {
    render(<OfflinePage />)

    expect(screen.getByText(/нет соединения|no connection/i)).toBeInTheDocument()
    expect(screen.getByText(/офлайн|offline/i)).toBeInTheDocument()
  })

  it("should render retry button", () => {
    render(<OfflinePage />)

    const retryButton = screen.getByRole("button", {
      name: /попробовать снова|try again/i,
    })
    expect(retryButton).toBeInTheDocument()
  })

  it("should render PWA tip", () => {
    render(<OfflinePage />)

    expect(screen.getByText(/pwa|офлайн режим/i)).toBeInTheDocument()
  })

  it("should have emoji icon", () => {
    render(<OfflinePage />)

    expect(screen.getByText(/📡/)).toBeInTheDocument()
  })

  it("should not render when online", () => {
    Object.assign(global.navigator, {
      onLine: true,
    })

    const { container } = render(<OfflinePage />)
    expect(container.firstChild).toBeNull()
  })
})
