import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"
import { Label } from "./label"
import { Button } from "./button"

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
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">{args.placeholder || "Email"}</Label>
      <Input {...args} id="email" />
    </div>
  ),
  args: {
    type: "email",
    placeholder: "Email",
  },
}

export const WithText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-2">{args.placeholder || "Email"}</Label>
      <Input {...args} id="email-2" />
      <p className="text-muted-foreground text-sm">Enter your email address.</p>
    </div>
  ),
  args: {
    type: "email",
    placeholder: "Email",
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input...",
    disabled: true,
  },
}

export const File: Story = {
  args: {
    type: "file",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
}

export const Invalid: Story = {
  args: {
    placeholder: "Invalid input...",
    "aria-invalid": true,
  },
}

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
}
