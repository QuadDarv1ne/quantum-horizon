// Физические константы
// https://physics.nist.gov/cuu/Constants/

export const G = 6.674e-11 // Гравитационная постоянная, м³·кг⁻¹·с⁻²
export const c = 2.998e8 // Скорость света в вакууме, м/с
export const h = 6.626e-34 // Постоянная Планка, Дж·с
export const ℏ = 1.055e-34 // Приведённая постоянная Планка (h-bar), Дж·с
export const h_bar = ℏ // Алиас для ℏ
export const k_B = 1.381e-23 // Постоянная Больцмана, Дж/К
export const M_SUN = 1.989e30 // Масса Солнца, кг
export const eV = 1.602e-19 // Электрон-вольт, Дж
export const m_e = 9.109e-31 // Масса электрона, кг
export const m_p = 1.673e-27 // Масса протона, кг
export const m_n = 1.675e-27 // Масса нейтрона, кг
export const epsilon_0 = 8.854e-12 // Электрическая постоянная, Ф/м
export const mu_0 = 4 * Math.PI * 1e-7 // Магнитная постоянная, Гн/м
export const e = 1.602e-19 // Элементарный заряд, Кл
export const R_E = 6.371e6 // Радиус Земли, м
export const M_E = 5.972e24 // Масса Земли, кг
export const AU = 1.496e11 // Астрономическая единица, м
export const sigma_SB = 5.67e-8 // Постоянная Стефана-Больцмана, Вт·м⁻²·К⁻⁴
export const sigma = sigma_SB // Алиас для sigma_SB
export const R_H = 1.097e7 // Постоянная Ридберга, м⁻¹
export const a_0 = 5.292e-11 // Боровский радиус, м
export const μ_B = 9.274e-24 // Боровский магнетон, Дж/Тл
export const R = 8.314 // Универсальная газовая постоянная, Дж/(моль·К)
export const N_A = 6.022e23 // Число Авогадро, моль⁻¹
export const wiensConstant = 2.898e-3 // Постоянная Вина, м·К

// Производные константы
export const Z_0 = Math.sqrt(mu_0 / epsilon_0) // Волновое сопротивление вакуума, Ом
