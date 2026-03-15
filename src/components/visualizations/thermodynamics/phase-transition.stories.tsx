import type { Meta, StoryObj } from "@storybook/react"
import { PhaseTransitionVisualization } from "./phase-transition"

const meta = {
  title: "Visualizations/Thermodynamics/PhaseTransition",
  component: PhaseTransitionVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isDark: {
      control: "boolean",
      description: "Dark theme",
    },
  },
} satisfies Meta<typeof PhaseTransitionVisualization>

export default meta
type Story = StoryObj<typeof meta>

export const Dark: Story = {
  args: {
    isDark: true,
  },
}

export const Light: Story = {
  args: {
    isDark: false,
  },
}
