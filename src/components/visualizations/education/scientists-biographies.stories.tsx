import type { Meta, StoryObj } from "@storybook/react"
import { ScientistsBiographies } from "./scientists-biographies"

const meta = {
  title: "Visualizations/Education/ScientistsBiographies",
  component: ScientistsBiographies,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScientistsBiographies>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
