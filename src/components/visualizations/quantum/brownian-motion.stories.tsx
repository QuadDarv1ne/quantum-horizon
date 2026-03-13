import type { Meta, StoryObj } from "@storybook/react"
import { BrownianMotionVisualization } from "./brownian-motion"

const meta = {
  title: "Visualizations/Quantum/BrownianMotion",
  component: BrownianMotionVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrownianMotionVisualization>

export default meta
type Story = StoryObj<typeof meta>

export const DarkMode: Story = {
  args: {
    isDark: true,
  },
}

export const LightMode: Story = {
  args: {
    isDark: false,
  },
}
