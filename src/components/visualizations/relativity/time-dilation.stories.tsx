import type { Meta, StoryObj } from "@storybook/react"
import { TimeDilationVisualization } from "./time-dilation"

const meta = {
  title: "Visualizations/Relativity/TimeDilation",
  component: TimeDilationVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimeDilationVisualization>

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
