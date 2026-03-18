import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SplitScreen } from "./split-screen"

describe("SplitScreen", () => {
  it("рендерит кнопку сравнения", () => {
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    expect(compareButton).toBeInTheDocument()
  })

  it("открывает диалог при клике на кнопку", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    await user.default.click(compareButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()
  })

  it("показывает инструкцию при отсутствии выбранных визуализаций", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    await user.default.click(compareButton)

    const instruction = await screen.findByText(/выберите две визуализации/i)
    expect(instruction).toBeInTheDocument()
  })

  it("имеет селектор для левой визуализации", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    await user.default.click(compareButton)

    const leftSelect = await screen.findByPlaceholderText("Левая")
    expect(leftSelect).toBeInTheDocument()
  })

  it("имеет селектор для правой визуализации", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    await user.default.click(compareButton)

    const rightSelect = await screen.findByPlaceholderText("Правая")
    expect(rightSelect).toBeInTheDocument()
  })

  it("имеет кнопку смены визуализаций местами", async () => {
    const user = await import("@testing-library/user-event")
    render(<SplitScreen />)

    const compareButton = screen.getByRole("button", { name: /сравнить/i })
    await user.default.click(compareButton)

    const swapButton = await screen.findByRole("button")
    expect(swapButton).toBeInTheDocument()
  })
})
