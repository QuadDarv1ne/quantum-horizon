"use client"

import { memo } from "react"
import { useTranslations } from "next-intl"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
import {
  DoubleSlitVisualization,
  DarkMatterVisualization,
  GravitationalWavesVisualization,
  QuantumEntanglementVisualization,
  AtomicModelVisualization,
  RadioactiveDecayVisualization,
  SuperconductivityVisualization,
  StandardModelVisualization,
  FormulaCalculator,
  PhysicsTimeline,
  PhysicsQuiz,
  ScientistsBiographies,
} from "@/components/visualizations/lazy"

interface AdvancedSectionProps {
  isDark: boolean
}

export const AdvancedSection = memo(function AdvancedSection({ isDark }: AdvancedSectionProps) {
  const t = useTranslations()

  return (
    <>
      <VisualizationCard
        title={t("doubleSlit")}
        description={t("doubleSlitDesc")}
        color="pink"
        isDark={isDark}
      >
        <DoubleSlitVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("darkMatter")}
        description={t("darkMatterDesc")}
        color="purple"
        isDark={isDark}
      >
        <DarkMatterVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("gravitationalWaves")}
        description={t("gravitationalWavesDesc")}
        color="purple"
        isDark={isDark}
      >
        <GravitationalWavesVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("quantumEntanglement")}
        description={t("quantumEntanglementDesc")}
        color="pink"
        isDark={isDark}
      >
        <QuantumEntanglementVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("atomicModel")}
        description={t("atomicModelDesc")}
        color="cyan"
        isDark={isDark}
      >
        <AtomicModelVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("radioactiveDecay")}
        description={t("radioactiveDecayDesc")}
        color="green"
        isDark={isDark}
      >
        <RadioactiveDecayVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("superconductivity")}
        description={t("superconductivityDesc")}
        color="cyan"
        isDark={isDark}
      >
        <SuperconductivityVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("standardModel")}
        description={t("standardModelDesc")}
        color="yellow"
        isDark={isDark}
      >
        <StandardModelVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("calculator")}
        description={t("calculatorDesc")}
        color="purple"
        isDark={isDark}
      >
        <FormulaCalculator />
      </VisualizationCard>

      <VisualizationCard
        title={t("timeline")}
        description={t("timelineDesc")}
        color="purple"
        isDark={isDark}
      >
        <PhysicsTimeline />
      </VisualizationCard>

      <VisualizationCard
        title={t("physicsQuiz")}
        description={t("physicsQuizDesc")}
        color="cyan"
        isDark={isDark}
      >
        <PhysicsQuiz />
      </VisualizationCard>

      <VisualizationCard
        title={t("scientists")}
        description={t("scientistsDesc")}
        color="yellow"
        isDark={isDark}
      >
        <ScientistsBiographies />
      </VisualizationCard>
    </>
  )
})
