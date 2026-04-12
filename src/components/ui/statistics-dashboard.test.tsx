import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { StatisticsDashboard } from "./statistics-dashboard"

describe("StatisticsDashboard", () => {
  afterEach(() => {
    cleanup()
  })

  it("рендерит кнопку статистики", () => {
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    expect(statsButton).toBeDefined()
  })

  it("открывает диалог при клике", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()
  })

  it("показывает заголовок статистики", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const title = await screen.findByText(/статистика и достижения/i)
    expect(title).toBeInTheDocument()
  })

  it("показывает карточку времени", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const timeCard = await screen.findByText(/время/i)
    expect(timeCard).toBeInTheDocument()
  })

  it("показывает карточку визуализаций", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const vizCard = await screen.findByText(/визуализации/i)
    expect(vizCard).toBeInTheDocument()
  })

  it("показывает карточку тестов", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const quizCard = await screen.findByText(/тесты/i)
    expect(quizCard).toBeInTheDocument()
  })

  it("показывает карточку серии", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const buttons = screen.getAllByRole("button")
    const statsButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("статистик"))
    if (statsButton) {
      await user.default.click(statsButton)
    }

    const streakCard = await screen.findByText(/серия/i)
    expect(streakCard).toBeInTheDocument()
  })
})
