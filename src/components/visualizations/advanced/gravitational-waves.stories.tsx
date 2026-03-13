import type { Meta, StoryObj } from "@storybook/react"
import { GravitationalWavesVisualization } from "./gravitational-waves"

const meta = {
  title: "Visualizations/Advanced/GravitationalWaves",
  component: GravitationalWavesVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GravitationalWavesVisualization>

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
