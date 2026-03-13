import type { Meta, StoryObj } from "@storybook/react"
import { BlackHoleVisualization } from "./black-hole"

const meta = {
  title: "Visualizations/Cosmos/BlackHole",
  component: BlackHoleVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlackHoleVisualization>

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
