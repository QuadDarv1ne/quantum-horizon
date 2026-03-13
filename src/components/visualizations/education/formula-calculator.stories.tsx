import type { Meta, StoryObj } from "@storybook/react"
import { FormulaCalculator } from "./formula-calculator"

const meta = {
  title: "Visualizations/Education/FormulaCalculator",
  component: FormulaCalculator,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormulaCalculator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
