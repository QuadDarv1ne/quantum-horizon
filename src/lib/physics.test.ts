import { describe, it, expect } from "vitest"
import {
  lorentzFactor,
  timeDilation,
  lengthContraction,
  restEnergy,
  schwarzschildRadius,
  hawkingTemperature,
  waveFunction,
  probabilityDensity,
  particleInBoxEnergy,
  deBroglieWavelength,
  uncertaintyPrinciple,
} from "./physics"
import { c, G, h_bar, M_SUN, m_e } from "./constants"

describe("Physics formulas", () => {
  describe("lorentzFactor", () => {
    it("returns 1 for zero velocity", () => {
      expect(lorentzFactor(0)).toBe(1)
    })

    it("increases with velocity", () => {
      const gamma1 = lorentzFactor(0.5 * c)
      const gamma2 = lorentzFactor(0.9 * c)
      expect(gamma2).toBeGreaterThan(gamma1)
    })

    it("approaches infinity as v approaches c", () => {
      const gamma = lorentzFactor(0.99 * c)
      expect(gamma).toBeGreaterThan(7)
    })
  })

  describe("timeDilation", () => {
    it("returns proper time for zero velocity", () => {
      expect(timeDilation(10, 0)).toBe(10)
    })

    it("dilates time at high velocities", () => {
      const dilated = timeDilation(10, 0.866 * c)
      expect(dilated).toBeLessThan(10)
    })
  })

  describe("lengthContraction", () => {
    it("returns proper length for zero velocity", () => {
      expect(lengthContraction(10, 0)).toBe(10)
    })

    it("contracts length at high velocities", () => {
      const contracted = lengthContraction(10, 0.866 * c)
      expect(contracted).toBeLessThan(10)
    })
  })

  describe("restEnergy", () => {
    it("calculates E = mc² correctly", () => {
      const mass = 1
      const energy = restEnergy(mass)
      expect(energy).toBeCloseTo(c * c, 5)
    })

    it("returns positive energy for positive mass", () => {
      expect(restEnergy(1)).toBeGreaterThan(0)
    })
  })

  describe("schwarzschildRadius", () => {
    it("calculates r_s = 2GM/c² correctly", () => {
      const mass = M_SUN
      const r_s = schwarzschildRadius(mass)
      expect(r_s).toBeCloseTo((2 * G * mass) / (c * c), 5)
    })

    it("increases with mass", () => {
      const r1 = schwarzschildRadius(M_SUN)
      const r2 = schwarzschildRadius(2 * M_SUN)
      expect(r2).toBe(2 * r1)
    })
  })

  describe("hawkingTemperature", () => {
    it("decreases with mass", () => {
      const T1 = hawkingTemperature(M_SUN)
      const T2 = hawkingTemperature(2 * M_SUN)
      expect(T2).toBeCloseTo(T1 / 2, 5)
    })

    it("is positive for positive mass", () => {
      expect(hawkingTemperature(M_SUN)).toBeGreaterThan(0)
    })
  })

  describe("waveFunction", () => {
    it("returns 0 at boundaries", () => {
      const L = 1
      expect(waveFunction(0, L, 1)).toBeCloseTo(0, 10)
      expect(waveFunction(L, L, 1)).toBeCloseTo(0, 10)
    })

    it("has maximum at L/2 for n=1", () => {
      const L = 1
      const psi = waveFunction(L / 2, L, 1)
      expect(psi).toBeCloseTo(Math.sqrt(2 / L), 10)
    })

    it("normalizes correctly", () => {
      const L = 1
      const n = 1
      const psi = waveFunction(L / 4, L, n)
      expect(psi).toBeGreaterThan(0)
      expect(psi).toBeLessThan(Math.sqrt(2 / L))
    })
  })

  describe("probabilityDensity", () => {
    it("is always non-negative", () => {
      const L = 1
      const n = 1
      for (let x = 0; x <= L; x += 0.1) {
        expect(probabilityDensity(x, L, n)).toBeGreaterThanOrEqual(0)
      }
    })

    it("is 0 at boundaries", () => {
      const L = 1
      expect(probabilityDensity(0, L, 1)).toBeCloseTo(0, 10)
      expect(probabilityDensity(L, L, 1)).toBeCloseTo(0, 10)
    })
  })

  describe("particleInBoxEnergy", () => {
    it("increases with n²", () => {
      const L = 1e-10
      const E1 = particleInBoxEnergy(1, L, m_e)
      const E2 = particleInBoxEnergy(2, L, m_e)
      expect(E2).toBeCloseTo(4 * E1, 5)
    })

    it("decreases with L²", () => {
      const L1 = 1e-10
      const L2 = 2e-10
      const E1 = particleInBoxEnergy(1, L1, m_e)
      const E2 = particleInBoxEnergy(1, L2, m_e)
      expect(E2).toBeCloseTo(E1 / 4, 5)
    })
  })

  describe("deBroglieWavelength", () => {
    it("decreases with momentum", () => {
      const p1 = 1e-24
      const p2 = 2e-24
      const lambda1 = deBroglieWavelength(p1)
      const lambda2 = deBroglieWavelength(p2)
      expect(lambda2).toBeCloseTo(lambda1 / 2, 5)
    })

    it("is positive for positive momentum", () => {
      expect(deBroglieWavelength(1e-24)).toBeGreaterThan(0)
    })
  })

  describe("uncertaintyPrinciple", () => {
    it("returns ℏ/2Δx", () => {
      const deltaX = 1e-10
      const deltaP = uncertaintyPrinciple(deltaX)
      expect(deltaP).toBeCloseTo(h_bar / (2 * deltaX), 5)
    })

    it("decreases as Δx increases", () => {
      const deltaP1 = uncertaintyPrinciple(1e-10)
      const deltaP2 = uncertaintyPrinciple(2e-10)
      expect(deltaP2).toBeCloseTo(deltaP1 / 2, 5)
    })
  })
})
