import type { Meta, StoryObj } from "@storybook/react"
import { LearningMode } from "./learning-mode"

const meta = {
  title: "UI/LearningMode",
  component: LearningMode,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    visualizationType: {
      control: "select",
      options: [
        "waveFunction",
        "uncertainty",
        "timeDilation",
        "blackHole",
        "massEnergy",
        "unknown",
      ],
    },
  },
} satisfies Meta<typeof LearningMode>

export default meta
type Story = StoryObj<typeof meta>

export const WaveFunction: Story = {
  args: {
    visualizationType: "waveFunction",
  },
}

export const Uncertainty: Story = {
  args: {
    visualizationType: "uncertainty",
  },
}

export const TimeDilation: Story = {
  args: {
    visualizationType: "timeDilation",
  },
}

export const BlackHole: Story = {
  args: {
    visualizationType: "blackHole",
  },
}

export const MassEnergy: Story = {
  args: {
    visualizationType: "massEnergy",
  },
}

export const Unavailable: Story = {
  args: {
    visualizationType: "unknown",
  },
}
