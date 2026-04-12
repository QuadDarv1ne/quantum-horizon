import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SplitScreen } from "./split-screen"

describe("SplitScreen", () => {
  afterEach(() => {
    cleanup()
  })

  it("рендерит кнопку сравнения", () => {
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    expect(compareButton).toBeDefined()
  })

  it("открывает диалог при клике на кнопку", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    if (compareButton) {
      await user.default.click(compareButton)
    }

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()
  })

  it("показывает инструкцию при отсутствии выбранных визуализаций", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    if (compareButton) {
      await user.default.click(compareButton)
    }

    const instruction = await screen.findByText(/выберите две визуализации/i)
    expect(instruction).toBeInTheDocument()
  })

  it("имеет селектор для левой визуализации", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    if (compareButton) {
      await user.default.click(compareButton)
    }

    const leftSelect = await screen.findByText("Левая")
    expect(leftSelect).toBeInTheDocument()
  })

  it("имеет селектор для правой визуализации", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    if (compareButton) {
      await user.default.click(compareButton)
    }

    const rightSelect = await screen.findByText("Правая")
    expect(rightSelect).toBeInTheDocument()
  })

  it("имеет кнопку смены визуализаций местами", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const buttons = screen.getAllByRole("button")
    const compareButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("сравнит"))
    if (compareButton) {
      await user.default.click(compareButton)
    }

    const allButtons = await screen.findAllByRole("button")
    const swapButton = allButtons.find((btn) => btn.textContent?.toLowerCase().includes("поменят"))
    expect(swapButton).toBeDefined()
  })
})
