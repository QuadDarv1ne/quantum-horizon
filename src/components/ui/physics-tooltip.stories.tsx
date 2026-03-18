import type { Meta, StoryObj } from "@storybook/react"
import { PhysicsTooltip } from "./physics-tooltip"

const meta = {
  title: "UI/PhysicsTooltip",
  component: PhysicsTooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["button", "inline", "card"],
    },
  },
} satisfies Meta<typeof PhysicsTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const ButtonVariant: Story = {
  args: {
    visualizationType: "waveFunction",
    variant: "button",
  },
}

export const InlineVariant: Story = {
  args: {
    visualizationType: "uncertainty",
    variant: "inline",
  },
}

export const CardVariant: Story = {
  args: {
    visualizationType: "blackHole",
    variant: "card",
  },
}

export const TimeDilation: Story = {
  args: {
    visualizationType: "timeDilation",
    variant: "button",
  },
}

export const QuantumEntanglement: Story = {
  args: {
    visualizationType: "quantumEntanglement",
    variant: "card",
  },
}

export const BigBang: Story = {
  args: {
    visualizationType: "bigBang",
    variant: "button",
  },
}
