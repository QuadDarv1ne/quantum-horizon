import type { Meta, StoryObj } from "@storybook/react"
import { LengthContractionVisualization } from "./length-contraction"

const meta = {
  title: "Visualizations/Relativity/LengthContraction",
  component: LengthContractionVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LengthContractionVisualization>

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
