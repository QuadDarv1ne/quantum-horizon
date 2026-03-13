/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { WaveFunctionVisualization } from "./wave-function"

const messages = {
  canvas: {
    waveFunction: {
      measureModeActive: "✋ Click to Measure",
      measureModeInactive: "🎲 Measure Mode",
      schrodinger: "Schrödinger equation solution:",
      energyFormula: "E_n = n²π²ℏ² / 2mL²",
      energyQuantized: "Energy is quantized!",
      probabilityDetection: "Click to measure",
      copyUrl: "Copy URL",
    },
  },
}

describe("WaveFunctionVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WaveFunctionVisualization isDark={true} />
      </NextIntlClientProvider>
    )

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
  })
})
