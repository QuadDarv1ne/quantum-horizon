import type { Meta, StoryObj } from "@storybook/react"
import { TunnelingVisualization } from "./tunneling"

const meta = {
  title: "Visualizations/Quantum/Tunneling",
  component: TunnelingVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TunnelingVisualization>

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
