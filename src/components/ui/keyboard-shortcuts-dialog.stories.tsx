import type { Meta, StoryObj } from "@storybook/react"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"

const meta = {
  title: "UI/KeyboardShortcutsDialog",
  component: KeyboardShortcutsDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KeyboardShortcutsDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
