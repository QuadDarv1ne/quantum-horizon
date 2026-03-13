import type { Meta, StoryObj } from "@storybook/react"
import { PhysicsTimeline } from "./physics-timeline"

const meta = {
  title: "Visualizations/Education/PhysicsTimeline",
  component: PhysicsTimeline,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicsTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
