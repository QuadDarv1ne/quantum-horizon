import type { Meta, StoryObj } from "@storybook/react"
import { PhotoelectricEffectVisualization } from "./photoelectric-effect"

const meta = {
  title: "Visualizations/Quantum/PhotoelectricEffect",
  component: PhotoelectricEffectVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoelectricEffectVisualization>

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
