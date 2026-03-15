// Lazy-loaded visualization components for code splitting
import dynamic from "next/dynamic"
import { VisualizationCardSkeleton } from "@/components/ui/loading-skeleton"

// Quantum visualizations
export const WaveFunctionVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/wave-function").then((mod) => ({
      default: mod.WaveFunctionVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const UncertaintyVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/uncertainty").then((mod) => ({
      default: mod.UncertaintyVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const TunnelingVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/tunneling").then((mod) => ({
      default: mod.TunnelingVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const DoubleSlitVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/double-slit").then((mod) => ({
      default: mod.DoubleSlitVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const PhotoelectricEffectVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/photoelectric-effect").then((mod) => ({
      default: mod.PhotoelectricEffectVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const BrownianMotionVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/brownian-motion").then((mod) => ({
      default: mod.BrownianMotionVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const SchrodingersCatVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/schrodingers-cat").then((mod) => ({
      default: mod.SchrodingersCatVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const QuantumEntanglementVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/quantum-entanglement").then((mod) => ({
      default: mod.QuantumEntanglementVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const AtomicModelVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/atomic-model").then((mod) => ({
      default: mod.AtomicModelVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const RadioactiveDecayVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/radioactive-decay").then((mod) => ({
      default: mod.RadioactiveDecayVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const SuperconductivityVisualization = dynamic(
  () =>
    import("@/components/visualizations/quantum/superconductivity").then((mod) => ({
      default: mod.SuperconductivityVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Relativity visualizations
export const TimeDilationVisualization = dynamic(
  () =>
    import("@/components/visualizations/relativity/time-dilation").then((mod) => ({
      default: mod.TimeDilationVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const LengthContractionVisualization = dynamic(
  () =>
    import("@/components/visualizations/relativity/length-contraction").then((mod) => ({
      default: mod.LengthContractionVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const MassEnergyVisualization = dynamic(
  () =>
    import("@/components/visualizations/relativity/mass-energy").then((mod) => ({
      default: mod.MassEnergyVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Cosmos visualizations
export const BlackHoleVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/black-hole").then((mod) => ({
      default: mod.BlackHoleVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const HRDiagramVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/hr-diagram").then((mod) => ({
      default: mod.HRDiagramVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const NeutronStarVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/neutron-star").then((mod) => ({
      default: mod.NeutronStarVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const DarkMatterVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/dark-matter").then((mod) => ({
      default: mod.DarkMatterVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const WhiteHoleVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/white-hole").then((mod) => ({
      default: mod.WhiteHoleVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const BigBangVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/big-bang").then((mod) => ({
      default: mod.BigBangVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const StandardModelVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/standard-model").then((mod) => ({
      default: mod.StandardModelVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Advanced visualizations
export const GravitationalWavesVisualization = dynamic(
  () =>
    import("@/components/visualizations/advanced/gravitational-waves").then((mod) => ({
      default: mod.GravitationalWavesVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Education components
export const PhysicsQuiz = dynamic(
  () =>
    import("@/components/visualizations/education/physics-quiz").then((mod) => ({
      default: mod.PhysicsQuiz,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const PhysicsTimeline = dynamic(
  () =>
    import("@/components/visualizations/education/physics-timeline").then((mod) => ({
      default: mod.PhysicsTimeline,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const ScientistsBiographies = dynamic(
  () =>
    import("@/components/visualizations/education/scientists-biographies").then((mod) => ({
      default: mod.ScientistsBiographies,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const FormulaCalculator = dynamic(
  () =>
    import("@/components/visualizations/education/formula-calculator").then((mod) => ({
      default: mod.FormulaCalculator,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Additional cosmos visualizations
export const SolarSystemVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/solar-system").then((mod) => ({
      default: mod.SolarSystemVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const CMBVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/cmb").then((mod) => ({
      default: mod.CMBVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const DarkEnergyVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/dark-energy").then((mod) => ({
      default: mod.DarkEnergyVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// New cosmos visualizations
export const WormholeVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/wormhole").then((mod) => ({
      default: mod.WormholeVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const PulsarVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/pulsar").then((mod) => ({
      default: mod.PulsarVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const QuasarVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/quasar").then((mod) => ({
      default: mod.QuasarVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const ProtoplanetaryDiskVisualization = dynamic(
  () =>
    import("@/components/visualizations/cosmos/protoplanetary-disk").then((mod) => ({
      default: mod.ProtoplanetaryDiskVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

// Thermodynamics visualizations
export const ThermalRadiationVisualization = dynamic(
  () =>
    import("@/components/visualizations/thermodynamics/thermal-radiation").then((mod) => ({
      default: mod.ThermalRadiationVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const EntropyVisualization = dynamic(
  () =>
    import("@/components/visualizations/thermodynamics/entropy").then((mod) => ({
      default: mod.EntropyVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const PhaseTransitionVisualization = dynamic(
  () =>
    import("@/components/visualizations/thermodynamics/phase-transition").then((mod) => ({
      default: mod.PhaseTransitionVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const IdealGasVisualization = dynamic(
  () =>
    import("@/components/visualizations/thermodynamics/ideal-gas").then((mod) => ({
      default: mod.IdealGasVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)

export const CarnotEngineVisualization = dynamic(
  () =>
    import("@/components/visualizations/thermodynamics/carnot-engine").then((mod) => ({
      default: mod.CarnotEngineVisualization,
    })),
  {
    loading: () => <VisualizationCardSkeleton />,
    ssr: false,
  }
)
