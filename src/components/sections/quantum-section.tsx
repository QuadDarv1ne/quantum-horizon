"use client"

import { memo } from "react"
import { useTranslations } from "next-intl"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
import {
  WaveFunctionVisualization,
  UncertaintyVisualization,
  TunnelingVisualization,
} from "@/components/visualizations/lazy"

interface QuantumSectionProps {
  isDark: boolean
}

export const QuantumSection = memo(function QuantumSection({ isDark }: QuantumSectionProps) {
  const t = useTranslations()

  return (
    <>
      <VisualizationCard
        title={t("waveFunction")}
        description={t("waveFunctionDesc")}
        color="purple"
        isDark={isDark}
      >
        <WaveFunctionVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("uncertainty")}
        description={t("uncertaintyDesc")}
        color="blue"
        isDark={isDark}
      >
        <UncertaintyVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("tunneling")}
        description={t("tunnelingDesc")}
        color="green"
        isDark={isDark}
      >
        <TunnelingVisualization isDark={isDark} />
      </VisualizationCard>
    </>
  )
})
