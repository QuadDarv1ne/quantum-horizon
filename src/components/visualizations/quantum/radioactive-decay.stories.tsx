import type { Meta, StoryObj } from "@storybook/react"
import { RadioactiveDecayVisualization } from "./radioactive-decay"

const meta = {
  title: "Visualizations/Quantum/RadioactiveDecay",
  component: RadioactiveDecayVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioactiveDecayVisualization>

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
