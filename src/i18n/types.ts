// Типы для переводов next-intl
// Автоматически генерируются на основе структуры JSON файлов в src/i18n/translations/

// Базовый тип для всех ключей переводов
export interface TranslationKeys {
  // Основные навигационные элементы
  title: string
  subtitle: string
  quantum: string
  relativity: string
  cosmos: string
  advanced: string

  // Квантовая механика
  waveFunction: string
  waveFunctionDesc: string
  uncertainty: string
  uncertaintyDesc: string
  tunneling: string
  tunnelingDesc: string
  schrodingersCat: string
  schrodingersCatDesc: string
  doubleSlit: string
  doubleSlitDesc: string
  darkMatter: string
  darkMatterDesc: string

  // Специальная теория относительности
  timeDilation: string
  timeDilationDesc: string
  lengthContraction: string
  lengthContractionDesc: string
  massEnergy: string
  massEnergyDesc: string

  // Звёздная эволюция и космология
  hrDiagram: string
  hrDiagramDesc: string
  neutronStar: string
  neutronStarDesc: string
  blackHole: string
  blackHoleDesc: string
  whiteHole: string
  whiteHoleDesc: string
  solarSystem: string
  solarSystemDesc: string
  cmb: string
  cmbDesc: string
  darkEnergy: string
  darkEnergyDesc: string
  bigBang: string
  bigBangDesc: string

  // Продвинутые темы
  gravitationalWaves: string
  gravitationalWavesDesc: string
  quantumEntanglement: string
  quantumEntanglementDesc: string
  atomicModel: string
  atomicModelDesc: string
  radioactiveDecay: string
  radioactiveDecayDesc: string
  superconductivity: string
  superconductivityDesc: string
  standardModel: string
  standardModelDesc: string
  photoelectric: string
  photoelectricDesc: string
  brownianMotion: string
  brownianMotionDesc: string

  // Образовательные компоненты
  calculator: string
  calculatorDesc: string
  timeline: string
  timelineDesc: string
  physicsQuiz: string
  physicsQuizDesc: string
  scientists: string
  scientistsDesc: string

  // UI элементы
  footer: string
  theme: string
  language: string
  fullscreen: string
  exitFullscreen: string
  mechanics: string
  electromagnetism: string
  calculate: string
  result: string

  // Вложенные переводы для canvas компонентов
  canvas: {
    waveFunction: {
      title: string
      label: string
      quantumNumber: string
      probability: string
      waveFunction: string
      measure: string
      schrodinger: string
      energyFormula: string
      energyQuantized: string
    }
    uncertainty: {
      title: string
      positionSpace: string
      momentumSpace: string
      fourierTransform: string
      uncertaintyPosition: string
      uncertaintyExact: string
      uncertaintyBlurred: string
      minMomentum: string
      philosophical: string
    }
    tunneling: {
      title: string
      energy: string
      barrier: string
      transmissionProb: string
      incidentWave: string
      transmittedWave: string
      tunnelEffect: string
    }
    timeDilation: {
      title: string
      stationaryObserver: string
      movingObserver: string
      velocity: string
      lorentzFactor: string
      timeDilationFactor: string
      description: string
    }
    lengthContraction: {
      title: string
      restLength: string
      contractedLength: string
      velocity: string
      lorentzFactor: string
      description: string
    }
    massEnergy: {
      title: string
      mass: string
      energy: string
      calculate: string
      description: string
    }
    ariaWaveFunction: string
    ariaUncertainty: string
    ariaTunneling: string
    ariaTimeDilation: string
    ariaLengthContraction: string
    ariaMassEnergy: string
  }
}

// Тип для функции перевода с поддержкой вложенных ключей
export type TranslationFunction = (
  key:
    | keyof TranslationKeys
    | `canvas.${keyof TranslationKeys["canvas"]}`
    | `canvas.waveFunction.${keyof TranslationKeys["canvas"]["waveFunction"]}`
    | `canvas.uncertainty.${keyof TranslationKeys["canvas"]["uncertainty"]}`
    | `canvas.tunneling.${keyof TranslationKeys["canvas"]["tunneling"]}`
    | `canvas.timeDilation.${keyof TranslationKeys["canvas"]["timeDilation"]}`
    | `canvas.lengthContraction.${keyof TranslationKeys["canvas"]["lengthContraction"]}`
    | `canvas.massEnergy.${keyof TranslationKeys["canvas"]["massEnergy"]}`
) => string

// Тип для хука useTranslations
export type UseTranslations = () => TranslationFunction

// Тип для namespace переводов
export interface NamespaceTranslations {
  canvas: TranslationKeys["canvas"]
}
