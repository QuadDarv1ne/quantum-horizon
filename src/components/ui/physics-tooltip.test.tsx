import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PhysicsTooltip } from "./physics-tooltip"

describe("PhysicsTooltip", () => {
  it("рендерит кнопку информации", () => {
    render(<PhysicsTooltip visualizationType="waveFunction" />)

    const infoButton = screen.getByRole("button", { name: /информация/i })
    expect(infoButton).toBeInTheDocument()
  })

  it("не рендерит ничего для неизвестного типа визуализации", () => {
    const { container } = render(<PhysicsTooltip visualizationType="unknown" />)
    expect(container.firstChild).toBeNull()
  })

  it("открывает диалог с информацией при клике", async () => {
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="waveFunction" variant="inline" />)

    const infoButton = screen.getByRole("button", { name: /физическая информация/i })
    await user.click(infoButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    const title = await screen.findByText("Волновая функция")
    expect(title).toBeInTheDocument()
  })

  it("показывает формулу для waveFunction", async () => {
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="waveFunction" variant="inline" />)

    const infoButton = screen.getByRole("button", { name: /физическая информация/i })
    await user.click(infoButton)

    const formula = await screen.findByText(/ψₙ\(x\) = √\(2\/L\) · sin\(nπx\/L\)/i)
    expect(formula).toBeInTheDocument()
  })

  it("показывает ключевые понятия", async () => {
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="uncertainty" variant="inline" />)

    const infoButton = screen.getByRole("button", { name: /физическая информация/i })
    await user.click(infoButton)

    const concept = await screen.findByText("Фундаментальный предел точности")
    expect(concept).toBeInTheDocument()
  })

  it("закрывается по клику на кнопку закрытия", async () => {
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="blackHole" variant="inline" />)

    const infoButton = screen.getByRole("button", { name: /физическая информация/i })
    await user.click(infoButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    // Ждём закрытия диалога
    await new Promise((resolve) => setTimeout(resolve, 300))

    const dialogAfterClose = screen.queryByRole("dialog")
    expect(dialogAfterClose).not.toBeInTheDocument()
  })
})
