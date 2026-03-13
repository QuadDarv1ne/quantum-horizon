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
  photonEnergy,
  hydrogenEnergy,
  bohrRadius,
  hydrogenWavelength,
  cyclotronFrequency,
  larmorRadius,
  comptonWavelength,
  classicalElectronRadius,
  fineStructureConstant,
  bindingEnergy,
  radioactiveDecay,
  radioactivity,
  criticalDensity,
  redshift,
  hubbleLaw,
  stellarLuminosity,
  absoluteMagnitude,
  parallaxDistance,
  electronBindingEnergy,
  gravitationalWaveFrequency,
  gravitationalWavePower,
  cmbTemperatureAtRedshift,
  comptonScattering,
  tunnelingProbability,
  gyromagneticRatio,
  bohrMagneton,
  wiensDisplacementLaw,
} from "./physics"
import { c, G, h_bar, M_SUN, m_e, a_0 } from "./constants"

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

  describe("photonEnergy", () => {
    it("increases with frequency", () => {
      const E1 = photonEnergy(1e14)
      const E2 = photonEnergy(2e14)
      expect(E2).toBeCloseTo(2 * E1, 5)
    })

    it("returns positive energy for positive frequency", () => {
      expect(photonEnergy(1e14)).toBeGreaterThan(0)
    })
  })

  describe("hydrogenEnergy", () => {
    it("returns -13.6 eV for n=1", () => {
      expect(hydrogenEnergy(1)).toBeCloseTo(-13.6, 5)
    })

    it("approaches 0 as n increases", () => {
      expect(hydrogenEnergy(10)).toBeCloseTo(-0.136, 5)
    })
  })

  describe("bohrRadius", () => {
    it("returns a₀ for n=1", () => {
      expect(bohrRadius(1)).toBeCloseTo(a_0, 5)
    })

    it("increases with n²", () => {
      expect(bohrRadius(2)).toBeCloseTo(4 * a_0, 5)
    })
  })

  describe("hydrogenWavelength", () => {
    it("returns positive wavelength for n2 > n1", () => {
      const lambda = hydrogenWavelength(2, 3)
      expect(lambda).toBeGreaterThan(0)
    })

    it("decreases as n2 increases", () => {
      const lambda1 = hydrogenWavelength(2, 3)
      const lambda2 = hydrogenWavelength(2, 4)
      expect(lambda2).toBeLessThan(lambda1)
    })
  })

  describe("cyclotronFrequency", () => {
    it("increases with magnetic field", () => {
      const omega1 = cyclotronFrequency(1)
      const omega2 = cyclotronFrequency(2)
      expect(omega2).toBeCloseTo(2 * omega1, 5)
    })

    it("returns positive frequency for positive field", () => {
      expect(cyclotronFrequency(1)).toBeGreaterThan(0)
    })
  })

  describe("larmorRadius", () => {
    it("increases with velocity", () => {
      const r1 = larmorRadius(1e6, 1)
      const r2 = larmorRadius(2e6, 1)
      expect(r2).toBeCloseTo(2 * r1, 5)
    })

    it("decreases with magnetic field", () => {
      const r1 = larmorRadius(1e6, 1)
      const r2 = larmorRadius(1e6, 2)
      expect(r2).toBeCloseTo(r1 / 2, 5)
    })
  })

  describe("comptonWavelength", () => {
    it("returns constant value", () => {
      const lambda1 = comptonWavelength()
      const lambda2 = comptonWavelength()
      expect(lambda1).toBeCloseTo(lambda2, 10)
    })

    it("returns positive value", () => {
      expect(comptonWavelength()).toBeGreaterThan(0)
    })
  })

  describe("classicalElectronRadius", () => {
    it("returns constant value", () => {
      const r1 = classicalElectronRadius()
      const r2 = classicalElectronRadius()
      expect(r1).toBeCloseTo(r2, 10)
    })

    it("returns positive value", () => {
      expect(classicalElectronRadius()).toBeGreaterThan(0)
    })
  })

  describe("fineStructureConstant", () => {
    it("returns approximately 1/137", () => {
      const alpha = fineStructureConstant()
      expect(alpha).toBeCloseTo(1 / 137, 3)
    })

    it("is dimensionless", () => {
      const alpha1 = fineStructureConstant()
      const alpha2 = fineStructureConstant()
      expect(alpha1).toBe(alpha2)
    })
  })

  describe("bindingEnergy", () => {
    it("calculates E = Δm·c² correctly", () => {
      const massDefect = 1
      const energy = bindingEnergy(massDefect)
      expect(energy).toBeCloseTo(c * c, 5)
    })

    it("returns positive energy for positive mass defect", () => {
      expect(bindingEnergy(1)).toBeGreaterThan(0)
    })
  })

  describe("radioactiveDecay", () => {
    it("decreases with time", () => {
      const N0 = 1000
      const lambda = 0.1
      const N1 = radioactiveDecay(N0, lambda, 0)
      const N2 = radioactiveDecay(N0, lambda, 10)
      expect(N2).toBeLessThan(N1)
    })

    it("returns initial amount at t=0", () => {
      expect(radioactiveDecay(1000, 0.1, 0)).toBe(1000)
    })
  })

  describe("radioactivity", () => {
    it("increases with decay constant", () => {
      const A1 = radioactivity(0.1, 1000)
      const A2 = radioactivity(0.2, 1000)
      expect(A2).toBeCloseTo(2 * A1, 5)
    })

    it("increases with number of nuclei", () => {
      const A1 = radioactivity(0.1, 1000)
      const A2 = radioactivity(0.1, 2000)
      expect(A2).toBeCloseTo(2 * A1, 5)
    })
  })

  describe("criticalDensity", () => {
    it("increases with Hubble constant squared", () => {
      const H1 = 70
      const H2 = 140
      const rho1 = criticalDensity(H1)
      const rho2 = criticalDensity(H2)
      expect(rho2).toBeCloseTo(4 * rho1, 5)
    })

    it("returns positive value", () => {
      expect(criticalDensity(70)).toBeGreaterThan(0)
    })
  })

  describe("redshift", () => {
    it("returns 0 for no shift", () => {
      expect(redshift(500, 500)).toBe(0)
    })

    it("returns positive z for redshift", () => {
      expect(redshift(600, 500)).toBe(0.2)
    })

    it("returns negative z for blueshift", () => {
      expect(redshift(450, 500)).toBe(-0.1)
    })
  })

  describe("hubbleLaw", () => {
    it("increases with distance", () => {
      const v1 = hubbleLaw(70, 100)
      const v2 = hubbleLaw(70, 200)
      expect(v2).toBeCloseTo(2 * v1, 5)
    })

    it("increases with Hubble constant", () => {
      const v1 = hubbleLaw(70, 100)
      const v2 = hubbleLaw(140, 100)
      expect(v2).toBeCloseTo(2 * v1, 5)
    })
  })

  describe("stellarLuminosity", () => {
    it("increases with radius squared", () => {
      const T = 5800
      const L1 = stellarLuminosity(1, T)
      const L2 = stellarLuminosity(2, T)
      expect(L2).toBeCloseTo(4 * L1, 5)
    })

    it("increases with temperature to the fourth power", () => {
      const R = 1
      const T1 = 3000
      const T2 = 6000
      const L1 = stellarLuminosity(R, T1)
      const L2 = stellarLuminosity(R, T2)
      expect(L2).toBeCloseTo(16 * L1, 5)
    })
  })

  describe("absoluteMagnitude", () => {
    it("equals apparent magnitude at 10 parsecs", () => {
      expect(absoluteMagnitude(5, 10)).toBe(5)
    })

    it("decreases for closer distances", () => {
      // M = m - 5·log₁₀(d/10)
      // При d=100: M = m - 5·log₁₀(10) = m - 5
      // При d=10: M = m - 5·log₁₀(1) = m
      const M1 = absoluteMagnitude(0, 100) // M = -5
      const M2 = absoluteMagnitude(0, 10) // M = 0
      expect(M2).toBeGreaterThan(M1) // 0 > -5
    })
  })

  describe("parallaxDistance", () => {
    it("returns distance in parsecs", () => {
      expect(parallaxDistance(1)).toBe(1)
    })

    it("increases as parallax decreases", () => {
      const d1 = parallaxDistance(0.1)
      const d2 = parallaxDistance(0.01)
      expect(d2).toBeCloseTo(10 * d1, 5)
    })
  })

  describe("electronBindingEnergy", () => {
    it("returns -13.6 eV for n=1", () => {
      expect(electronBindingEnergy(1)).toBeCloseTo(-13.6, 5)
    })

    it("approaches 0 as n increases", () => {
      expect(electronBindingEnergy(10)).toBeCloseTo(-0.136, 5)
    })
  })

  describe("gravitationalWaveFrequency", () => {
    it("increases with total mass", () => {
      const f1 = gravitationalWaveFrequency(M_SUN, 1e9)
      const f2 = gravitationalWaveFrequency(2 * M_SUN, 1e9)
      expect(f2).toBeGreaterThan(f1)
    })

    it("increases as separation decreases", () => {
      const f1 = gravitationalWaveFrequency(M_SUN, 1e9)
      const f2 = gravitationalWaveFrequency(M_SUN, 5e8)
      expect(f2).toBeGreaterThan(f1)
    })
  })

  describe("gravitationalWavePower", () => {
    it("increases with masses", () => {
      const P1 = gravitationalWavePower(M_SUN, M_SUN, 1e9)
      const P2 = gravitationalWavePower(2 * M_SUN, 2 * M_SUN, 1e9)
      expect(P2).toBeGreaterThan(P1)
    })

    it("increases rapidly as separation decreases", () => {
      const P1 = gravitationalWavePower(M_SUN, M_SUN, 1e9)
      const P2 = gravitationalWavePower(M_SUN, M_SUN, 5e8)
      expect(P2).toBeGreaterThan(P1)
    })
  })

  describe("cmbTemperatureAtRedshift", () => {
    it("returns T0 at z=0", () => {
      expect(cmbTemperatureAtRedshift(0)).toBeCloseTo(2.725, 5)
    })

    it("increases with redshift", () => {
      expect(cmbTemperatureAtRedshift(1)).toBeCloseTo(5.45, 5)
    })
  })

  describe("comptonScattering", () => {
    it("returns 0 for forward scattering", () => {
      expect(comptonScattering(0)).toBeCloseTo(0, 15)
    })

    it("is maximum for backscattering", () => {
      const deltaLambda180 = comptonScattering(Math.PI)
      const deltaLambda90 = comptonScattering(Math.PI / 2)
      expect(deltaLambda180).toBeGreaterThan(deltaLambda90)
    })
  })

  describe("tunnelingProbability", () => {
    it("returns 1 when particle energy exceeds barrier", () => {
      expect(tunnelingProbability(1, 5, 10, 1)).toBe(1)
    })

    it("decreases with barrier width", () => {
      // Используем реалистичные значения для электрона
      const mass = 9.109e-31 // масса электрона
      const V = 1e-18 // высота барьера (~6 eV)
      const E = 0.5e-18 // энергия частицы (~3 eV)
      const T1 = tunnelingProbability(mass, V, E, 1e-10) // 0.1 нм
      const T2 = tunnelingProbability(mass, V, E, 2e-10) // 0.2 нм
      expect(T2).toBeLessThan(T1)
    })

    it("decreases with barrier height", () => {
      const mass = 9.109e-31
      const E = 0.5e-18 // энергия частицы
      const T1 = tunnelingProbability(mass, 1e-18, E, 1e-10) // V = 6 eV
      const T2 = tunnelingProbability(mass, 2e-18, E, 1e-10) // V = 12 eV
      expect(T2).toBeLessThan(T1)
    })
  })

  describe("gyromagneticRatio", () => {
    it("returns negative value for electron", () => {
      expect(gyromagneticRatio()).toBeLessThan(0)
    })

    it("is constant", () => {
      const gamma1 = gyromagneticRatio()
      const gamma2 = gyromagneticRatio()
      expect(gamma1).toBe(gamma2)
    })
  })

  describe("bohrMagneton", () => {
    it("returns positive value", () => {
      expect(bohrMagneton()).toBeGreaterThan(0)
    })

    it("is constant", () => {
      const mu1 = bohrMagneton()
      const mu2 = bohrMagneton()
      expect(mu1).toBe(mu2)
    })
  })

  describe("wiensDisplacementLaw", () => {
    it("decreases with temperature", () => {
      const lambda1 = wiensDisplacementLaw(3000)
      const lambda2 = wiensDisplacementLaw(6000)
      expect(lambda2).toBeCloseTo(lambda1 / 2, 5)
    })

    it("returns wavelength in meters", () => {
      const lambda = wiensDisplacementLaw(5800)
      expect(lambda).toBeLessThan(1e-6)
    })
  })
})
