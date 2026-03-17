"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Category = "mechanics" | "electromagnetism" | "quantum" | "relativity"

interface Formula {
  id: string
  name: string
  inputs: string[]
  unit: string
  calc: (inputs: Record<string, number>) => number
}

const FORMULAS: Record<Category, Formula[]> = {
  mechanics: [
    {
      id: "kinetic_energy",
      name: "E = ½mv²",
      inputs: ["m", "v"],
      unit: "Дж",
      calc: (i) => 0.5 * i.m * i.v * i.v,
    },
    {
      id: "potential_energy",
      name: "E = mgh",
      inputs: ["m", "g", "h"],
      unit: "Дж",
      calc: (i) => i.m * i.g * i.h,
    },
    { id: "force", name: "F = ma", inputs: ["m", "a"], unit: "Н", calc: (i) => i.m * i.a },
    { id: "momentum", name: "p = mv", inputs: ["m", "v"], unit: "кг·м/с", calc: (i) => i.m * i.v },
    {
      id: "work",
      name: "W = F·s·cos(θ)",
      inputs: ["F", "s", "theta"],
      unit: "Дж",
      calc: (i) => i.F * i.s * Math.cos((i.theta * Math.PI) / 180),
    },
    { id: "power", name: "P = W/t", inputs: ["W", "t"], unit: "Вт", calc: (i) => i.W / i.t },
    { id: "pressure", name: "P = F/S", inputs: ["F", "S"], unit: "Па", calc: (i) => i.F / i.S },
    {
      id: "velocity_freefall",
      name: "v = √(2gh)",
      inputs: ["g", "h"],
      unit: "м/с",
      calc: (i) => Math.sqrt(2 * i.g * i.h),
    },
  ],
  electromagnetism: [
    { id: "ohm_law", name: "U = IR", inputs: ["I", "R"], unit: "В", calc: (i) => i.I * i.R },
    {
      id: "power_electric",
      name: "P = UI",
      inputs: ["U", "I"],
      unit: "Вт",
      calc: (i) => i.U * i.I,
    },
    {
      id: "resistance",
      name: "R = ρL/S",
      inputs: ["rho", "L", "S"],
      unit: "Ом",
      calc: (i) => (i.rho * i.L) / i.S,
    },
    {
      id: "coulomb",
      name: "F = kq₁q₂/r²",
      inputs: ["q1", "q2", "r"],
      unit: "Н",
      calc: (i) => (8.99e9 * i.q1 * i.q2) / (i.r * i.r),
    },
    {
      id: "capacitance",
      name: "C = ε₀εS/d",
      inputs: ["epsilon", "S", "d"],
      unit: "Ф",
      calc: (i) => (8.85e-12 * i.epsilon * i.S) / i.d,
    },
    {
      id: "energy_capacitor",
      name: "E = ½CU²",
      inputs: ["C", "U"],
      unit: "Дж",
      calc: (i) => 0.5 * i.C * i.U * i.U,
    },
    {
      id: "magnetic_force",
      name: "F = BILsin(θ)",
      inputs: ["B", "I", "L", "theta"],
      unit: "Н",
      calc: (i) => i.B * i.I * i.L * Math.sin((i.theta * Math.PI) / 180),
    },
  ],
  quantum: [
    {
      id: "photon_energy",
      name: "E = hf",
      inputs: ["f"],
      unit: "Дж",
      calc: (i) => 6.626e-34 * i.f,
    },
    { id: "de_broglie", name: "λ = h/p", inputs: ["p"], unit: "м", calc: (i) => 6.626e-34 / i.p },
    {
      id: "de_broglie_mv",
      name: "λ = h/mv",
      inputs: ["m", "v"],
      unit: "м",
      calc: (i) => 6.626e-34 / (i.m * i.v),
    },
    {
      id: "uncertainty_xp",
      name: "Δx·Δp ≥ ℏ/2",
      inputs: ["delta_x"],
      unit: "кг·м/с",
      calc: (i) => 1.055e-34 / (2 * i.delta_x),
    },
    {
      id: "energy_levels",
      name: "Eₙ = -13.6/n² эВ",
      inputs: ["n"],
      unit: "эВ",
      calc: (i) => -13.6 / (i.n * i.n),
    },
    {
      id: "photon_momentum",
      name: "p = h/λ",
      inputs: ["lambda"],
      unit: "кг·м/с",
      calc: (i) => 6.626e-34 / i.lambda,
    },
    {
      id: "photoelectric",
      name: "Eₖ = hf - A",
      inputs: ["f", "A"],
      unit: "Дж",
      calc: (i) => 6.626e-34 * i.f - i.A,
    },
  ],
  relativity: [
    {
      id: "lorentz_factor",
      name: "γ = 1/√(1-v²/c²)",
      inputs: ["v_fraction"],
      unit: "",
      calc: (i) => 1 / Math.sqrt(1 - i.v_fraction * i.v_fraction),
    },
    {
      id: "time_dilation",
      name: "t' = t/γ",
      inputs: ["t", "v_fraction"],
      unit: "с",
      calc: (i) => i.t / (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction)),
    },
    {
      id: "length_contraction",
      name: "L' = L/γ",
      inputs: ["L", "v_fraction"],
      unit: "м",
      calc: (i) => i.L * Math.sqrt(1 - i.v_fraction * i.v_fraction),
    },
    {
      id: "mass_energy",
      name: "E = mc²",
      inputs: ["m"],
      unit: "Дж",
      calc: (i) => i.m * 8.98755179e16,
    },
    {
      id: "relativistic_mass",
      name: "m' = γm₀",
      inputs: ["m0", "v_fraction"],
      unit: "кг",
      calc: (i) => i.m0 / Math.sqrt(1 - i.v_fraction * i.v_fraction),
    },
    {
      id: "relativistic_ke",
      name: "Eₖ = (γ-1)mc²",
      inputs: ["m", "v_fraction"],
      unit: "Дж",
      calc: (i) => (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction) - 1) * i.m * 8.98755179e16,
    },
  ],
}

const INPUT_LABELS: Record<string, string> = {
  m: "Масса m (кг)",
  v: "Скорость v (м/с)",
  g: "Ускорение g (м/с²)",
  h: "Высота h (м)",
  a: "Ускорение a (м/с²)",
  F: "Сила F (Н)",
  s: "Расстояние s (м)",
  theta: "Угол θ (°)",
  W: "Работа W (Дж)",
  t: "Время t (с)",
  S: "Площадь S (м²)",
  I: "Сила тока I (А)",
  R: "Сопротивление R (Ом)",
  U: "Напряжение U (В)",
  P: "Мощность P (Вт)",
  rho: "Уд. сопротивление ρ (Ом·м)",
  L: "Длина L (м)",
  q1: "Заряд q₁ (Кл)",
  q2: "Заряд q₂ (Кл)",
  r: "Расстояние r (м)",
  epsilon: "Диэл. проницаемость ε",
  d: "Расстояние d (м)",
  C: "Ёмкость C (Ф)",
  B: "Индукция B (Тл)",
  f: "Частота f (Гц)",
  p: "Импульс p (кг·м/с)",
  lambda: "Длина волны λ (м)",
  delta_x: "Неопр. позиции Δx (м)",
  n: "Квантовое число n",
  A: "Работа выхода A (Дж)",
  v_fraction: "Скорость v/c (0-0.999)",
  m0: "Масса покоя m₀ (кг)",
}

const CATEGORY_LABELS: Record<Category, string> = {
  mechanics: "⚙️ Механика",
  electromagnetism: "⚡ Электричество",
  quantum: "⚛️ Квантовая физика",
  relativity: "🚀 Относительность",
}

export function FormulaCalculator() {
  const [category, setCategory] = useState<Category>("mechanics")
  const [formula, setFormula] = useState("kinetic_energy")
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [resultUnit, setResultUnit] = useState("")

  const currentFormula = FORMULAS[category].find((f) => f.id === formula) ?? FORMULAS[category][0]

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat)
    setInputs({})
    setResult(null)
    setFormula(FORMULAS[cat][0].id)
  }

  const calculate = () => {
    try {
      const values: Record<string, number> = {}
      for (const key of currentFormula.inputs) {
        const val = parseFloat(inputs[key] || "0")
        if (isNaN(val)) {
          setResult("Ошибка: введите корректные числа")
          return
        }
        values[key] = val
      }
      const res = currentFormula.calc(values)
      if (isNaN(res) || !isFinite(res)) {
        setResult("Ошибка: неверный результат")
        return
      }
      setResult(res.toExponential(6))
      setResultUnit(currentFormula.unit)
    } catch {
      setResult("Ошибка вычисления")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FORMULAS) as Category[]).map((cat) => (
          <Button
            key={cat}
            onClick={() => {
              handleCategoryChange(cat)
            }}
            variant={category === cat ? "default" : "outline"}
            size="sm"
            className={`text-xs ${category === cat ? "bg-purple-600" : ""}`}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-purple-400">Выберите формулу:</label>
        <div className="flex flex-wrap gap-2">
          {FORMULAS[category].map((f) => (
            <Button
              key={f.id}
              onClick={() => {
                setFormula(f.id)
                setInputs({})
                setResult(null)
              }}
              variant={formula === f.id ? "default" : "outline"}
              size="sm"
              className={`font-mono text-xs ${formula === f.id ? "bg-cyan-600" : "border-cyan-500/50 text-cyan-300"}`}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currentFormula.inputs.map((input) => (
          <div key={input} className="space-y-1">
            <label className="text-xs text-gray-400">{INPUT_LABELS[input] || input}</label>
            <input
              type="number"
              step="any"
              value={inputs[input] || ""}
              onChange={(e) => {
                setInputs({ ...inputs, [input]: e.target.value })
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
              placeholder={input}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
      >
        🧮 Вычислить
      </Button>

      {result && (
        <div className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4">
          <div className="mb-1 text-xs text-purple-400">Результат:</div>
          <div className="font-mono text-2xl text-white">
            {result} {resultUnit && <span className="text-lg text-cyan-400">{resultUnit}</span>}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-gray-800/30 p-3 text-xs">
        <div className="mb-2 text-gray-400">📋 Константы:</div>
        <div className="grid grid-cols-2 gap-2 text-gray-500">
          <div>c = 2.998×10⁸ м/с</div>
          <div>h = 6.626×10⁻³⁴ Дж·с</div>
          <div>G = 6.674×10⁻¹¹ Н·м²/кг²</div>
          <div>ℏ = 1.055×10⁻³⁴ Дж·с</div>
          <div>e = 1.602×10⁻¹⁹ Кл</div>
          <div>ε₀ = 8.854×10⁻¹² Ф/м</div>
        </div>
      </div>
    </div>
  )
}
