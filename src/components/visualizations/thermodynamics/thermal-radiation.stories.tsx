import type { Meta, StoryObj } from "@storybook/react"
import { ThermalRadiationVisualization } from "./thermal-radiation"

const meta = {
  title: "Visualizations/Thermodynamics/ThermalRadiation",
  component: ThermalRadiationVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isDark: {
      control: "boolean",
      description: "Dark theme",
    },
  },
} satisfies Meta<typeof ThermalRadiationVisualization>

export default meta
type Story = StoryObj<typeof meta>

export const Dark: Story = {
  args: {
    isDark: true,
  },
}

export const Light: Story = {
  args: {
    isDark: false,
  },
}
