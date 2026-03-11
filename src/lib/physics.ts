// Физические формулы и расчёты

import { G, c, h_bar, k_B } from "./constants"

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
