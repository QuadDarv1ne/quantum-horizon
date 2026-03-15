// Физические формулы и расчёты

import { G, c, h_bar, k_B, M_SUN, m_e, e, epsilon_0, R_H, a_0, sigma, h, R, N_A, wiensConstant } from "./constants"

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

/**
 * Расчёт энергии связи ядра
 * E_b = Δm·c² (дефект массы)
 */
export function bindingEnergy(massDefect: number): number {
  return massDefect * c * c
}

/**
 * Расчёт периода полураспада
 * N(t) = N₀ · e^(-λt)
 */
export function radioactiveDecay(
  initialAmount: number,
  decayConstant: number,
  time: number
): number {
  return initialAmount * Math.exp(-decayConstant * time)
}

/**
 * Расчёт активности радиоактивного источника
 * A = λN
 */
export function radioactivity(decayConstant: number, numberOfNuclei: number): number {
  return decayConstant * numberOfNuclei
}

/**
 * Расчёт критической плотности Вселенной
 * ρ_c = 3H₀² / (8πG)
 */
export function criticalDensity(hubbleConstant: number): number {
  return (3 * hubbleConstant * hubbleConstant) / (8 * Math.PI * G)
}

/**
 * Расчёт красного смещения
 * z = (λ_obs - λ_emit) / λ_emit
 */
export function redshift(observedWavelength: number, emittedWavelength: number): number {
  return (observedWavelength - emittedWavelength) / emittedWavelength
}

/**
 * Расчёт скорости удаления галактики (закон Хаббла)
 * v = H₀ · d
 */
export function hubbleLaw(hubbleConstant: number, distance: number): number {
  return hubbleConstant * distance
}

/**
 * Расчёт светимости звезды
 * L = 4πR²σT⁴
 */
export function stellarLuminosity(radius: number, temperature: number): number {
  return 4 * Math.PI * radius * radius * sigma * Math.pow(temperature, 4)
}

/**
 * Расчёт абсолютной звёздной величины
 * M = m - 5·log₁₀(d/10)
 */
export function absoluteMagnitude(apparentMagnitude: number, distanceParsecs: number): number {
  return apparentMagnitude - 5 * Math.log10(distanceParsecs / 10)
}

/**
 * Расчёт расстояния по параллаксу
 * d = 1/p (в парсеках)
 */
export function parallaxDistance(parallaxAngle: number): number {
  return 1 / parallaxAngle
}

/**
 * Расчёт энергии связи электрона в атоме водорода
 * E = -13.6 eV / n²
 */
export function electronBindingEnergy(n: number): number {
  return -13.6 / (n * n)
}

/**
 * Расчёт частоты гравитационных волн от двойной системы
 * f = (1/π) · √(GM/a³)
 */
export function gravitationalWaveFrequency(totalMass: number, separation: number): number {
  return (1 / Math.PI) * Math.sqrt((G * totalMass) / Math.pow(separation, 3))
}

/**
 * Расчёт мощности гравитационного излучения
 * P = (32/5) · (G⁴/c⁵) · (m₁²m₂²(m₁+m₂))/a⁵
 */
export function gravitationalWavePower(mass1: number, mass2: number, separation: number): number {
  const numerator = 32 * Math.pow(G, 4) * Math.pow(mass1, 2) * Math.pow(mass2, 2) * (mass1 + mass2)
  const denominator = 5 * Math.pow(c, 5) * Math.pow(separation, 5)
  return numerator / denominator
}

/**
 * Расчёт температуры реликтового излучения на красном смещении z
 * T(z) = T₀ · (1 + z)
 */
export function cmbTemperatureAtRedshift(z: number, T0 = 2.725): number {
  return T0 * (1 + z)
}

/**
 * Расчёт комптоновского рассеяния (изменение длины волны)
 * Δλ = (h/mₑc) · (1 - cos θ)
 */
export function comptonScattering(scatteringAngle: number): number {
  const lambdaC = h / (m_e * c)
  return lambdaC * (1 - Math.cos(scatteringAngle))
}

/**
 * Расчёт вероятности туннелирования (приближённо)
 * T ≈ e^(-2κL), где κ = √(2m(V-E))/ℏ
 */
export function tunnelingProbability(
  particleMass: number,
  barrierHeight: number,
  particleEnergy: number,
  barrierWidth: number
): number {
  if (particleEnergy >= barrierHeight) return 1

  const kappa = Math.sqrt(2 * particleMass * (barrierHeight - particleEnergy)) / h_bar
  return Math.exp(-2 * kappa * barrierWidth)
}

/**
 * Расчёт гиромагнитного отношения для электрона
 * γ = -e/(2mₑ)
 */
export function gyromagneticRatio(): number {
  return -e / (2 * m_e)
}

/**
 * Расчёт магнитного момента Бора
 * μ_B = eℏ/(2mₑ)
 */
export function bohrMagneton(): number {
  return (e * h_bar) / (2 * m_e)
}

/**
 * Расчёт длины волны теплового излучения (закон смещения Вина)
 * λ_max = b/T, где b = 2.898×10⁻³ м·К
 */
export function wiensDisplacementLaw(temperature: number): number {
  return wiensConstant / temperature
}

/**
 * Расчёт спектральной плотности энергии чёрного тела (закон Планка)
 * B(λ,T) = (2hc²/λ⁵) · 1/(e^(hc/λkT) - 1)
 */
export function plancksLaw(wavelength: number, temperature: number): number {
  const numerator = 2 * h * Math.pow(c, 2) / Math.pow(wavelength, 5)
  const exponent = (h * c) / (wavelength * k_B * temperature)
  const denominator = Math.exp(exponent) - 1
  return numerator / denominator
}

/**
 * Расчёт полной мощности излучения чёрного тела (закон Стефана-Больцмана)
 * P = σAT⁴
 */
export function stefanBoltzmannLaw(area: number, temperature: number): number {
  return sigma * area * Math.pow(temperature, 4)
}

/**
 * Расчёт энтропии идеального газа
 * S = Nk[ln(V/Nλ³) + 5/2], где λ - тепловая длина волны де Бройля
 */
export function idealGasEntropy(N: number, V: number, temperature: number): number {
  const lambdaThermal = h / Math.sqrt(2 * Math.PI * m_e * k_B * temperature)
  return N * k_B * (Math.log(V / (N * Math.pow(lambdaThermal, 3))) + 2.5)
}

/**
 * Расчёт изменения энтропии при теплопередаче
 * ΔS = Q/T
 */
export function entropyChange(heat: number, temperature: number): number {
  return heat / temperature
}

/**
 * Расчёт эффективности цикла Карно
 * η = 1 - T_c/T_h
 */
export function carnotEfficiency(temperatureCold: number, temperatureHot: number): number {
  return 1 - temperatureCold / temperatureHot
}

/**
 * Уравнение состояния идеального газа
 * PV = nRT
 */
export function idealGasLaw(pressure: number, volume: number, moles: number, temperature: number): {
  calculated: number
  expected: number
  matches: boolean
} {
  const calculated = pressure * volume
  const expected = moles * R * temperature
  return {
    calculated,
    expected,
    matches: Math.abs(calculated - expected) < 1e-6,
  }
}

/**
 * Расчёт средней кинетической энергии молекулы
 * ⟨E⟩ = (3/2)kT
 */
export function averageKineticEnergy(temperature: number): number {
  return (3 / 2) * k_B * temperature
}

/**
 * Расчёт средней квадратичной скорости молекул
 * v_rms = √(3kT/m)
 */
export function rmsVelocity(temperature: number, mass: number): number {
  return Math.sqrt((3 * k_B * temperature) / mass)
}

/**
 * Расчёт работы изотермического расширения
 * W = nRT·ln(V₂/V₁)
 */
export function isothermalWork(moles: number, temperature: number, V1: number, V2: number): number {
  return moles * R * temperature * Math.log(V2 / V1)
}

/**
 * Расчёт работы адиабатического процесса
 * W = (P₁V₁ - P₂V₂)/(γ-1)
 */
export function adiabaticWork(P1: number, V1: number, P2: number, V2: number, gamma: number): number {
  return (P1 * V1 - P2 * V2) / (gamma - 1)
}

/**
 * Расчёт фазового перехода (скрытая теплота)
 * Q = mL
 */
export function latentHeat(mass: number, specificLatentHeat: number): number {
  return mass * specificLatentHeat
}

/**
 * Расчёт давления насыщенного пара (уравнение Клапейрона-Клаузиуса, приближённо)
 * ln(P₂/P₁) = (L/R)·(1/T₁ - 1/T₂)
 */
export function clapeyronClausius(
  P1: number,
  T1: number,
  T2: number,
  latentHeatOfVaporization: number
): number {
  const lnRatio = (latentHeatOfVaporization / R) * (1 / T1 - 1 / T2)
  return P1 * Math.exp(lnRatio)
}
