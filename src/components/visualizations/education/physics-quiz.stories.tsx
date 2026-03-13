import type { Meta, StoryObj } from "@storybook/react"
import { PhysicsQuiz } from "./physics-quiz"

const meta = {
  title: "Visualizations/Education/PhysicsQuiz",
  component: PhysicsQuiz,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhysicsQuiz>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
