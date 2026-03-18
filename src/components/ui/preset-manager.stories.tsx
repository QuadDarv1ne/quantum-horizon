import type { Meta, StoryObj } from "@storybook/react"
import { PresetManager } from "./preset-manager"

const meta = {
  title: "UI/PresetManager",
  component: PresetManager,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    visualizationType: {
      control: "select",
      options: ["waveFunction", "uncertainty", "timeDilation", "blackHole", "massEnergy"],
    },
  },
} satisfies Meta<typeof PresetManager>

export default meta
type Story = StoryObj<typeof meta>

export const WaveFunction: Story = {
  args: {
    visualizationType: "waveFunction",
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

export const Uncertainty: Story = {
  args: {
    visualizationType: "uncertainty",
  },
}

export const MassEnergy: Story = {
  args: {
    visualizationType: "massEnergy",
  },
}
