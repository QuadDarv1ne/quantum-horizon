"use client"

import { useTranslations } from "next-intl"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
import {
  HRDiagramVisualization,
  NeutronStarVisualization,
  BlackHoleVisualization,
  WhiteHoleVisualization,
  SolarSystemVisualization,
  CMBVisualization,
  DarkEnergyVisualization,
  WormholeVisualization,
  PulsarVisualization,
  QuasarVisualization,
  ProtoplanetaryDiskVisualization,
} from "@/components/visualizations/lazy"

interface CosmosSectionProps {
  isDark: boolean
}

export function CosmosSection({ isDark }: CosmosSectionProps) {
  const t = useTranslations()

  return (
    <>
      <VisualizationCard
        title={t("hrDiagram")}
        description={t("hrDiagramDesc")}
        color="blue"
        isDark={isDark}
      >
        <HRDiagramVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("neutronStar")}
        description={t("neutronStarDesc")}
        color="cyan"
        isDark={isDark}
      >
        <NeutronStarVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("blackHole")}
        description={t("blackHoleDesc")}
        color="red"
        isDark={isDark}
      >
        <BlackHoleVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("whiteHole")}
        description={t("whiteHoleDesc")}
        color="cyan"
        isDark={isDark}
      >
        <WhiteHoleVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("solarSystem")}
        description={t("solarSystemDesc")}
        color="yellow"
        isDark={isDark}
      >
        <SolarSystemVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard title={t("cmb")} description={t("cmbDesc")} color="blue" isDark={isDark}>
        <CMBVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("darkEnergy")}
        description={t("darkEnergyDesc")}
        color="purple"
        isDark={isDark}
      >
        <DarkEnergyVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("wormhole")}
        description={t("wormholeDesc")}
        color="purple"
        isDark={isDark}
      >
        <WormholeVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("pulsar")}
        description={t("pulsarDesc")}
        color="cyan"
        isDark={isDark}
      >
        <PulsarVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("quasar")}
        description={t("quasarDesc")}
        color="orange"
        isDark={isDark}
      >
        <QuasarVisualization isDark={isDark} />
      </VisualizationCard>

      <VisualizationCard
        title={t("protoplanetaryDisk")}
        description={t("protoplanetaryDiskDesc")}
        color="green"
        isDark={isDark}
      >
        <ProtoplanetaryDiskVisualization isDark={isDark} />
      </VisualizationCard>
    </>
  )
}
