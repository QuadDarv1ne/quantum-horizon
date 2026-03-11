import type { Meta, StoryObj } from "@storybook/react"
import { LanguageSwitcher } from "./language-switcher"
import { NextIntlClientProvider } from "next-intl"

const meta = {
  title: "UI/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider
        locale="ru"
        messages={{
          theme: "Theme",
          language: "Language",
          fullscreen: "Fullscreen",
          exitFullscreen: "Exit",
        }}
      >
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
