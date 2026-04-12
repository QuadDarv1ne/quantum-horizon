import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { LearningMode } from "./learning-mode"

describe("LearningMode", () => {
  afterEach(() => {
    cleanup()
  })

  it("рендерит кнопку обучения для waveFunction", () => {
    render(<LearningMode visualizationType="waveFunction" />)

    const buttons = screen.getAllByRole("button")
    const learningButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("обучение")
    )
    expect(learningButton).toBeDefined()
  })

  it("показывает 'недоступно' для неизвестного типа визуализации", () => {
    render(<LearningMode visualizationType="unknown" />)

    const buttons = screen.getAllByRole("button")
    const disabledButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("недоступно")
    )
    expect(disabledButton).toBeDefined()
  })

  it("имеет правильный модуль для uncertainty", () => {
    render(<LearningMode visualizationType="uncertainty" />)

    const buttons = screen.getAllByRole("button")
    const learningButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("обучение")
    )
    expect(learningButton).toBeDefined()
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для timeDilation", () => {
    render(<LearningMode visualizationType="timeDilation" />)

    const buttons = screen.getAllByRole("button")
    const learningButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("обучение")
    )
    expect(learningButton).toBeDefined()
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для blackHole", () => {
    render(<LearningMode visualizationType="blackHole" />)

    const buttons = screen.getAllByRole("button")
    const learningButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("обучение")
    )
    expect(learningButton).toBeDefined()
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для massEnergy", () => {
    render(<LearningMode visualizationType="massEnergy" />)

    const buttons = screen.getAllByRole("button")
    const learningButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("обучение")
    )
    expect(learningButton).toBeDefined()
    expect(learningButton).not.toBeDisabled()
  })
})
