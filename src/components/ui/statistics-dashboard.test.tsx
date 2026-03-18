import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatisticsDashboard } from "./statistics-dashboard"

describe("StatisticsDashboard", () => {
  it("рендерит кнопку статистики", () => {
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    expect(statsButton).toBeInTheDocument()
  })

  it("открывает диалог при клике", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()
  })

  it("показывает заголовок статистики", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const title = await screen.findByText(/статистика и достижения/i)
    expect(title).toBeInTheDocument()
  })

  it("показывает карточку времени", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const timeCard = await screen.findByText(/время/i)
    expect(timeCard).toBeInTheDocument()
  })

  it("показывает карточку визуализаций", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const vizCard = await screen.findByText(/визуализации/i)
    expect(vizCard).toBeInTheDocument()
  })

  it("показывает карточку тестов", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const quizCard = await screen.findByText(/тесты/i)
    expect(quizCard).toBeInTheDocument()
  })

  it("показывает карточку серии", async () => {
    const user = await import("@testing-library/user-event")
    render(<StatisticsDashboard />)

    const statsButton = screen.getByRole("button", { name: /статистика/i })
    await user.default.click(statsButton)

    const streakCard = await screen.findByText(/серия/i)
    expect(streakCard).toBeInTheDocument()
  })
})
