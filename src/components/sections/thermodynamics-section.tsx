"use client"

import { memo } from "react"
import { useTranslations } from "next-intl"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
import {
  ThermalRadiationVisualization,
  EntropyVisualization,
  PhaseTransitionVisualization,
  IdealGasVisualization,
  CarnotEngineVisualization,
} from "@/components/visualizations/lazy"

interface ThermodynamicsSectionProps {
  isDark: boolean
}

export const ThermodynamicsSection = memo(function ThermodynamicsSection({
  isDark,
}: ThermodynamicsSectionProps) {
  const t = useTranslations()

  return (
    <>
      <VisualizationCard
        title={t("thermalRadiation")}
        description={t("thermalRadiationDesc")}
        color="orange"
        isDark={isDark}
      >
        <ThermalRadiationVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("entropy")}
        description={t("entropyDesc")}
        color="blue"
        isDark={isDark}
      >
        <EntropyVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("phaseTransition")}
        description={t("phaseTransitionDesc")}
        color="cyan"
        isDark={isDark}
      >
        <PhaseTransitionVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("idealGas")}
        description={t("idealGasDesc")}
        color="green"
        isDark={isDark}
      >
        <IdealGasVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("carnotEngine")}
        description={t("carnotEngineDesc")}
        color="red"
        isDark={isDark}
      >
        <CarnotEngineVisualization isDark={isDark} />
      </VisualizationCard>
    </>
  )
})
