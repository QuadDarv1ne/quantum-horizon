// Физические формулы и расчёты

import { G, c, h_bar, k_B, m_e, e, epsilon_0, R_H, a_0 } from "./constants"

/**
 * Расчёт фактора Лоренца
 * γ = 1 / √(1 - v²/c²)
 */
export function lorentzFactor(velocity: number): number {
  const v = Math.min(velocity, 0.9999 * c)
  return 1 / Math.sqrt(1 - (v * v) / (c * c))
}

/**
 * Расчёт замедления времени
 * Δt' = Δt / γ
 */
export function timeDilation(properTime: number, velocity: number): number {
  const gamma = lorentzFactor(velocity)
  return properTime / gamma
}

/**
 * Расчёт сокращения длины
 * L = L₀ / γ
 */
export function lengthContraction(properLength: number, velocity: number): number {
  const gamma = lorentzFactor(velocity)
  return properLength / gamma
}

/**
 * Расчёт энергии покоя
 * E = mc²
 */
export function restEnergy(mass: number): number {
  return mass * c * c
}

/**
 * Расчёт радиуса Шварцшильда
 * r_s = 2GM/c²
 */
export function schwarzschildRadius(mass: number): number {
  return (2 * G * mass) / (c * c)
}

/**
 * Расчёт температуры Хокинга
 * T = ℏc³ / (8πGMk_B)
 */
export function hawkingTemperature(mass: number): number {
  return (h_bar * Math.pow(c, 3)) / (8 * Math.PI * G * mass * k_B)
}

/**
 * Расчёт волновой функции частицы в яме
 * ψ(x) = √(2/L) · sin(nπx/L)
 */
export function waveFunction(x: number, L: number, n: number): number {
  return Math.sqrt(2 / L) * Math.sin((n * Math.PI * x) / L)
}

/**
 * Расчёт вероятности нахождения частицы
 * P(x) = |ψ(x)|²
 */
export function probabilityDensity(x: number, L: number, n: number): number {
  const psi = waveFunction(x, L, n)
  return psi * psi
}

/**
 * Расчёт энергии уровня частицы в яме
 * E_n = n²π²ℏ² / (2mL²)
 */
export function particleInBoxEnergy(n: number, L: number, mass: number): number {
  return (Math.pow(n, 2) * Math.pow(Math.PI, 2) * Math.pow(h_bar, 2)) / (2 * mass * Math.pow(L, 2))
}

/**
 * Расчёт длины волны де Бройля
 * λ = h / p
 */
export function deBroglieWavelength(momentum: number): number {
  return (h_bar * 2 * Math.PI) / momentum
}

/**
 * Расчёт принципа неопределённости
 * Δx · Δp ≥ ℏ/2
 */
export function uncertaintyPrinciple(deltaX: number): number {
  return h_bar / (2 * deltaX)
}

/**
 * Расчёт энергии фотона
 * E = hf = ℏω
 */
export function photonEnergy(frequency: number): number {
  return h_bar * 2 * Math.PI * frequency
}

/**
 * Расчёт энергии электрона в атоме водорода
 * E_n = -13.6 eV / n²
 */
export function hydrogenEnergy(n: number): number {
  return -13.6 / (n * n)
}

/**
 * Расчёт радиуса Бора для атома водорода
 * r_n = n² · a₀
 */
export function bohrRadius(n: number): number {
  return n * n * a_0
}

/**
 * Расчёт длины волны спектральной линии водорода
 * 1/λ = R_H · (1/n₁² - 1/n₂²)
 */
export function hydrogenWavelength(n1: number, n2: number): number {
  const invLambda = R_H * (1 / (n1 * n1) - 1 / (n2 * n2))
  return 1 / invLambda
}

/**
 * Расчёт циклотронной частоты
 * ω_c = qB / m
 */
export function cyclotronFrequency(magneticField: number): number {
  return (e * magneticField) / m_e
}

/**
 * Расчёт ларморовского радиуса
 * r_L = mv⊥ / (qB)
 */
export function larmorRadius(perpVelocity: number, magneticField: number): number {
  return (m_e * perpVelocity) / (e * magneticField)
}

/**
 * Расчёт комптоновской длины волны
 * λ_c = h / (m_e·c)
 */
export function comptonWavelength(): number {
  return (h_bar * 2 * Math.PI) / (m_e * c)
}

/**
 * Расчёт классического радиуса электрона
 * r_e = e² / (4πε₀m_ec²)
 */
export function classicalElectronRadius(): number {
  return (e * e) / (4 * Math.PI * epsilon_0 * m_e * c * c)
}

/**
 * Расчёт постоянной тонкой структуры
 * α = e² / (4πε₀ℏc) ≈ 1/137
 */
export function fineStructureConstant(): number {
  return (e * e) / (4 * Math.PI * epsilon_0 * h_bar * c)
}
