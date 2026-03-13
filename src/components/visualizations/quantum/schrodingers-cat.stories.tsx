import type { Meta, StoryObj } from "@storybook/react"
import { SchrodingersCatVisualization } from "./schrodingers-cat"

const meta = {
  title: "Visualizations/Quantum/SchrodingersCat",
  component: SchrodingersCatVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SchrodingersCatVisualization>

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
