import type { Meta, StoryObj } from "@storybook/react"
import { StatisticsDashboard } from "./statistics-dashboard"

const meta = {
  title: "UI/StatisticsDashboard",
  component: StatisticsDashboard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatisticsDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
