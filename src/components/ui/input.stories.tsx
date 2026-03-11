import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: {
    type: "text",
    placeholder: "Enter text...",
  },
}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number...",
  },
}

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled input...",
    disabled: true,
  },
}

export const WithDefaultValue: Story = {
  args: {
    type: "text",
    defaultValue: "Pre-filled value",
  },
}
