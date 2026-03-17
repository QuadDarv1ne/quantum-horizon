"use client"

import { useTranslations } from "next-intl"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
import {
  TimeDilationVisualization,
  LengthContractionVisualization,
  MassEnergyVisualization,
} from "@/components/visualizations/lazy"

interface RelativitySectionProps {
  isDark: boolean
}

export function RelativitySection({ isDark }: RelativitySectionProps) {
  const t = useTranslations()

  return (
    <>
      <VisualizationCard
        title={t("timeDilation")}
        description={t("timeDilationDesc")}
        color="orange"
        isDark={isDark}
      >
        <TimeDilationVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("lengthContraction")}
        description={t("lengthContractionDesc")}
        color="purple"
        isDark={isDark}
      >
        <LengthContractionVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("massEnergy")}
        description={t("massEnergyDesc")}
        color="yellow"
        isDark={isDark}
      >
        <MassEnergyVisualization isDark={isDark} />
      </VisualizationCard>
    </>
  )
}
