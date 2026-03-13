// Base components
export { VisualizationCanvas } from "./base/visualization-canvas"
export { VisualizationControls } from "./base/visualization-controls"
export { VisualizationSelector } from "./base/visualization-selector"
export { FullscreenWrapper } from "./base/fullscreen-wrapper"

// Lazy-loaded components (for code splitting)
export * from "./lazy"

// Eager-loaded components (backward compatibility)
// Use lazy exports above for better performance
export { WaveFunctionVisualization } from "./quantum/wave-function"
export { UncertaintyVisualization } from "./quantum/uncertainty"
export { TunnelingVisualization } from "./quantum/tunneling"
export { DoubleSlitVisualization } from "./quantum/double-slit"
export { PhotoelectricEffectVisualization } from "./quantum/photoelectric-effect"
export { BrownianMotionVisualization } from "./quantum/brownian-motion"
export { SchrodingersCatVisualization } from "./quantum/schrodingers-cat"

// Relativity visualizations
export { TimeDilationVisualization } from "./relativity/time-dilation"
export { LengthContractionVisualization } from "./relativity/length-contraction"
export { MassEnergyVisualization } from "./relativity/mass-energy"

// Cosmos visualizations
export { BlackHoleVisualization } from "./cosmos/black-hole"
export { HRDiagramVisualization } from "./cosmos/hr-diagram"
export { NeutronStarVisualization } from "./cosmos/neutron-star"
export { DarkMatterVisualization } from "./cosmos/dark-matter"
export { WhiteHoleVisualization } from "./cosmos/white-hole"
export { BigBangVisualization } from "./cosmos/big-bang"
export { StandardModelVisualization } from "./cosmos/standard-model"
export { CMBVisualization } from "./cosmos/cmb"
export { DarkEnergyVisualization } from "./cosmos/dark-energy"
export { SolarSystemVisualization } from "./cosmos/solar-system"

// Advanced visualizations
export { GravitationalWavesVisualization } from "./advanced/gravitational-waves"
export { QuantumEntanglementVisualization } from "./quantum/quantum-entanglement"
export { AtomicModelVisualization } from "./quantum/atomic-model"
export { RadioactiveDecayVisualization } from "./quantum/radioactive-decay"
export { SuperconductivityVisualization } from "./quantum/superconductivity"

// Education components
export { PhysicsQuiz } from "./education/physics-quiz"
