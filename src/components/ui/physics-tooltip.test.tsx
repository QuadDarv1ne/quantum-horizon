import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { within } from "@testing-library/dom"
import { PhysicsTooltip } from "./physics-tooltip"

describe("PhysicsTooltip", () => {
  afterEach(() => {
    cleanup()
  })

  it("рендерит кнопку информации", () => {
    render(<PhysicsTooltip visualizationType="waveFunction" />)

    const buttons = screen.getAllByRole("button")
    const infoButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("информация")
    )
    expect(infoButton).toBeDefined()
  })

  it("не рендерит ничего для неизвестного типа визуализации", () => {
    const { container } = render(<PhysicsTooltip visualizationType="unknown" />)
    expect(container.firstChild).toBeNull()
  })

  it("открывает диалог с информацией при клике", async () => {
    // Requires complex dialog setup
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="waveFunction" variant="inline" />)

    const infoButton = screen.getByRole("button", {
      name: /физическая информация/i
    })
    await user.click(infoButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    const title = await screen.findByText("Волновая функция")
    expect(title).toBeInTheDocument()
  })

  it("показывает формулу для waveFunction", async () => {
    // Requires complex dialog setup
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="waveFunction" variant="inline" />)

    const infoButton = screen.getByRole("button", {
      name: /физическая информация/i
    })
    await user.click(infoButton)

    // Wait for dialog to appear
    await screen.findByRole("dialog")

    const formula = await screen.findByText("ψₙ(x) = √(2/L) · sin(nπx/L)")
    expect(formula).toBeInTheDocument()
  })

  it("показывает ключевые понятия", async () => {
    // Requires complex dialog setup
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="uncertainty" variant="inline" />)

    const infoButton = screen.getByRole("button", {
      name: /физическая информация/i
    })
    await user.click(infoButton)

    // Wait for dialog to appear
    await screen.findByRole("dialog")

    const concept = await screen.findByText("Фундаментальный предел точности")
    expect(concept).toBeInTheDocument()
  })

  it("закрывается по клику на кнопку закрытия", async () => {
    // Requires complex dialog setup
    const user = userEvent.setup()
    render(<PhysicsTooltip visualizationType="blackHole" variant="inline" />)

    const infoButton = screen.getByRole("button", {
      name: /физическая информация/i
    })
    await user.click(infoButton)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    // Wait for close button to appear
    const closeButton = await within(dialog).findByRole("button", {
      name: /Close/i
    })
    await user.click(closeButton)

    // Expect dialog to be closed
    expect(await screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})