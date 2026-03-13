import type { Meta, StoryObj } from "@storybook/react"
import { QuantumEntanglementVisualization } from "./quantum-entanglement"

const meta = {
  title: "Visualizations/Quantum/QuantumEntanglement",
  component: QuantumEntanglementVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof QuantumEntanglementVisualization>

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
