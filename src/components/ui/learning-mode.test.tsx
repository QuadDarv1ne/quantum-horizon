import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LearningMode } from "./learning-mode"

describe("LearningMode", () => {
  it("рендерит кнопку обучения для waveFunction", () => {
    render(<LearningMode visualizationType="waveFunction" />)

    const learningButton = screen.getByRole("button", { name: /обучение/i })
    expect(learningButton).toBeInTheDocument()
  })

  it("показывает 'недоступно' для неизвестного типа визуализации", () => {
    render(<LearningMode visualizationType="unknown" />)

    const disabledButton = screen.getByRole("button", { name: /обучение.*недоступно/i })
    expect(disabledButton).toBeDisabled()
  })

  it("имеет правильный модуль для uncertainty", () => {
    render(<LearningMode visualizationType="uncertainty" />)

    const learningButton = screen.getByRole("button", { name: /обучение/i })
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для timeDilation", () => {
    render(<LearningMode visualizationType="timeDilation" />)

    const learningButton = screen.getByRole("button", { name: /обучение/i })
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для blackHole", () => {
    render(<LearningMode visualizationType="blackHole" />)

    const learningButton = screen.getByRole("button", { name: /обучение/i })
    expect(learningButton).not.toBeDisabled()
  })

  it("имеет правильный модуль для massEnergy", () => {
    render(<LearningMode visualizationType="massEnergy" />)

    const learningButton = screen.getByRole("button", { name: /обучение/i })
    expect(learningButton).not.toBeDisabled()
  })
})
