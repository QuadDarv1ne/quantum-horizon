import type { Meta, StoryObj } from "@storybook/react"
import { HRDiagramVisualization } from "./hr-diagram"

const meta = {
  title: "Visualizations/Cosmos/HRDiagram",
  component: HRDiagramVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HRDiagramVisualization>

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
