import type { Meta, StoryObj } from "@storybook/react"
import { CMBVisualization } from "./cmb"

const meta = {
  title: "Visualizations/Cosmos/CMB",
  component: CMBVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CMBVisualization>

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
