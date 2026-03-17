import { describe, it, expect } from "vitest"
import {
  G,
  c,
  h,
  h_bar,
  k_B,
  M_SUN,
  eV,
  m_e,
  m_p,
  epsilon_0,
  mu_0,
  e,
  R_E,
  M_E,
  AU,
  sigma_SB,
} from "./constants"

describe("Physical Constants", () => {
  it("G (gravitational constant) has correct value", () => {
    expect(G).toBeCloseTo(6.674e-11, 5)
    expect(G).toBeGreaterThan(0)
  })

  it("c (speed of light) has correct value", () => {
    expect(c).toBeCloseTo(2.998e8, 5)
    expect(c).toBeGreaterThan(0)
  })

  it("h (Planck constant) has correct value", () => {
    expect(h).toBeCloseTo(6.626e-34, 5)
    expect(h).toBeGreaterThan(0)
  })

  it("h_bar (reduced Planck constant) is calculated correctly", () => {
    const expected = h / (2 * Math.PI)
    expect(h_bar).toBeCloseTo(expected, 10)
  })

  it("k_B (Boltzmann constant) has correct value", () => {
    expect(k_B).toBeCloseTo(1.381e-23, 5)
    expect(k_B).toBeGreaterThan(0)
  })

  it("M_SUN (solar mass) has correct value", () => {
    expect(M_SUN).toBeCloseTo(1.989e30, 5)
    expect(M_SUN).toBeGreaterThan(0)
  })

  it("eV (electron-volt) has correct value", () => {
    expect(eV).toBeCloseTo(1.602e-19, 5)
    expect(eV).toBeGreaterThan(0)
  })

  it("m_e (electron mass) has correct value", () => {
    expect(m_e).toBeCloseTo(9.109e-31, 5)
    expect(m_e).toBeGreaterThan(0)
  })

  it("m_p (proton mass) has correct value", () => {
    expect(m_p).toBeCloseTo(1.673e-27, 5)
    expect(m_p).toBeGreaterThan(0)
  })

  it("epsilon_0 (vacuum permittivity) has correct value", () => {
    expect(epsilon_0).toBeCloseTo(8.854e-12, 5)
    expect(epsilon_0).toBeGreaterThan(0)
  })

  it("mu_0 (vacuum permeability) has correct value", () => {
    const expected = 4 * Math.PI * 1e-7
    expect(mu_0).toBeCloseTo(expected, 10)
  })

  it("e (elementary charge) has correct value", () => {
    expect(e).toBeCloseTo(1.602e-19, 5)
    expect(e).toBeGreaterThan(0)
  })

  it("R_E (Earth radius) has correct value", () => {
    expect(R_E).toBeCloseTo(6.371e6, 5)
    expect(R_E).toBeGreaterThan(0)
  })

  it("M_E (Earth mass) has correct value", () => {
    expect(M_E).toBeCloseTo(5.972e24, 5)
    expect(M_E).toBeGreaterThan(0)
  })

  it("AU (astronomical unit) has correct value", () => {
    expect(AU).toBeCloseTo(1.496e11, 5)
    expect(AU).toBeGreaterThan(0)
  })

  it("sigma_SB (Stefan-Boltzmann constant) has correct value", () => {
    expect(sigma_SB).toBeCloseTo(5.67e-8, 5)
    expect(sigma_SB).toBeGreaterThan(0)
  })

  it("all constants are positive numbers", () => {
    const constants = [
      G,
      c,
      h,
      h_bar,
      k_B,
      M_SUN,
      eV,
      m_e,
      m_p,
      epsilon_0,
      mu_0,
      e,
      R_E,
      M_E,
      AU,
      sigma_SB,
    ]
    constants.forEach((constant) => {
      expect(typeof constant).toBe("number")
      expect(constant).toBeGreaterThan(0)
    })
  })
})
