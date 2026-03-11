import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
}

export const Destructive: Story = {
  args: {
    ...Default.args,
    variant: "destructive",
  },
}

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: "outline",
  },
}

export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
}

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: "ghost",
  },
}

export const Link: Story = {
  args: {
    ...Default.args,
    variant: "link",
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
}

export const Icon: Story = {
  args: {
    children: "🔍",
    size: "icon",
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
