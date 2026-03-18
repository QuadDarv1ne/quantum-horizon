import type { Meta, StoryObj } from "@storybook/react"
import { SatelliteTracker } from "./satellite-tracker"

const meta = {
  title: "API Integrations/Satellite Tracker",
  component: SatelliteTracker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    satelliteId: {
      control: "number",
      description: "NORAD satellite ID (25544 = ISS)",
    },
    showMultipleSatellites: {
      control: "boolean",
      description: "Track multiple satellites simultaneously",
    },
  },
} satisfies Meta<typeof SatelliteTracker>

export default meta
type Story = StoryObj<typeof meta>

// Default story - ISS tracking
export const ISS: Story = {
  args: {
    satelliteId: 25544, // ISS
    showMultipleSatellites: false,
  },
}

// Multiple satellites
export const MultipleSatellites: Story = {
  args: {
    satelliteId: 25544,
    showMultipleSatellites: true,
  },
}

// Chinese Space Station
export const Tiangong: Story = {
  args: {
    satelliteId: 48274, // Tiangong
    showMultipleSatellites: false,
  },
}

// Hubble Space Telescope
export const Hubble: Story = {
  args: {
    satelliteId: 43013, // HST
    showMultipleSatellites: false,
  },
}
