'use client'

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// ==================== CONSTANTS ====================
const G = 6.674e-11
const c = 2.998e8
const h = 6.626e-34
const h_bar = h / (2 * Math.PI)
const k_B = 1.381e-23
const M_SUN = 1.989e30
const eV = 1.602e-19
const m_e = 9.109e-31
const m_p = 1.673e-27

// ==================== HELPERS ====================
function setupCanvasContext(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.width = canvas.offsetWidth * 2
  canvas.height = canvas.offsetHeight * 2
  ctx.resetTransform()
  ctx.scale(2, 2)
}

// ==================== TRANSLATIONS ====================
const translations = {
  ru: {
    title: '⧫ QUANTUM HORIZON',
    subtitle: 'От частиц до космоса • From Particles to Cosmos',
    quantum: '⚛️ Кванты',
    relativity: '🚀 Относительность',
    cosmos: '🌌 Космос',
    advanced: '🔬 Продвинутые',
    waveFunction: '🌊 Волновая функция',
    waveFunctionDesc: 'Уравнение Шрёдингера для частицы в яме',
    uncertainty: '📐 Принцип неопределённости',
    uncertaintyDesc: 'Δx·Δp ≥ ℏ/2 — Гейзенберг, 1927',
    tunneling: '🚧 Квантовое туннелирование',
    tunnelingDesc: 'Прохождение сквозь потенциальный барьер',
    timeDilation: '⏱️ Замедление времени',
    timeDilationDesc: 'Специальная теория относительности',
    lengthContraction: '📏 Сокращение длины',
    lengthContractionDesc: 'Лоренцево сокращение',
    massEnergy: '💥 E = mc²',
    massEnergyDesc: 'Эквивалентность массы и энергии',
    hrDiagram: '📊 Диаграмма Герцшпрунга-Рассела',
    hrDiagramDesc: 'Классификация и эволюция звёзд',
    neutronStar: '💫 Нейтронная звезда / Пульсар',
    neutronStarDesc: 'Вращающиеся магнитные диполи',
    blackHole: '🕳️ Чёрная дыра',
    blackHoleDesc: 'С излучением Хокинга и аккреционным диском',
    whiteHole: '⚪ Белая дыра',
    whiteHoleDesc: 'Теоретическая обратная сторона чёрной дыры',
    doubleSlit: '🔬 Эксперимент с двойной щелью',
    doubleSlitDesc: 'Корпускулярно-волновой дуализм',
    darkMatter: '🌀 Тёмная материя',
    darkMatterDesc: 'Кривые вращения галактик',
    schrodingersCat: '🐱 Кот Шрёдингера',
    schrodingersCatDesc: 'Квантовая суперпозиция',
    bigBang: '💥 Большой взрыв',
    bigBangDesc: 'Расширение Вселенной',
    photoelectric: '⚡ Фотоэффект',
    photoelectricDesc: 'Кванты света и электроны',
    brownianMotion: '🔬 Броуновское движение',
    brownianMotionDesc: 'Хаотичное движение частиц',
    gravitationalWaves: '〰️ Гравитационные волны',
    gravitationalWavesDesc: 'Рябь пространства-времени',
    quantumEntanglement: '🔗 Квантовая запутанность',
    quantumEntanglementDesc: 'Спутанность частиц',
    atomicModel: '⚛️ Атомная модель Бора',
    atomicModelDesc: 'Электронные орбиты и квантовые переходы',
    radioactiveDecay: '☢️ Радиоактивный распад',
    radioactiveDecayDesc: 'α, β, γ излучения',
    superconductivity: '❄️ Суперпроводимость',
    superconductivityDesc: 'Эффект Мейсснера',
    standardModel: '🧩 Стандартная модель',
    standardModelDesc: 'Кварки, лептоны, бозоны',
    footer: '⧫ QUANTUM HORIZON • Научные визуализации современной физики',
    theme: 'Тема',
    language: 'Язык',
    fullscreen: 'Полный экран',
    exitFullscreen: 'Выйти',
    calculator: '🧮 Калькулятор формул',
    calculatorDesc: 'Расчёты физических величин',
    mechanics: 'Механика',
    electromagnetism: 'Электричество',
    calculate: 'Вычислить',
    result: 'Результат',
    timeline: '📅 Таймлайн открытий',
    timelineDesc: 'История физики от античности до наших дней',
    solarSystem: '🌍 Солнечная система',
    solarSystemDesc: 'Планеты и их орбиты',
    cmb: '🌡️ Реликтовое излучение',
    cmbDesc: 'Карта ранней Вселенной (CMB)',
    darkEnergy: '💫 Тёмная энергия',
    darkEnergyDesc: 'Расширение Вселенной',
    physicsQuiz: '📝 Тест по физике',
    physicsQuizDesc: 'Проверь свои знания',
    scientists: '👨‍🔬 Учёные',
    scientistsDesc: 'Биографии великих физиков',
  },
  en: {
    title: '⧫ QUANTUM HORIZON',
    subtitle: 'From Particles to Cosmos • От частиц до космоса',
    quantum: '⚛️ Quantum',
    relativity: '🚀 Relativity',
    cosmos: '🌌 Cosmos',
    advanced: '🔬 Advanced',
    waveFunction: '🌊 Wave Function',
    waveFunctionDesc: 'Schrödinger equation for a particle in a well',
    uncertainty: '📐 Uncertainty Principle',
    uncertaintyDesc: 'Δx·Δp ≥ ℏ/2 — Heisenberg, 1927',
    tunneling: '🚧 Quantum Tunneling',
    tunnelingDesc: 'Passing through a potential barrier',
    timeDilation: '⏱️ Time Dilation',
    timeDilationDesc: 'Special theory of relativity',
    lengthContraction: '📏 Length Contraction',
    lengthContractionDesc: 'Lorentz contraction',
    massEnergy: '💥 E = mc²',
    massEnergyDesc: 'Mass-energy equivalence',
    hrDiagram: '📊 Hertzsprung-Russell Diagram',
    hrDiagramDesc: 'Star classification and evolution',
    neutronStar: '💫 Neutron Star / Pulsar',
    neutronStarDesc: 'Rotating magnetic dipoles',
    blackHole: '🕳️ Black Hole',
    blackHoleDesc: 'With Hawking radiation and accretion disk',
    whiteHole: '⚪ White Hole',
    whiteHoleDesc: 'Theoretical reverse of a black hole',
    doubleSlit: '🔬 Double-Slit Experiment',
    doubleSlitDesc: 'Wave-particle duality',
    darkMatter: '🌀 Dark Matter',
    darkMatterDesc: 'Galaxy rotation curves',
    schrodingersCat: '🐱 Schrödinger\'s Cat',
    schrodingersCatDesc: 'Quantum superposition',
    bigBang: '💥 Big Bang',
    bigBangDesc: 'Universe expansion',
    photoelectric: '⚡ Photoelectric Effect',
    photoelectricDesc: 'Light quanta and electrons',
    brownianMotion: '🔬 Brownian Motion',
    brownianMotionDesc: 'Random particle motion',
    gravitationalWaves: '〰️ Gravitational Waves',
    gravitationalWavesDesc: 'Ripples in spacetime',
    quantumEntanglement: '🔗 Quantum Entanglement',
    quantumEntanglementDesc: 'Spooky action at distance',
    atomicModel: '⚛️ Bohr Atomic Model',
    atomicModelDesc: 'Electron orbits and transitions',
    radioactiveDecay: '☢️ Radioactive Decay',
    radioactiveDecayDesc: 'α, β, γ radiation',
    superconductivity: '❄️ Superconductivity',
    superconductivityDesc: 'Meissner effect',
    standardModel: '🧩 Standard Model',
    standardModelDesc: 'Quarks, leptons, bosons',
    footer: '⧫ QUANTUM HORIZON • Scientific visualizations of modern physics',
    theme: 'Theme',
    language: 'Language',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit',
    calculator: '🧮 Formula Calculator',
    calculatorDesc: 'Physical quantities calculations',
    mechanics: 'Mechanics',
    electromagnetism: 'Electricity',
    calculate: 'Calculate',
    result: 'Result',
    timeline: '📅 Timeline of Discoveries',
    timelineDesc: 'History of physics from antiquity to modern times',
    solarSystem: '🌍 Solar System',
    solarSystemDesc: 'Planets and their orbits',
    cmb: '🌡️ Cosmic Microwave Background',
    cmbDesc: 'Map of the early universe',
    darkEnergy: '💫 Dark Energy',
    darkEnergyDesc: 'Universe expansion',
    physicsQuiz: '📝 Physics Quiz',
    physicsQuizDesc: 'Test your knowledge',
    scientists: '👨‍🔬 Scientists',
    scientistsDesc: 'Biographies of great physicists',
  },
  zh: {
    title: '⧫ QUANTUM HORIZON',
    subtitle: '从粒子到宇宙 • From Particles to Cosmos',
    quantum: '⚛️ 量子',
    relativity: '🚀 相对论',
    cosmos: '🌌 宇宙',
    advanced: '🔬 高级',
    waveFunction: '🌊 波函数',
    waveFunctionDesc: '势阱中粒子的薛定谔方程',
    uncertainty: '📐 不确定性原理',
    uncertaintyDesc: 'Δx·Δp ≥ ℏ/2 — 海森堡, 1927',
    tunneling: '🚧 量子隧穿',
    tunnelingDesc: '穿越势垒',
    timeDilation: '⏱️ 时间膨胀',
    timeDilationDesc: '狭义相对论',
    lengthContraction: '📏 长度收缩',
    lengthContractionDesc: '洛伦兹收缩',
    massEnergy: '💥 E = mc²',
    massEnergyDesc: '质能等价',
    hrDiagram: '📊 赫罗图',
    hrDiagramDesc: '恒星分类与演化',
    neutronStar: '💫 中子星 / 脉冲星',
    neutronStarDesc: '旋转磁偶极子',
    blackHole: '🕳️ 黑洞',
    blackHoleDesc: '霍金辐射与吸积盘',
    whiteHole: '⚪ 白洞',
    whiteHoleDesc: '黑洞的理论反向',
    doubleSlit: '🔬 双缝实验',
    doubleSlitDesc: '波粒二象性',
    darkMatter: '🌀 暗物质',
    darkMatterDesc: '星系旋转曲线',
    schrodingersCat: '🐱 薛定谔的猫',
    schrodingersCatDesc: '量子叠加态',
    bigBang: '💥 大爆炸',
    bigBangDesc: '宇宙膨胀',
    photoelectric: '⚡ 光电效应',
    photoelectricDesc: '光量子与电子',
    brownianMotion: '🔬 布朗运动',
    brownianMotionDesc: '粒子随机运动',
    gravitationalWaves: '〰️ 引力波',
    gravitationalWavesDesc: '时空涟漪',
    quantumEntanglement: '🔗 量子纠缠',
    quantumEntanglementDesc: '幽灵般的超距作用',
    atomicModel: '⚛️ 玻尔原子模型',
    atomicModelDesc: '电子轨道与跃迁',
    radioactiveDecay: '☢️ 放射性衰变',
    radioactiveDecayDesc: 'α、β、γ射线',
    superconductivity: '❄️ 超导现象',
    superconductivityDesc: '迈斯纳效应',
    standardModel: '🧩 标准模型',
    standardModelDesc: '夸克、轻子、玻色子',
    footer: '⧫ QUANTUM HORIZON • 现代物理学科学可视化',
    theme: '主题',
    language: '语言',
    fullscreen: '全屏',
    exitFullscreen: '退出',
    calculator: '🧮 公式计算器',
    calculatorDesc: '物理量计算',
    mechanics: '力学',
    electromagnetism: '电学',
    calculate: '计算',
    result: '结果',
    timeline: '📅 发现时间线',
    timelineDesc: '从古代到现代的物理学史',
    solarSystem: '🌍 太阳系',
    solarSystemDesc: '行星及其轨道',
    cmb: '🌡️ 宇宙微波背景',
    cmbDesc: '早期宇宙地图',
    darkEnergy: '💫 暗能量',
    darkEnergyDesc: '宇宙膨胀',
    physicsQuiz: '📝 物理测验',
    physicsQuizDesc: '测试你的知识',
    scientists: '👨‍🔬 科学家',
    scientistsDesc: '伟大物理学家传记',
  },
  he: {
    title: '⧫ QUANTUM HORIZON',
    subtitle: 'מחלקיקים עד הקוסמוס • From Particles to Cosmos',
    quantum: '⚛️ קוונטים',
    relativity: '🚀 יחסות',
    cosmos: '🌌 קוסמוס',
    advanced: '🔬 מתקדם',
    waveFunction: '🌊 פונקציית גל',
    waveFunctionDesc: 'משוואת שרדינגר לחלקיק בבור',
    uncertainty: '📐 עיקרון אי-הוודאות',
    uncertaintyDesc: 'Δx·Δp ≥ ℏ/2 — הייזנברג, 1927',
    tunneling: '🚧 מינהור קוונטי',
    tunnelingDesc: 'מעבר דרך מחסום פוטנציאל',
    timeDilation: '⏱️ התארכות זמן',
    timeDilationDesc: 'תורת היחסות הפרטית',
    lengthContraction: '📏 התכווצות אורך',
    lengthContractionDesc: 'התכווצות לורנץ',
    massEnergy: '💥 E = mc²',
    massEnergyDesc: 'שקילות מסה-אנרגיה',
    hrDiagram: '📊 דיאגרמת הרצשפרונג-ראסל',
    hrDiagramDesc: 'סיווג ואבולוציה של כוכבים',
    neutronStar: '💫 כוכב נייטרון / פולסר',
    neutronStarDesc: 'דיפולים מגנטיים מסתובבים',
    blackHole: '🕳️ חור שחור',
    blackHoleDesc: 'עם קרינת הוקינג ודיסקת ספיחה',
    whiteHole: '⚪ חור לבן',
    whiteHoleDesc: 'ההפך התיאורטי של חור שחור',
    doubleSlit: '🔬 ניסוי הסדק הכפול',
    doubleSlitDesc: 'דואליות גל-חלקיק',
    darkMatter: '🌀 חומר אפל',
    darkMatterDesc: 'עקומות סיבוב גלקסיות',
    schrodingersCat: '🐱 החתול של שרדינגר',
    schrodingersCatDesc: 'סופרפוזיציה קוונטית',
    bigBang: '💥 המפץ הגדול',
    bigBangDesc: 'התפשטות היקום',
    photoelectric: '⚡ אפקט פוטואלקטרי',
    photoelectricDesc: 'קוונטי אור ואלקטרונים',
    brownianMotion: '🔬 תנועה בראונית',
    brownianMotionDesc: 'תנועת חלקיקים אקראית',
    gravitationalWaves: '〰️ גלי כבידה',
    gravitationalWavesDesc: 'אדוות במרחב-זמן',
    quantumEntanglement: '🔗 שזירה קוונטית',
    quantumEntanglementDesc: 'פעולה מרחוק',
    atomicModel: '⚛️ מודל האטום של בוהר',
    atomicModelDesc: 'מסלולי אלקטרונים',
    radioactiveDecay: '☢️ דעיכה רדיואקטיבית',
    radioactiveDecayDesc: 'קרינת α, β, γ',
    superconductivity: '❄️ מוליכות-על',
    superconductivityDesc: 'אפקט מייסנר',
    standardModel: '🧩 המודל הסטנדרטי',
    standardModelDesc: 'קווארקים, לפטונים, בוזונים',
    footer: '⧫ QUANTUM HORIZON • ויזואליזציות מדעיות של פיזיקה מודרנית',
    theme: 'ערכת נושא',
    language: 'שפה',
    fullscreen: 'מסך מלא',
    exitFullscreen: 'יציאה',
    calculator: '🧮 מחשבון נוסחאות',
    calculatorDesc: 'חישובי כמויות פיזיקליות',
    mechanics: 'מכניקה',
    electromagnetism: 'חשמל',
    calculate: 'חשב',
    result: 'תוצאה',
    timeline: '📅 ציר הזמן של התגליות',
    timelineDesc: 'תולדות הפיזיקה מהעת העתיקה ועד ימינו',
    solarSystem: '🌍 מערכת השמש',
    solarSystemDesc: 'כוכבי הלכת ומסלוליהם',
    cmb: '🌡️ קרינת רקע קוסמית',
    cmbDesc: 'מפת היקום המוקדם',
    darkEnergy: '💫 אנרגיה אפלה',
    darkEnergyDesc: 'התפשטות היקום',
    physicsQuiz: '📝 חידון פיזיקה',
    physicsQuizDesc: 'בדוק את הידע שלך',
    scientists: '👨‍🔬 מדענים',
    scientistsDesc: 'ביוגרפיות של פיזיקאים גדולים',
  },
}

type Language = 'ru' | 'en' | 'zh' | 'he'
type Theme = 'dark' | 'light'

// ==================== CONTEXTS ====================
const LanguageContext = createContext<{
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.ru
}>({
  language: 'ru',
  setLanguage: () => {},
  t: translations.ru,
})

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'dark',
  setTheme: () => {},
})

function formatScientific(num: number): string {
  if (num === 0) return '0'
  if (Math.abs(num) < 0.001 || Math.abs(num) > 1e6) {
    return num.toExponential(2)
  }
  return num.toFixed(4)
}

// ==================== FULLSCREEN WRAPPER ====================
function FullscreenWrapper({ 
  children, 
  title,
  isDark 
}: { 
  children: React.ReactNode
  title: string
  isDark: boolean
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Handle F key for fullscreen toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  return (
    <>
      {/* Fullscreen button */}
      <button
        onClick={() => setIsFullscreen(true)}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-lg transition-all ${
          isDark 
            ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white' 
            : 'bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        } backdrop-blur-sm`}
        title="Fullscreen (F)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-sm`} />
          
          {/* Content container */}
          <div 
            className={`relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl ${
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <button
                onClick={() => setIsFullscreen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            {/* Visualization content - enlarged */}
            <div className="p-4">
              <div className="transform scale-100">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ==================== QUANTUM MECHANICS ====================

// Wave Function Visualization
function WaveFunctionVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [n, setN] = useState(1)
  const [showProbability, setShowProbability] = useState(true)
  const [particlePosition, setParticlePosition] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const L = width * 0.8
    const offsetX = (width - L) / 2
    const centerY = height / 2

    let time = 0

    const animate = () => {
      time += 0.03
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0a0a1a')
      bgGradient.addColorStop(1, '#151530')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Potential well
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(offsetX, 20)
      ctx.lineTo(offsetX, height - 20)
      ctx.lineTo(offsetX + L, height - 20)
      ctx.lineTo(offsetX + L, 20)
      ctx.stroke()

      // Well label
      ctx.fillStyle = 'rgba(100, 150, 255, 0.6)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Бесконечная потенциальная яма', width / 2, 15)
      ctx.fillText('x=0', offsetX, height - 8)
      ctx.fillText('x=L', offsetX + L, height - 8)

      // Energy levels
      const maxN = 5
      const energyHeight = (height - 60) / (maxN + 1)
      
      for (let i = 1; i <= maxN; i++) {
        const y = height - 30 - i * energyHeight
        
        ctx.strokeStyle = i === n ? 'rgba(255, 200, 100, 0.8)' : 'rgba(100, 100, 150, 0.3)'
        ctx.lineWidth = i === n ? 2 : 1
        ctx.setLineDash(i === n ? [] : [3, 3])
        ctx.beginPath()
        ctx.moveTo(offsetX + 5, y)
        ctx.lineTo(offsetX + L - 5, y)
        ctx.stroke()
        ctx.setLineDash([])

        if (i <= 3) {
          ctx.fillStyle = i === n ? '#FFCC66' : 'rgba(150, 150, 200, 0.5)'
          ctx.font = '9px sans-serif'
          ctx.textAlign = 'right'
          ctx.fillText(`n=${i}`, offsetX - 8, y + 4)
          ctx.fillText(`E${i}`, offsetX + L + 25, y + 4)
        }
      }

      // Wave function ψ(x)
      const amplitude = energyHeight * 0.35
      const baseY = height - 30 - n * energyHeight

      // Draw wave function
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.9)'
      ctx.lineWidth = 2

      const points: {x: number, y: number}[] = []
      
      for (let px = 0; px <= L; px += 2) {
        const x = px / L
        // ψ_n(x) = sqrt(2/L) * sin(nπx/L)
        const psi = Math.sin(n * Math.PI * x) * Math.cos(time * n * 0.5)
        const y = baseY - psi * amplitude
        
        points.push({ x: offsetX + px, y })
        
        if (px === 0) ctx.moveTo(offsetX + px, y)
        else ctx.lineTo(offsetX + px, y)
      }
      ctx.stroke()

      // Probability density |ψ|²
      if (showProbability) {
        ctx.fillStyle = 'rgba(255, 100, 150, 0.15)'
        ctx.beginPath()
        ctx.moveTo(offsetX, baseY)
        
        for (let px = 0; px <= L; px += 2) {
          const x = px / L
          const probDensity = Math.pow(Math.sin(n * Math.PI * x), 2)
          const y = baseY - probDensity * amplitude
          ctx.lineTo(offsetX + px, y)
        }
        ctx.lineTo(offsetX + L, baseY)
        ctx.closePath()
        ctx.fill()

        // Probability curve
        ctx.strokeStyle = 'rgba(255, 100, 150, 0.7)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let px = 0; px <= L; px += 2) {
          const x = px / L
          const probDensity = Math.pow(Math.sin(n * Math.PI * x), 2)
          const y = baseY - probDensity * amplitude
          if (px === 0) ctx.moveTo(offsetX + px, y)
          else ctx.lineTo(offsetX + px, y)
        }
        ctx.stroke()
      }

      // Probability interpretation - measure particle
      if (particlePosition !== null) {
        const x = particlePosition / L
        const probDensity = Math.pow(Math.sin(n * Math.PI * x), 2)
        
        ctx.beginPath()
        ctx.arc(offsetX + particlePosition, baseY, 8, 0, Math.PI * 2)
        ctx.fillStyle = '#FFD700'
        ctx.fill()
        ctx.strokeStyle = '#FFF'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`P = ${(probDensity * 100).toFixed(1)}%`, offsetX + particlePosition, baseY - 20)
      }

      // Legend
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(100, 200, 255, 0.9)'
      ctx.fillText('ψ(x) — волновая функция', 10, height - 45)
      if (showProbability) {
        ctx.fillStyle = 'rgba(255, 100, 150, 0.9)'
        ctx.fillText('|ψ|² — плотность вероятности', 10, height - 32)
      }

      // Formula
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`ψ${n}(x) = √(2/L)·sin(${n}πx/L)`, width / 2, 30)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [n, showProbability, particlePosition])

  const measureParticle = () => {
    // Quantum measurement - probabilistic position
    const L = 100
    let random = Math.random()
    let position = 0
    
    for (let px = 0; px <= L; px++) {
      const x = px / L
      const prob = Math.pow(Math.sin(n * Math.PI * x), 2)
      random -= prob / (L / 2)
      if (random <= 0) {
        position = px * 3
        break
      }
    }
    
    setParticlePosition(position)
    setTimeout(() => setParticlePosition(null), 2000)
  }

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-56 rounded-lg"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400">Квантовое число n</span>
            <span className="text-white font-mono">{n}</span>
          </div>
          <Slider value={[n]} onValueChange={(v) => setN(v[0])} min={1} max={5} step={1} />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowProbability(!showProbability)} 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs border-pink-500/50 text-pink-300"
          >
            |ψ|²
          </Button>
          <Button 
            onClick={measureParticle} 
            size="sm"
            className="flex-1 text-xs bg-gradient-to-r from-yellow-600 to-orange-600"
          >
            🎲 Измерить
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 border border-blue-500/20 text-xs">
        <div className="text-cyan-300 font-semibold mb-1">📐 Решение уравнения Шрёдингера:</div>
        <div className="text-white font-mono text-center">E_n = n²π²ℏ² / 2mL²</div>
        <p className="text-gray-400 mt-2">
          Энергия квантуется! Частица не может иметь нулевую энергию (n≥1) — это принципиальное отличие от классической физики.
        </p>
      </div>
    </div>
  )
}

// Heisenberg Uncertainty Principle
function UncertaintyVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [deltaX, setDeltaX] = useState(50)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Calculate momentum uncertainty
    const deltaP = (h_bar / 2) / (deltaX * 1e-10) // Convert to meters
    const deltaP_normalized = Math.min(deltaP / 1e-24, 100)

    let time = 0

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#0a0a15'
      ctx.fillRect(0, 0, width, height)

      // Position wave function (Gaussian)
      const drawGaussian = (cx: number, cy: number, sigma: number, color: string, label: string, isPosition: boolean) => {
        const amplitude = 50
        const widthPx = sigma * 2

        // Fill
        ctx.beginPath()
        ctx.moveTo(cx - 100, cy)
        for (let x = -100; x <= 100; x++) {
          const gaussian = Math.exp(-(x * x) / (2 * sigma * sigma))
          const y = cy - gaussian * amplitude
          ctx.lineTo(cx + x, y)
        }
        ctx.lineTo(cx + 100, cy)
        ctx.closePath()
        
        const gradient = ctx.createLinearGradient(cx, cy - amplitude, cx, cy)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.globalAlpha = 0.3
        ctx.fill()
        ctx.globalAlpha = 1

        // Curve
        ctx.beginPath()
        for (let x = -100; x <= 100; x++) {
          const gaussian = Math.exp(-(x * x) / (2 * sigma * sigma))
          const y = cy - gaussian * amplitude
          if (x === -100) ctx.moveTo(cx + x, y)
          else ctx.lineTo(cx + x, y)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()

        // Labels
        ctx.fillStyle = color
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(label, cx, cy + 65)

        if (isPosition) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.setLineDash([3, 3])
          ctx.beginPath()
          ctx.moveTo(cx - sigma, cy - 10)
          ctx.lineTo(cx - sigma, cy + 10)
          ctx.moveTo(cx + sigma, cy - 10)
          ctx.lineTo(cx + sigma, cy + 10)
          ctx.stroke()
          ctx.setLineDash([])
          
          ctx.beginPath()
          ctx.moveTo(cx - sigma, cy)
          ctx.lineTo(cx + sigma, cy)
          ctx.stroke()
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.fillText('Δx', cx, cy + 25)
        }
      }

      // Position space (left side)
      drawGaussian(width * 0.25, centerY - 20, deltaX / 3, '#60A5FA', 'Пространство (x)', true)
      
      // Momentum space (right side) - inverse width
      const momentumSigma = 150 / deltaX
      drawGaussian(width * 0.75, centerY - 20, momentumSigma * 3, '#F472B6', 'Импульс (p)', false)

      // Arrow between
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(width * 0.35, centerY - 20)
      ctx.lineTo(width * 0.65, centerY - 20)
      ctx.stroke()
      ctx.setLineDash([])

      // Transform label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Преобразование Фурье', width / 2, centerY - 35)

      // Formula
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = 'bold 12px monospace'
      ctx.fillText('Δx · Δp ≥ ℏ/2', width / 2, 25)

      // Values
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#60A5FA'
      ctx.fillText(`Δx = ${(deltaX * 1e-10).toExponential(1)} м`, width * 0.25, centerY + 80)
      ctx.fillStyle = '#F472B6'
      ctx.fillText(`Δp ≥ ${deltaP.toExponential(1)} кг·м/с`, width * 0.75, centerY + 80)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [deltaX])

  const deltaP = (h_bar / 2) / (deltaX * 1e-10)

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-44 rounded-lg"
      />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-blue-400">Неопределённость позиции Δx</span>
          <span className="text-white font-mono">{deltaX * 1e-10} Å = {(deltaX * 1e-2).toFixed(1)} нм</span>
        </div>
        <Slider value={[deltaX]} onValueChange={(v) => setDeltaX(v[0])} min={5} max={100} step={1} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-950/30 rounded p-2 border border-blue-500/20">
          <div className="text-blue-400 font-semibold">Δx ↓</div>
          <div className="text-gray-400">Точная позиция</div>
          <div className="text-gray-400">Размытый импульс</div>
        </div>
        <div className="bg-pink-950/30 rounded p-2 border border-pink-500/20">
          <div className="text-pink-400 font-semibold">Δp ≥ ℏ/(2Δx)</div>
          <div className="text-white font-mono text-[10px]">{deltaP.toExponential(2)} кг·м/с</div>
          <div className="text-gray-400">Мин. импульс</div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-purple-300 font-semibold">Философский смысл:</span> Природа фундаментально 
          вероятностна. Мы не можем одновременно знать и позицию, и импульс частицы — 
          это не ошибка измерения, а свойство самой реальности.
        </p>
      </div>
    </div>
  )
}

// Quantum Tunneling
function TunnelingVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barrierHeight, setBarrierHeight] = useState(50)
  const [barrierWidth, setBarrierWidth] = useState(30)
  const [energy, setEnergy] = useState(30)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    let time = 0

    const animate = () => {
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#050510'
      ctx.fillRect(0, 0, width, height)

      const baseY = height * 0.6
      const waveAmplitude = 40

      // Energy level line
      const energyY = baseY - (energy / 100) * 80
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.5)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, energyY)
      ctx.lineTo(width, energyY)
      ctx.stroke()
      ctx.setLineDash([])
      
      ctx.fillStyle = 'rgba(255, 200, 100, 0.7)'
      ctx.font = '10px sans-serif'
      ctx.fillText('E (энергия частицы)', 10, energyY - 5)

      // Potential barrier
      const barrierX = width * 0.35
      const barrierW = (barrierWidth / 100) * width * 0.4
      const barrierTop = baseY - (barrierHeight / 100) * 80

      ctx.fillStyle = 'rgba(255, 100, 100, 0.3)'
      ctx.fillRect(barrierX, barrierTop, barrierW, baseY - barrierTop)
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)'
      ctx.lineWidth = 2
      ctx.strokeRect(barrierX, barrierTop, barrierW, baseY - barrierTop)

      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Барьер V₀', barrierX + barrierW / 2, barrierTop - 5)

      // Calculate transmission probability (simplified)
      const transmissionProb = energy < barrierHeight 
        ? Math.exp(-2 * Math.sqrt((barrierHeight - energy) / 20) * (barrierWidth / 20))
        : 1 - Math.pow((Math.sqrt(barrierHeight / energy) - 1) / (Math.sqrt(barrierHeight / energy) + 1), 2)

      // Wave function
      const k1 = 0.15
      const k2Real = energy > barrierHeight 
        ? k1 * Math.sqrt(energy / barrierHeight) 
        : k1 * Math.sqrt((barrierHeight - energy) / 50)
      const isOscillating = energy > barrierHeight

      // Incoming wave (left of barrier)
      ctx.beginPath()
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 2
      for (let x = 0; x < barrierX; x++) {
        const waveX = x - (time * 80) % width
        const psi = Math.sin(waveX * k1) * Math.exp(-Math.pow((x - barrierX + 50) / 100, 2))
        const y = energyY + psi * waveAmplitude
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Inside barrier (exponential decay or oscillation)
      ctx.beginPath()
      ctx.strokeStyle = energy > barrierHeight ? '#60A5FA' : '#F472B6'
      ctx.lineWidth = 2
      for (let x = barrierX; x < barrierX + barrierW; x++) {
        const relX = (x - barrierX) / barrierW
        let psi
        if (isOscillating) {
          psi = Math.sin(x * k2Real - time * 50) * (1 - relX * 0.3)
        } else {
          psi = Math.exp(-relX * barrierW * k2Real * 0.5) * Math.cos(x * k1 - time * 50)
        }
        const y = energyY + psi * waveAmplitude * 0.5
        if (x === barrierX) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Transmitted wave (right of barrier)
      ctx.beginPath()
      ctx.strokeStyle = '#4ADE80'
      ctx.lineWidth = 2
      const transmittedAmplitude = waveAmplitude * Math.sqrt(transmissionProb)
      for (let x = barrierX + barrierW; x < width; x++) {
        const waveX = x - (time * 80) % width
        const psi = Math.sin(waveX * k1) * transmittedAmplitude / waveAmplitude * Math.exp(-Math.pow((x - barrierX - barrierW - 30) / 150, 2))
        const y = energyY + psi * transmittedAmplitude
        if (x === barrierX + barrierW) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Probability display
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Вероятность туннелирования: ${(transmissionProb * 100).toFixed(1)}%`, width / 2, 25)

      // Labels
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#60A5FA'
      ctx.textAlign = 'left'
      ctx.fillText('Падающая волна', 10, baseY + 20)
      ctx.fillStyle = '#4ADE80'
      ctx.fillText('Прошедшая волна', width - 100, baseY + 20)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [barrierHeight, barrierWidth, energy])

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-48 rounded-lg"
      />
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-yellow-400">E</span>
            <span className="text-white font-mono">{energy}%</span>
          </div>
          <Slider value={[energy]} onValueChange={(v) => setEnergy(v[0])} min={10} max={100} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-red-400">V₀</span>
            <span className="text-white font-mono">{barrierHeight}%</span>
          </div>
          <Slider value={[barrierHeight]} onValueChange={(v) => setBarrierHeight(v[0])} min={20} max={100} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-400">Ширина</span>
            <span className="text-white font-mono">{barrierWidth}%</span>
          </div>
          <Slider value={[barrierWidth]} onValueChange={(v) => setBarrierWidth(v[0])} min={10} max={80} step={1} />
        </div>
      </div>

      <div className="bg-green-900/20 rounded-lg p-2 border border-green-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-green-300 font-semibold">Туннельный эффект:</span> Частица может пройти сквозь 
          барьер, даже если её энергия меньше высоты барьера! Это невозможно в классической физике, 
          но объясняет α-распад и работу туннельного микроскопа.
        </p>
      </div>
    </div>
  )
}

// ==================== SPECIAL RELATIVITY ====================

// Time Dilation
function TimeDilationVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [velocity, setVelocity] = useState(0.5) // fraction of c

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2

    let time = 0

    // Lorentz factor
    const gamma = 1 / Math.sqrt(1 - velocity * velocity)

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0a0515')
      bgGradient.addColorStop(1, '#150a20')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Reference frame - stationary observer
      const leftX = width * 0.25
      const rightX = width * 0.75
      const topY = 40
      const bottomY = height - 40

      // Left clock (stationary)
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(leftX, height / 2, 35, 0, Math.PI * 2)
      ctx.stroke()
      
      // Clock hands (stationary - normal time)
      const angle1 = time * 2
      ctx.beginPath()
      ctx.moveTo(leftX, height / 2)
      ctx.lineTo(leftX + Math.sin(angle1) * 25, height / 2 - Math.cos(angle1) * 25)
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 3
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(leftX, height / 2)
      ctx.lineTo(leftX + Math.sin(angle1 / 12) * 18, height / 2 - Math.cos(angle1 / 12) * 18)
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#60A5FA'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Неподвижный', leftX, height / 2 + 55)
      ctx.fillText('наблюдатель', leftX, height / 2 + 67)

      // Right clock (moving - dilated time)
      ctx.strokeStyle = 'rgba(255, 150, 100, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(rightX, height / 2, 35, 0, Math.PI * 2)
      ctx.stroke()

      // Clock hands (moving - slower time)
      const dilatedTime = time / gamma
      const angle2 = dilatedTime * 2
      ctx.beginPath()
      ctx.moveTo(rightX, height / 2)
      ctx.lineTo(rightX + Math.sin(angle2) * 25, height / 2 - Math.cos(angle2) * 25)
      ctx.strokeStyle = '#FF9966'
      ctx.lineWidth = 3
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(rightX, height / 2)
      ctx.lineTo(rightX + Math.sin(angle2 / 12) * 18, height / 2 - Math.cos(angle2 / 12) * 18)
      ctx.strokeStyle = '#FF9966'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#FF9966'
      ctx.fillText('Движущийся', rightX, height / 2 + 55)
      ctx.fillText(`v = ${(velocity * 100).toFixed(0)}% c`, rightX, height / 2 + 67)

      // Moving spaceship
      const shipY = height / 2 - 80
      const shipX = ((time * 30 * velocity) % (width + 100)) - 50
      
      // Ship trail
      ctx.fillStyle = 'rgba(255, 150, 100, 0.2)'
      ctx.beginPath()
      ctx.moveTo(shipX, shipY)
      ctx.lineTo(shipX - 60, shipY + 5)
      ctx.lineTo(shipX - 60, shipY - 5)
      ctx.closePath()
      ctx.fill()

      // Ship body
      ctx.fillStyle = '#FF9966'
      ctx.beginPath()
      ctx.moveTo(shipX + 15, shipY)
      ctx.lineTo(shipX - 10, shipY + 8)
      ctx.lineTo(shipX - 10, shipY - 8)
      ctx.closePath()
      ctx.fill()

      // Lorentz factor display
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`γ = ${gamma.toFixed(3)}`, centerX, 25)
      
      ctx.font = '10px sans-serif'
      ctx.fillText('Фактор Лоренца', centerX, 38)

      // Time ratio
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.fillText(`Прошло времени:`, leftX, height / 2 - 50)
      ctx.font = 'bold 12px monospace'
      ctx.fillText(`${(time * 10 % 60).toFixed(1)}с`, leftX, height / 2 - 35)

      ctx.fillStyle = 'rgba(255, 150, 100, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.fillText(`Для путешественника:`, rightX, height / 2 - 50)
      ctx.font = 'bold 12px monospace'
      ctx.fillText(`${(dilatedTime * 10 % 60).toFixed(1)}с`, rightX, height / 2 - 35)

      // Arrow between clocks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(leftX + 45, height / 2)
      ctx.lineTo(rightX - 45, height / 2)
      ctx.stroke()
      ctx.setLineDash([])

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [velocity])

  const gamma = 1 / Math.sqrt(1 - velocity * velocity)

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-52 rounded-lg"
      />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-orange-400">Скорость v/c</span>
          <span className="text-white font-mono">{(velocity * 100).toFixed(0)}% скорости света</span>
        </div>
        <Slider value={[velocity * 100]} onValueChange={(v) => setVelocity(v[0] / 100)} min={0} max={99} step={1} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-blue-950/30 rounded p-2 border border-blue-500/20">
          <div className="text-blue-400 font-bold">v = 0</div>
          <div className="text-gray-400">γ = 1</div>
          <div className="text-gray-500 text-[10px]">Нет замедления</div>
        </div>
        <div className="bg-yellow-950/30 rounded p-2 border border-yellow-500/20">
          <div className="text-yellow-400 font-bold">v = 0.87c</div>
          <div className="text-gray-400">γ = 2</div>
          <div className="text-gray-500 text-[10px]">Время в 2 раза медленнее</div>
        </div>
        <div className="bg-red-950/30 rounded p-2 border border-red-500/20">
          <div className="text-red-400 font-bold">v → c</div>
          <div className="text-gray-400">γ → ∞</div>
          <div className="text-gray-500 text-[10px]">Время останавливается</div>
        </div>
      </div>

      <div className="bg-orange-900/20 rounded-lg p-2 border border-orange-500/20 text-xs">
        <div className="text-orange-300 font-semibold mb-1">📐 Формула замедления времени:</div>
        <div className="text-white font-mono text-center">Δt' = γ·Δt = Δt / √(1 - v²/c²)</div>
        <p className="text-gray-400 mt-1">
          Это реальный эффект! Частицы-мюоны, живущие 2.2 мкс, достигают поверхности Земли благодаря замедлению времени.
        </p>
      </div>
    </div>
  )
}

// Length Contraction
function LengthContractionVisualization() {
  const [velocity, setVelocity] = useState(0.8)
  const [showGrid, setShowGrid] = useState(true)

  const gamma = 1 / Math.sqrt(1 - velocity * velocity)
  const contractedLength = 100 / gamma

  return (
    <div className="space-y-4">
      <div className="relative h-40 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0515 0%, #150a20 100%)' }}>
        {/* Grid */}
        {showGrid && (
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[...Array(20)].map((_, i) => (
              <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#444" strokeWidth="0.5" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#444" strokeWidth="0.5" />
            ))}
          </svg>
        )}

        {/* Rest frame object */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div 
            className="h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded"
            style={{ width: `${contractedLength}px` }}
          />
          <div className="text-center text-xs text-blue-300 mt-1">
            Движущийся: {contractedLength.toFixed(1)} м
          </div>
        </div>

        {/* Stationary reference */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div 
            className="h-8 bg-gradient-to-r from-green-500 to-green-400 rounded"
            style={{ width: '100px' }}
          />
          <div className="text-center text-xs text-green-300 mt-1">
            В покое: 100 м
          </div>
        </div>

        {/* Velocity arrow */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-orange-400 text-sm">
          → v = {(velocity * 100).toFixed(0)}% c
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-orange-400">Скорость</span>
          <span className="text-white font-mono">{(velocity * 100).toFixed(0)}% c</span>
        </div>
        <Slider value={[velocity * 100]} onValueChange={(v) => setVelocity(v[0] / 100)} min={0} max={99} step={1} />
      </div>

      <Button onClick={() => setShowGrid(!showGrid)} variant="outline" size="sm" className="w-full text-xs">
        {showGrid ? '🔲 Скрыть сетку' : '🔲 Показать сетку'}
      </Button>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold mb-1">📐 Формула сокращения длины:</div>
        <div className="text-white font-mono text-center">L = L₀ / γ = L₀ · √(1 - v²/c²)</div>
        <p className="text-gray-400 mt-1">
          Объект сокращается только в направлении движения! Поперечные размеры не меняются.
        </p>
      </div>
    </div>
  )
}

// Mass-Energy Equivalence
function MassEnergyVisualization() {
  const [massKg, setMassKg] = useState(1)

  const energyJ = massKg * c * c
  const energyTNT = energyJ / 4.184e9 // TNT equivalent in tons
  const energyHiroshima = energyJ / 6.3e13 // Hiroshima bomb equivalents

  return (
    <div className="space-y-4">
      <div className="relative h-48 rounded-lg overflow-hidden" style={{ background: 'radial-gradient(circle at center, #1a0a05 0%, #0a0510 100%)' }}>
        {/* Central energy visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Mass sphere */}
            <div 
              className="w-20 h-20 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, #FFD700, #FF8C00, #FF4500)',
                boxShadow: `0 0 ${30 + Math.min(energyHiroshima, 100) * 2}px rgba(255, 150, 0, 0.5)`
              }}
            />
            
            {/* Energy rays */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 h-1 bg-gradient-to-r from-yellow-400 to-transparent"
                style={{
                  width: `${20 + Math.min(energyHiroshima * 5, 100)}px`,
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  animation: `pulse ${1 + i * 0.1}s infinite`
                }}
              />
            ))}
          </div>
        </div>

        {/* Formula */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-2xl font-bold text-yellow-400 font-mono">E = mc²</div>
        </div>

        {/* Energy values */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-white font-mono text-sm">{formatScientific(energyJ)} Дж</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-yellow-400">Масса</span>
          <span className="text-white font-mono">{formatScientific(massKg)} кг</span>
        </div>
        <Slider 
          value={[Math.log10(massKg) + 6]} 
          onValueChange={(v) => setMassKg(Math.pow(10, v[0] - 6))} 
          min={-3} 
          max={21} 
          step={0.5} 
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 мг</span>
          <span>1 кг</span>
          <span>1 тонна</span>
          <span>1 кг U-235</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-950/30 rounded p-2 border border-red-500/20">
          <div className="text-red-400 font-semibold">Тротиловый эквивалент</div>
          <div className="text-white font-mono">{energyTNT < 1e6 ? energyTNT.toFixed(1) : formatScientific(energyTNT)} т</div>
        </div>
        <div className="bg-orange-950/30 rounded p-2 border border-orange-500/20">
          <div className="text-orange-400 font-semibold">Бомбы Хиросимы</div>
          <div className="text-white font-mono">{energyHiroshima < 1e6 ? energyHiroshima.toFixed(2) : formatScientific(energyHiroshima)}</div>
        </div>
      </div>

      <div className="bg-yellow-900/20 rounded-lg p-2 border border-yellow-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-yellow-300 font-semibold">Примеры:</span> 1 грамм материи = 21 кт тротила (Хиросима). 
          Солнце преобразует 4 млн тонн материи в энергию каждую секунду!
        </p>
      </div>
    </div>
  )
}

// ==================== STELLAR EVOLUTION ====================

// Hertzsprung-Russell Diagram
function HRDiagramVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedStar, setSelectedStar] = useState<{name: string, temp: number, luminosity: number, type: string, color: string, size: number} | null>(null)

  const stars = [
    { name: 'Солнце', temp: 5778, luminosity: 1, type: 'G2V', color: '#FFF4E0', size: 4 },
    { name: 'Сириус A', temp: 9940, luminosity: 25, type: 'A1V', color: '#CAD7FF', size: 6 },
    { name: 'Бетельгейзе', temp: 3600, luminosity: 90000, type: 'M1Ia', color: '#FF6B35', size: 12 },
    { name: 'Ригель', temp: 12100, luminosity: 120000, type: 'B8Ia', color: '#AABFFF', size: 10 },
    { name: 'Проксима', temp: 3042, luminosity: 0.0017, type: 'M5Ve', color: '#FF9966', size: 3 },
    { name: 'Вега', temp: 9602, luminosity: 40, type: 'A0V', color: '#CAD7FF', size: 6 },
    { name: 'Арктур', temp: 4286, luminosity: 170, type: 'K1.5III', color: '#FFB380', size: 8 },
    { name: 'Белый карлик', temp: 15000, luminosity: 0.001, type: 'DA', color: '#E0E8FF', size: 2 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = { left: 50, right: 20, top: 20, bottom: 40 }

    const plotWidth = width - padding.left - padding.right
    const plotHeight = height - padding.top - padding.bottom

    // Clear
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * plotWidth
      const y = padding.top + (i / 10) * plotHeight
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
    }

    // Main sequence band
    ctx.fillStyle = 'rgba(100, 150, 255, 0.1)'
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + plotHeight * 0.8)
    ctx.quadraticCurveTo(padding.left + plotWidth * 0.5, padding.top + plotHeight * 0.4, width - padding.right, padding.top + plotHeight * 0.2)
    ctx.lineTo(width - padding.right, padding.top + plotHeight * 0.4)
    ctx.quadraticCurveTo(padding.left + plotWidth * 0.5, padding.top + plotHeight * 0.6, padding.left, padding.top + plotHeight * 0.95)
    ctx.closePath()
    ctx.fill()

    // Regions labels
    ctx.font = '9px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.textAlign = 'center'
    ctx.fillText('Главная', padding.left + plotWidth * 0.3, padding.top + plotHeight * 0.55)
    ctx.fillText('последовательность', padding.left + plotWidth * 0.3, padding.top + plotHeight * 0.65)
    
    ctx.fillText('Гиганты', padding.left + plotWidth * 0.2, padding.top + plotHeight * 0.2)
    ctx.fillText('Сверхгиганты', padding.left + plotWidth * 0.15, padding.top + plotHeight * 0.08)
    ctx.fillText('Белые карлики', padding.left + plotWidth * 0.85, padding.top + plotHeight * 0.85)

    // Axes labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '10px sans-serif'
    
    // Temperature (reversed)
    ctx.textAlign = 'center'
    ctx.fillText('Температура (K)', width / 2, height - 8)
    ctx.font = '8px sans-serif'
    ctx.fillText('40000', padding.left + 15, height - 25)
    ctx.fillText('10000', padding.left + plotWidth * 0.5, height - 25)
    ctx.fillText('3000', width - padding.right - 15, height - 25)

    // Luminosity
    ctx.save()
    ctx.translate(12, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Светимость (L☉)', 0, 0)
    ctx.restore()

    ctx.font = '8px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('10⁶', padding.left - 5, padding.top + 15)
    ctx.fillText('1', padding.left - 5, padding.top + plotHeight * 0.5)
    ctx.fillText('10⁻⁴', padding.left - 5, height - padding.bottom - 5)

    // Draw stars
    stars.forEach((star) => {
      // Temperature to x (log scale, reversed)
      const logTemp = Math.log10(star.temp)
      const x = padding.left + plotWidth * (1 - (logTemp - 3.5) / 1.6)
      
      // Luminosity to y (log scale)
      const logLum = Math.log10(star.luminosity)
      const y = padding.top + plotHeight * (1 - (logLum + 4) / 10)

      // Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3)
      gradient.addColorStop(0, star.color)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Star
      ctx.beginPath()
      ctx.arc(x, y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = star.color
      ctx.fill()
    })

    // Sun marker with label
    const sunLogTemp = Math.log10(5778)
    const sunX = padding.left + plotWidth * (1 - (sunLogTemp - 3.5) / 1.6)
    const sunLogLum = Math.log10(1)
    const sunY = padding.top + plotHeight * (1 - (sunLogLum + 4) / 10)
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(sunX, sunY, 12, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('☉ Солнце', sunX + 15, sunY + 3)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-72 rounded-lg"
      />

      <div className="grid grid-cols-4 gap-1 text-[10px]">
        {stars.slice(0, 4).map((star) => (
          <div 
            key={star.name} 
            className="bg-gray-800/50 rounded p-1.5 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={() => setSelectedStar(star)}
          >
            <div className="font-semibold" style={{ color: star.color }}>{star.name}</div>
            <div className="text-gray-500">{star.type}</div>
          </div>
        ))}
      </div>

      {selectedStar && (
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold" style={{ color: selectedStar.color }}>{selectedStar.name}</span>
            <span className="text-xs text-gray-400">{selectedStar.type}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">T:</span> {selectedStar.temp.toLocaleString()} K
            </div>
            <div>
              <span className="text-gray-500">L:</span> {selectedStar.luminosity.toLocaleString()} L☉
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-blue-300 font-semibold">Диаграмма Г-Р:</span> Показывает эволюцию звёзд. 
          90% звёзд находятся на главной последовательности, где они сжигают водород.
        </p>
      </div>
    </div>
  )
}

// Neutron Star Visualization
function NeutronStarVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotationPeriod, setRotationPeriod] = useState(33) // milliseconds
  const [magneticTilt, setMagneticTilt] = useState(45)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const starRadius = 25

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background
      ctx.fillStyle = '#020208'
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background stars
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * canvas.offsetWidth
        const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * canvas.offsetHeight
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.2})`
        ctx.beginPath()
        ctx.arc(x, y, 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      const rotationAngle = time * (1000 / rotationPeriod) * 0.1
      const tiltRad = (magneticTilt * Math.PI) / 180

      // Magnetic field lines
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        for (let t = 0; t <= 1; t += 0.02) {
          const r = starRadius * (1 + t * 4)
          const fieldAngle = angle + Math.sin(t * Math.PI * 2) * 0.5
          const x = centerX + Math.cos(fieldAngle + rotationAngle) * r * Math.cos(tiltRad)
          const y = centerY + Math.sin(fieldAngle + rotationAngle) * r
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Pulsar beams
      const beamLength = 150
      const beamWidth = 15

      // Beam 1
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotationAngle)
      ctx.rotate(tiltRad)

      const beamGradient1 = ctx.createLinearGradient(0, 0, 0, -beamLength)
      beamGradient1.addColorStop(0, 'rgba(100, 200, 255, 0.9)')
      beamGradient1.addColorStop(0.5, 'rgba(100, 150, 255, 0.4)')
      beamGradient1.addColorStop(1, 'rgba(100, 100, 255, 0)')

      ctx.fillStyle = beamGradient1
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, -beamLength)
      ctx.lineTo(beamWidth, -beamLength)
      ctx.closePath()
      ctx.fill()

      // Beam 2 (opposite)
      const beamGradient2 = ctx.createLinearGradient(0, 0, 0, beamLength)
      beamGradient2.addColorStop(0, 'rgba(100, 200, 255, 0.9)')
      beamGradient2.addColorStop(0.5, 'rgba(100, 150, 255, 0.4)')
      beamGradient2.addColorStop(1, 'rgba(100, 100, 255, 0)')

      ctx.fillStyle = beamGradient2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, beamLength)
      ctx.lineTo(beamWidth, beamLength)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Neutron star core
      const coreGradient = ctx.createRadialGradient(centerX - 5, centerY - 5, 0, centerX, centerY, starRadius)
      coreGradient.addColorStop(0, '#FFFFFF')
      coreGradient.addColorStop(0.3, '#E0E8FF')
      coreGradient.addColorStop(0.7, '#8090C0')
      coreGradient.addColorStop(1, '#4050A0')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2)
      ctx.fill()

      // Surface glow
      ctx.strokeStyle = 'rgba(150, 200, 255, 0.6)'
      ctx.lineWidth = 3
      ctx.stroke()

      // Hot spots at magnetic poles
      const spotSize = 8
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(rotationAngle + tiltRad) * starRadius * 0.7,
        centerY + Math.sin(rotationAngle + tiltRad) * starRadius * 0.7,
        spotSize, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        centerX - Math.cos(rotationAngle + tiltRad) * starRadius * 0.7,
        centerY - Math.sin(rotationAngle + tiltRad) * starRadius * 0.7,
        spotSize, 0, Math.PI * 2
      )
      ctx.fill()

      // Rotation indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrow showing rotation direction
      const arrowAngle = rotationAngle + Math.PI / 4
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, arrowAngle, arrowAngle + 0.5)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`P = ${rotationPeriod} мс`, centerX, canvas.offsetHeight - 15)
      ctx.fillText(`f = ${(1000 / rotationPeriod).toFixed(1)} Гц`, centerX, canvas.offsetHeight - 3)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [rotationPeriod, magneticTilt])

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 rounded-lg"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-cyan-400">Период</span>
            <span className="text-white font-mono">{rotationPeriod} мс</span>
          </div>
          <Slider value={[rotationPeriod]} onValueChange={(v) => setRotationPeriod(v[0])} min={1} max={100} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Наклон оси</span>
            <span className="text-white font-mono">{magneticTilt}°</span>
          </div>
          <Slider value={[magneticTilt]} onValueChange={(v) => setMagneticTilt(v[0])} min={0} max={90} step={1} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-cyan-950/30 rounded p-2 border border-cyan-500/20">
          <div className="text-cyan-400 font-semibold">Пульсар PSR J1748-2446ad</div>
          <div className="text-gray-400">P = 1.4 мс (716 об/с)</div>
        </div>
        <div className="bg-purple-950/30 rounded p-2 border border-purple-500/20">
          <div className="text-purple-400 font-semibold">Magnetar SGR 1806-20</div>
          <div className="text-gray-400">B ~ 10¹⁵ Гс</div>
        </div>
      </div>

      <div className="bg-cyan-900/20 rounded-lg p-2 border border-cyan-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-cyan-300 font-semibold">Нейтронная звезда:</span> Остаток сверхновой массой ~1.4-2 M☉ 
          и радиусом ~10 км. Плотность ~10¹⁴ г/см³ — чайная ложка весит миллиард тонн!
        </p>
      </div>
    </div>
  )
}

// ==================== DOUBLE-SLIT EXPERIMENT ====================
function DoubleSlitVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [slitSeparation, setSlitSeparation] = useState(40)
  const [slitWidth, setSlitWidth] = useState(8)
  const [wavelength, setWavelength] = useState(15)
  const [showParticles, setShowParticles] = useState(false)
  const [showWave, setShowWave] = useState(true)
  const particleHitsRef = useRef<number[]>(new Array(100).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const slitX = width * 0.3
    const screenX = width * 0.85
    const centerY = height / 2

    let time = 0
    const particles: Array<{x: number, y: number, targetY: number, speed: number, phase: number}> = []

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#050510'
      ctx.fillRect(0, 0, width, height)

      // Wave visualization from source
      if (showWave && !showParticles) {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)'
        ctx.lineWidth = 1
        for (let r = 0; r < 200; r += 10) {
          const waveR = ((r + time * 50) % 200)
          ctx.beginPath()
          ctx.arc(30, centerY, waveR, -Math.PI/2.5, Math.PI/2.5)
          ctx.stroke()
        }
      }

      // Source
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(30, centerY, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#FFD70080'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Источник', 30, centerY + 25)

      // Barrier with slits
      ctx.fillStyle = '#333'
      ctx.fillRect(slitX - 4, 0, 8, centerY - slitSeparation/2 - slitWidth/2)
      ctx.fillRect(slitX - 4, centerY - slitSeparation/2 + slitWidth/2, 8, slitSeparation - slitWidth)
      ctx.fillRect(slitX - 4, centerY + slitSeparation/2 + slitWidth/2, 8, height - centerY - slitSeparation/2 - slitWidth/2)

      // Slit labels
      ctx.fillStyle = '#888'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Щель 1', slitX + 8, centerY - slitSeparation/2)
      ctx.fillText('Щель 2', slitX + 8, centerY + slitSeparation/2)

      // Wave after slits
      if (showWave) {
        // Interference pattern calculation
        for (let y = 20; y < height - 20; y++) {
          const dy = y - centerY
          // Path difference from two slits
          const d1 = Math.sqrt(Math.pow(slitSeparation/2, 2) + Math.pow(dy, 2))
          const d2 = Math.sqrt(Math.pow(-slitSeparation/2, 2) + Math.pow(dy, 2))
          const pathDiff = d1 - d2
          const phase = (pathDiff / wavelength) * 2 * Math.PI
          const intensity = Math.pow(Math.cos(phase/2), 2)

          // Draw interference pattern on screen
          const alpha = intensity * 0.8
          ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`
          ctx.fillRect(screenX - 3, y, 6, 1)

          // Wave propagation
          if (!showParticles) {
            for (let x = slitX + 10; x < screenX - 10; x += 5) {
              const progress = (x - slitX) / (screenX - slitX)
              const waveIntensity = Math.sin(phase + time * 3 - progress * 10) * 0.5 + 0.5
              ctx.fillStyle = `rgba(100, 150, 255, ${waveIntensity * intensity * 0.15})`
              ctx.beginPath()
              ctx.arc(x, y, 2, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      // Particle mode
      if (showParticles) {
        // Spawn particles
        if (Math.random() < 0.3 && particles.length < 100) {
          // Quantum interference - particle goes through both slits probabilistically
          const targetY = centerY + (Math.random() - 0.5) * height * 0.8
          particles.push({
            x: 30,
            y: centerY,
            targetY: targetY,
            speed: 2 + Math.random(),
            phase: Math.random() * Math.PI * 2
          })
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.speed

          if (p.x < slitX) {
            // Moving towards slits
            ctx.fillStyle = '#FFD700'
            ctx.beginPath()
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
            ctx.fill()
          } else if (p.x < screenX) {
            // After slits - quantum behavior
            ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Hit screen - record position based on interference
            const dy = p.targetY - centerY
            const d1 = Math.sqrt(Math.pow(slitSeparation/2, 2) + Math.pow(dy, 2))
            const d2 = Math.sqrt(Math.pow(-slitSeparation/2, 2) + Math.pow(dy, 2))
            const pathDiff = d1 - d2
            const phase = (pathDiff / wavelength) * 2 * Math.PI
            const probability = Math.pow(Math.cos(phase/2), 2)

            if (Math.random() < probability) {
              const hitY = Math.floor((p.targetY / height) * 100)
              if (hitY >= 0 && hitY < 100) {
                particleHitsRef.current[hitY]++
              }
            }
            particles.splice(i, 1)
          }
        }

        // Draw hit pattern
        for (let i = 0; i < 100; i++) {
          const hits = particleHitsRef.current[i]
          if (hits > 0) {
            const intensity = Math.min(hits / 20, 1)
            ctx.fillStyle = `rgba(100, 200, 255, ${intensity})`
            ctx.fillRect(screenX - 3, (i / 100) * height, 6, height / 100)
          }
        }
      }

      // Detection screen
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(screenX, 10)
      ctx.lineTo(screenX, height - 10)
      ctx.stroke()
      ctx.fillStyle = '#888'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Экран', screenX, height - 5)

      // Legend
      ctx.fillStyle = '#888'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('d = ' + slitSeparation + ' (расстояние между щелями)', 10, height - 35)
      ctx.fillText('λ = ' + wavelength + ' (длина волны)', 10, height - 22)
      ctx.fillText('a = ' + slitWidth + ' (ширина щели)', 10, height - 9)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [slitSeparation, slitWidth, wavelength, showParticles, showWave])

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-56 rounded-lg"
      />
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-400">d (щели)</span>
            <span className="text-white font-mono">{slitSeparation}</span>
          </div>
          <Slider value={[slitSeparation]} onValueChange={(v) => setSlitSeparation(v[0])} min={15} max={80} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-400">λ (волна)</span>
            <span className="text-white font-mono">{wavelength}</span>
          </div>
          <Slider value={[wavelength]} onValueChange={(v) => setWavelength(v[0])} min={5} max={30} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-yellow-400">a (ширина)</span>
            <span className="text-white font-mono">{slitWidth}</span>
          </div>
          <Slider value={[slitWidth]} onValueChange={(v) => setSlitWidth(v[0])} min={3} max={20} step={1} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={() => {setShowWave(true); setShowParticles(false)}} 
          variant={showWave && !showParticles ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-xs"
        >
          🌊 Волна
        </Button>
        <Button 
          onClick={() => {setShowParticles(true); setShowWave(true); particleHitsRef.current = new Array(100).fill(0)}} 
          variant={showParticles ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-xs"
        >
          ⚡ Частицы
        </Button>
      </div>

      <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-blue-300 font-semibold">Двойная щель:</span> Даже отдельные частицы создают интерференционную картину! 
          Это демонстрирует корпускулярно-волновой дуализм — материя ведёт себя и как частица, и как волна.
        </p>
      </div>
    </div>
  )
}

// ==================== DARK MATTER VISUALIZATION ====================
function DarkMatterVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [darkMatterFraction, setDarkMatterFraction] = useState(85)
  const [showDarkMatter, setShowDarkMatter] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Galaxy rotation curves
    // Visible matter rotation: v = sqrt(GM/r) for r > core, then flat
    // Dark matter extends the flat rotation curve

    const stars: Array<{angle: number, radius: number, size: number, brightness: number, isDark: boolean}> = []
    
    // Visible stars (concentrated in center)
    for (let i = 0; i < 150; i++) {
      const r = Math.pow(Math.random(), 0.5) * 60 // Exponential disk
      stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: r,
        size: 1 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.7,
        isDark: false
      })
    }

    // Dark matter halo (extended distribution)
    for (let i = 0; i < 200; i++) {
      const r = 20 + Math.random() * 80 // Extended halo
      stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: r,
        size: 1 + Math.random(),
        brightness: 0,
        isDark: true
      })
    }

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120)
      bgGradient.addColorStop(0, '#0a0520')
      bgGradient.addColorStop(1, '#050510')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Dark matter halo visualization
      if (showDarkMatter) {
        const dmGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
        dmGradient.addColorStop(0, `rgba(80, 40, 150, ${darkMatterFraction / 400})`)
        dmGradient.addColorStop(0.5, `rgba(60, 30, 120, ${darkMatterFraction / 300})`)
        dmGradient.addColorStop(1, 'rgba(40, 20, 80, 0)')
        ctx.fillStyle = dmGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update and draw stars
      stars.forEach((star) => {
        // Keplerian vs flat rotation curve
        let angularSpeed
        if (star.isDark) {
          // Dark matter follows the halo - helps maintain flat rotation curve
          angularSpeed = 0.015 / Math.sqrt(1 + star.radius / 50)
        } else {
          // Visible matter - would slow down at large r without dark matter
          // With dark matter contribution, stays flatter
          const visibleContribution = (100 - darkMatterFraction) / 100
          const darkContribution = darkMatterFraction / 100
          const keplerian = 0.02 / Math.sqrt(Math.max(star.radius, 10) / 30)
          const flatCurve = 0.015 // Flat rotation due to dark matter
          angularSpeed = keplerian * visibleContribution + flatCurve * darkContribution
        }

        star.angle += angularSpeed

        const x = centerX + Math.cos(star.angle) * star.radius
        const y = centerY + Math.sin(star.angle) * star.radius * 0.4 // Inclined disk

        if (star.isDark && showDarkMatter) {
          ctx.fillStyle = `rgba(150, 100, 255, ${0.1 + Math.random() * 0.1})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (!star.isDark) {
          ctx.fillStyle = `rgba(255, 255, 200, ${star.brightness})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Galaxy core glow
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20)
      coreGradient.addColorStop(0, 'rgba(255, 240, 200, 0.8)')
      coreGradient.addColorStop(0.5, 'rgba(255, 200, 150, 0.3)')
      coreGradient.addColorStop(1, 'rgba(255, 150, 100, 0)')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw rotation curve graph
      const graphX = 10
      const graphY = height - 70
      const graphW = width - 20
      const graphH = 60

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(graphX, graphY, graphW, graphH)

      // Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(graphX, graphY + graphH - 5)
      ctx.lineTo(graphX + graphW, graphY + graphH - 5)
      ctx.stroke()

      // Labels
      ctx.fillStyle = '#888'
      ctx.font = '8px sans-serif'
      ctx.fillText('r (расстояние от центра)', graphX + graphW/2, graphY + graphH - 1)
      ctx.save()
      ctx.translate(graphX + 3, graphY + graphH/2)
      ctx.rotate(-Math.PI/2)
      ctx.fillText('v (скорость)', 0, 0)
      ctx.restore()

      // Keplerian curve (without dark matter)
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)'
      ctx.beginPath()
      for (let r = 5; r < graphW; r += 2) {
        const v = 30 / Math.sqrt(r / 10) // Keplerian decline
        const x = graphX + r
        const y = graphY + graphH - 5 - v
        if (r === 5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Flat curve (with dark matter)
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.beginPath()
      for (let r = 5; r < graphW; r += 2) {
        let v
        if (r < 30) {
          v = r * 0.8 // Rising
        } else {
          v = 25 - (100 - darkMatterFraction) / 10 // Flat, depends on DM fraction
        }
        const x = graphX + r
        const y = graphY + graphH - 5 - v
        if (r === 5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Legend
      ctx.font = '7px sans-serif'
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)'
      ctx.fillText('Без тёмной материи', graphX + graphW - 80, graphY + 10)
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.fillText('С тёмной материей', graphX + graphW - 80, graphY + 20)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [darkMatterFraction, showDarkMatter])

  return (
    <div className="space-y-3">
      <canvas 
        ref={canvasRef} 
        className="w-full h-56 rounded-lg"
      />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-purple-400">Доля тёмной материи</span>
          <span className="text-white font-mono">{darkMatterFraction}%</span>
        </div>
        <Slider value={[darkMatterFraction]} onValueChange={(v) => setDarkMatterFraction(v[0])} min={0} max={95} step={5} />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={() => setShowDarkMatter(!showDarkMatter)} 
          variant="outline"
          size="sm"
          className="flex-1 text-xs border-purple-500/50 text-purple-300"
        >
          {showDarkMatter ? '👁️ Скрыть DM' : '👁️ Показать DM'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-purple-950/30 rounded p-2 border border-purple-500/20">
          <div className="text-purple-400 font-semibold">Тёмная материя</div>
          <div className="text-white font-mono">~27% Вселенной</div>
          <div className="text-gray-500">Не испускает свет</div>
        </div>
        <div className="bg-blue-950/30 rounded p-2 border border-blue-500/20">
          <div className="text-blue-400 font-semibold">Тёмная энергия</div>
          <div className="text-white font-mono">~68% Вселенной</div>
          <div className="text-gray-500">Ускоряет расширение</div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <p className="text-gray-300">
          <span className="text-purple-300 font-semibold">Загадка:</span> Звёзды на краю галактик вращаются слишком быстро! 
          Без невидимой массы они бы разлетелись. Это и есть доказательство тёмной материи.
        </p>
      </div>
    </div>
  )
}

// ==================== BLACK HOLE (ENHANCED) ====================
function BlackHoleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [massSolar, setMassSolar] = useState(10)

  const mass = massSolar * M_SUN
  const schwarzschildRadius = (2 * G * mass) / (c * c)
  const hawkingTemp = (h * c * c * c) / (8 * Math.PI * G * mass * k_B)
  const lifetime = (5120 * Math.PI * G * G * mass * mass * mass) / (h * c * c * c)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const baseRadius = 20 + massSolar * 1.2
    const schwarzschildRadius_visual = Math.min(baseRadius, 55)
    const photonSphereRadius = schwarzschildRadius_visual * 1.5
    const iscoRadius = schwarzschildRadius_visual * 3

    const stars: Array<{x: number; y: number; brightness: number}> = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        brightness: 0.3 + Math.random() * 0.7
      })
    }

    const diskParticles: Array<{angle: number; radius: number; speed: number; size: number; temp: number}> = []
    for (let i = 0; i < 350; i++) {
      const radius = iscoRadius + Math.random() * 80
      diskParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: 0.012 / Math.sqrt(radius / iscoRadius),
        size: 1 + Math.random() * 2,
        temp: 1 - (radius - iscoRadius) / 80
      })
    }

    const jetParticles: Array<{x: number; y: number; vx: number; vy: number; life: number; size: number}> = []
    const hawkingParticles: Array<{x: number; y: number; vx: number; vy: number; life: number; size: number}> = []

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      ctx.fillStyle = '#000002'
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Stars with lensing
      stars.forEach((star) => {
        const dx = star.x - centerX
        const dy = star.y - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let lensedX = star.x
        let lensedY = star.y
        
        if (dist < 150 && dist > schwarzschildRadius_visual) {
          const lensStrength = Math.pow(150 / dist, 2) * 20
          const angle = Math.atan2(dy, dx)
          lensedX = centerX + dx + Math.cos(angle + Math.PI / 2) * lensStrength * Math.sin(time * 1.2)
          lensedY = centerY + dy + Math.sin(angle + Math.PI / 2) * lensStrength * Math.sin(time * 1.2)
        }
        
        if (dist > photonSphereRadius - 5 && dist < photonSphereRadius + 10) {
          const ringIntensity = 1 - Math.abs(dist - photonSphereRadius) / 10
          ctx.fillStyle = `rgba(255, 220, 180, ${ringIntensity * 0.15})`
          ctx.beginPath()
          ctx.arc(lensedX, lensedY, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.3})`
        ctx.beginPath()
        ctx.arc(lensedX, lensedY, 0.6, 0, Math.PI * 2)
        ctx.fill()
      })

      // Einstein ring
      ctx.strokeStyle = 'rgba(255, 220, 180, 0.1)'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, photonSphereRadius + 2, 0, Math.PI * 2)
      ctx.stroke()

      // Space-time grid
      ctx.strokeStyle = 'rgba(60, 30, 150, 0.06)'
      ctx.lineWidth = 0.5
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath()
        for (let x = 0; x <= canvas.offsetWidth; x += 4) {
          const baseY = centerY + i * 16
          const dx = x - centerX
          const dy = baseY - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          let warpedY = baseY
          if (dist > schwarzschildRadius_visual && dist < 180) {
            const warpStrength = Math.pow(180 / dist, 2) * 10
            warpedY = baseY + (dy / dist) * warpStrength
          }
          if (x === 0) ctx.moveTo(x, warpedY)
          else ctx.lineTo(x, warpedY)
        }
        ctx.stroke()
      }

      // Accretion disk (back)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, canvas.offsetWidth, centerY)
      ctx.clip()
      
      diskParticles.forEach((particle) => {
        particle.angle += particle.speed
        if (particle.radius > iscoRadius) particle.radius -= 0.006
        else {
          particle.radius = iscoRadius + Math.random() * 80
          particle.angle = Math.random() * Math.PI * 2
        }

        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius * 0.2

        let hue = 25 + particle.temp * 30
        if (Math.cos(particle.angle) > 0) hue -= 20
        ctx.fillStyle = `hsla(${hue}, 100%, ${55 + particle.temp * 25}%, ${particle.temp * 0.5 + 0.2})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()

      // Jets
      if (Math.random() < 0.06) {
        const dir = Math.random() < 0.5 ? -1 : 1
        jetParticles.push({
          x: centerX + (Math.random() - 0.5) * 6,
          y: centerY,
          vx: (Math.random() - 0.5) * 0.2,
          vy: dir * (2 + Math.random() * 1.5),
          life: 1,
          size: 1 + Math.random() * 1.5
        })
      }

      for (let i = jetParticles.length - 1; i >= 0; i--) {
        const p = jetParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01
        if (p.life <= 0 || p.y < 0 || p.y > canvas.offsetHeight) {
          jetParticles.splice(i, 1)
          continue
        }
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `rgba(80, 150, 255, ${p.life})`)
        gradient.addColorStop(1, 'rgba(40, 80, 200, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Hawking radiation
      if (Math.random() < 0.015) {
        const angle = Math.random() * Math.PI * 2
        hawkingParticles.push({
          x: centerX + Math.cos(angle) * (schwarzschildRadius_visual + 3),
          y: centerY + Math.sin(angle) * (schwarzschildRadius_visual + 3),
          vx: Math.cos(angle) * 1.2,
          vy: Math.sin(angle) * 1.2,
          life: 1,
          size: 1.2
        })
      }

      for (let i = hawkingParticles.length - 1; i >= 0; i--) {
        const p = hawkingParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.008
        if (p.life <= 0) {
          hawkingParticles.splice(i, 1)
          continue
        }
        ctx.fillStyle = `rgba(150, 200, 255, ${p.life * 0.35})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

      // Event horizon
      const horizonGlow = ctx.createRadialGradient(centerX, centerY, schwarzschildRadius_visual - 3, centerX, centerY, schwarzschildRadius_visual + 10)
      horizonGlow.addColorStop(0, 'rgba(0, 0, 0, 1)')
      horizonGlow.addColorStop(0.5, 'rgba(30, 8, 0, 0.3)')
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = horizonGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, schwarzschildRadius_visual + 10, 0, Math.PI * 2)
      ctx.fill()

      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, schwarzschildRadius_visual)
      coreGradient.addColorStop(0, '#000000')
      coreGradient.addColorStop(0.95, '#000000')
      coreGradient.addColorStop(1, '#100505')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, schwarzschildRadius_visual, 0, Math.PI * 2)
      ctx.fill()

      // Accretion disk (front)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, centerY, canvas.offsetWidth, canvas.offsetHeight)
      ctx.clip()
      diskParticles.forEach((particle) => {
        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius * 0.2
        let hue = 25 + particle.temp * 30
        if (Math.cos(particle.angle) > 0) hue -= 20
        ctx.fillStyle = `hsla(${hue}, 100%, ${55 + particle.temp * 25}%, ${particle.temp * 0.6 + 0.3})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [massSolar])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-72 rounded-lg" />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-orange-400">Масса</span>
          <span className="text-white font-mono">{massSolar} M☉</span>
        </div>
        <Slider value={[massSolar]} onValueChange={(v) => setMassSolar(v[0])} min={1} max={100} step={1} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-950/30 rounded p-2 border border-red-500/20">
          <div className="text-red-400 font-semibold">Rs</div>
          <div className="text-white font-mono text-[10px]">{schwarzschildRadius.toExponential(1)} м</div>
          <div className="text-gray-500">≈ {(schwarzschildRadius / 1000).toFixed(1)} км</div>
        </div>
        <div className="bg-blue-950/30 rounded p-2 border border-blue-500/20">
          <div className="text-blue-400 font-semibold">T (Хокинг)</div>
          <div className="text-white font-mono text-[10px]">{hawkingTemp.toExponential(1)} K</div>
        </div>
      </div>

      <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/20 text-xs">
        <div className="text-orange-300 font-mono text-center mb-1">T = ℏc³ / 8πGMk_B</div>
        <p className="text-gray-400">Чёрные дыры испаряются! Время жизни: ~10^{(Math.log10(lifetime / 3.15e7)).toFixed(0)} лет</p>
      </div>

      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-gray-700/50 text-xs space-y-2">
        <div className="text-cyan-300 font-semibold">📚 Как работает чёрная дыра:</div>
        <div className="grid grid-cols-1 gap-2 text-gray-300">
          <div className="flex items-start gap-2">
            <span className="text-red-400">1.</span>
            <span><strong>Горизонт событий</strong> — граница, откуда невозможен выход. Даже свет не может покинуть область внутри Rs.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-400">2.</span>
            <span><strong>Сингулярность</strong> — точка в центре, где кривизна пространства-времени бесконечна.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">3.</span>
            <span><strong>Аккреционный диск</strong> — материя, вращающаяся вокруг дыры и разогретая до миллионов градусов.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">4.</span>
            <span><strong>Джеты</strong> — потоки частиц, выбрасываемые вдоль оси вращения со скоростью близкой к c.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">5.</span>
            <span><strong>Излучение Хокинга</strong> — квантовый эффект испарения дыры через туннелирование.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== WHITE HOLE ====================
function WhiteHoleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [massSolar, setMassSolar] = useState(10)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const baseRadius = 20 + massSolar * 1.2
    const eventHorizonRadius = Math.min(baseRadius, 55)

    const stars: Array<{x: number; y: number; brightness: number}> = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        brightness: 0.3 + Math.random() * 0.7
      })
    }

    // Outward flowing particles (opposite of black hole)
    const outflowParticles: Array<{x: number; y: number; vx: number; vy: number; life: number; size: number; color: string}> = []
    
    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Bright background
      ctx.fillStyle = '#f0f5ff'
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background stars (dimmer due to bright background)
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(100, 100, 150, ${star.brightness * 0.2})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Space-time grid (curved outward - opposite of black hole)
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)'
      ctx.lineWidth = 0.5
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath()
        for (let x = 0; x <= canvas.offsetWidth; x += 4) {
          const baseY = centerY + i * 16
          const dx = x - centerX
          const dy = baseY - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          let warpedY = baseY
          if (dist > eventHorizonRadius && dist < 180) {
            const warpStrength = Math.pow(180 / dist, 2) * 8
            warpedY = baseY - (dy / dist) * warpStrength // Opposite direction
          }
          if (x === 0) ctx.moveTo(x, warpedY)
          else ctx.lineTo(x, warpedY)
        }
        ctx.stroke()
      }

      // Outflow particles (matter being expelled)
      if (Math.random() < 0.15) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 2
        outflowParticles.push({
          x: centerX + Math.cos(angle) * (eventHorizonRadius + 5),
          y: centerY + Math.sin(angle) * (eventHorizonRadius + 5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1 + Math.random() * 2,
          color: `hsl(${200 + Math.random() * 60}, 80%, 70%)`
        })
      }

      for (let i = outflowParticles.length - 1; i >= 0; i--) {
        const p = outflowParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.008
        if (p.life <= 0 || p.x < 0 || p.x > canvas.offsetWidth || p.y < 0 || p.y > canvas.offsetHeight) {
          outflowParticles.splice(i, 1)
          continue
        }
        ctx.fillStyle = p.color.replace('70%', `${70 * p.life}%`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

      // Light rays emanating outward
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.3
        const innerR = eventHorizonRadius + 5
        const outerR = eventHorizonRadius + 30 + Math.sin(time * 2 + i) * 10
        
        ctx.strokeStyle = 'rgba(255, 220, 100, 0.4)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * innerR, centerY + Math.sin(angle) * innerR)
        ctx.lineTo(centerX + Math.cos(angle) * outerR, centerY + Math.sin(angle) * outerR)
        ctx.stroke()
      }

      // Glowing white core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, eventHorizonRadius)
      coreGradient.addColorStop(0, '#FFFFFF')
      coreGradient.addColorStop(0.3, '#F0F8FF')
      coreGradient.addColorStop(0.7, '#E0F0FF')
      coreGradient.addColorStop(1, '#C0E0FF')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Outer glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, eventHorizonRadius, centerX, centerY, eventHorizonRadius + 30)
      glowGradient.addColorStop(0, 'rgba(200, 230, 255, 0.8)')
      glowGradient.addColorStop(1, 'rgba(200, 230, 255, 0)')
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius + 30, 0, Math.PI * 2)
      ctx.fill()

      // Event horizon ring
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.8)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Label
      ctx.fillStyle = 'rgba(50, 50, 100, 0.8)'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Белая дыра', centerX, canvas.offsetHeight - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [massSolar])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-cyan-400">Масса</span>
          <span className="text-white font-mono">{massSolar} M☉</span>
        </div>
        <Slider value={[massSolar]} onValueChange={(v) => setMassSolar(v[0])} min={1} max={50} step={1} />
      </div>

      <div className="bg-cyan-900/20 rounded-lg p-2 border border-cyan-500/20 text-xs">
        <div className="text-cyan-300 font-semibold mb-1">⚪ Что такое белая дыра?</div>
        <p className="text-gray-300">
          Теоретический объект, обратный чёрной дыре. Материя может только <strong>покидать</strong> её, 
          но не может войти извне. Существует только как математическое решение уравнений ОТО, 
          но не наблюдалась на практике.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/50 rounded p-2 border border-gray-700">
          <div className="text-red-400 font-semibold">🕳️ Чёрная дыра</div>
          <div className="text-gray-400">Всё входит, ничего не выходит</div>
        </div>
        <div className="bg-cyan-950/30 rounded p-2 border border-cyan-500/20">
          <div className="text-cyan-400 font-semibold">⚪ Белая дыра</div>
          <div className="text-gray-400">Всё выходит, ничего не входит</div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">🌌 Кротовые норы</div>
        <p className="text-gray-400 mt-1">
          Чёрная и белая дыра могут быть соединены "мостом Эйнштейна-Розена" — 
          гипотетическим туннелем в пространстве-времени.
        </p>
      </div>
    </div>
  )
}

// ==================== SCHRÖDINGER'S CAT ====================
function SchrodingersCatVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [observationCount, setObservationCount] = useState(0)
  const [catState, setCatState] = useState<'alive' | 'dead' | 'superposition'>('superposition')
  const [isObserving, setIsObserving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    let time = 0
    let superpositionPhase = 0

    const animate = () => {
      time += 0.016
      superpositionPhase += 0.05
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#0a0a15'
      ctx.fillRect(0, 0, width, height)

      // Box
      const boxWidth = 120
      const boxHeight = 100
      const boxX = centerX - boxWidth / 2
      const boxY = centerY - boxHeight / 2 - 20

      // Draw box
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.8)'
      ctx.lineWidth = 3
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

      // Question marks when in superposition
      if (catState === 'superposition' && !isObserving) {
        ctx.fillStyle = `rgba(255, 200, 100, ${0.5 + Math.sin(superpositionPhase) * 0.3})`
        ctx.font = 'bold 48px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('?', centerX, centerY)
        
        // Superposition waves
        ctx.strokeStyle = `rgba(150, 100, 255, ${0.3 + Math.sin(superpositionPhase) * 0.2})`
        ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(centerX, centerY - 20, 30 + i * 15 + Math.sin(superpositionPhase + i) * 5, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Ghost cat outlines
        ctx.globalAlpha = 0.3 + Math.sin(superpositionPhase) * 0.2
        // Alive ghost
        ctx.fillStyle = 'rgba(100, 255, 100, 0.3)'
        ctx.beginPath()
        ctx.ellipse(centerX - 20, centerY - 10, 15, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        // Dead ghost  
        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)'
        ctx.beginPath()
        ctx.ellipse(centerX + 20, centerY - 10, 15, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        // Probability indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '12px sans-serif'
        ctx.fillText('50% 🐱  50% 💀', centerX, centerY + 50)
      } else if (catState === 'alive') {
        // Alive cat
        ctx.fillStyle = '#90EE90'
        ctx.beginPath()
        ctx.ellipse(centerX, centerY - 10, 25, 30, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Ears
        ctx.beginPath()
        ctx.moveTo(centerX - 20, centerY - 35)
        ctx.lineTo(centerX - 15, centerY - 50)
        ctx.lineTo(centerX - 5, centerY - 35)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(centerX + 20, centerY - 35)
        ctx.lineTo(centerX + 15, centerY - 50)
        ctx.lineTo(centerX + 5, centerY - 35)
        ctx.fill()

        // Eyes
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(centerX - 8, centerY - 15, 3, 0, Math.PI * 2)
        ctx.arc(centerX + 8, centerY - 15, 3, 0, Math.PI * 2)
        ctx.fill()

        // Happy mouth
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY - 5, 8, 0.2, Math.PI - 0.2)
        ctx.stroke()

        ctx.fillStyle = '#90EE90'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText('😺 ЖИВ!', centerX, centerY + 55)
      } else if (catState === 'dead') {
        // Dead cat
        ctx.fillStyle = '#FFB6C1'
        ctx.beginPath()
        ctx.ellipse(centerX, centerY - 5, 30, 15, 0, 0, Math.PI * 2)
        ctx.fill()

        // X eyes
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX - 12, centerY - 12)
        ctx.lineTo(centerX - 6, centerY - 6)
        ctx.moveTo(centerX - 12, centerY - 6)
        ctx.lineTo(centerX - 6, centerY - 12)
        ctx.moveTo(centerX + 6, centerY - 12)
        ctx.lineTo(centerX + 12, centerY - 6)
        ctx.moveTo(centerX + 6, centerY - 6)
        ctx.lineTo(centerX + 12, centerY - 12)
        ctx.stroke()

        // Tongue
        ctx.fillStyle = '#FF6B6B'
        ctx.beginPath()
        ctx.ellipse(centerX + 5, centerY + 5, 5, 8, 0.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#FF6B6B'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText('💀 МЁРТВ', centerX, centerY + 55)
      }

      // Radioactive atom
      ctx.fillStyle = 'rgba(0, 255, 150, 0.8)'
      ctx.beginPath()
      ctx.arc(boxX + 15, boxY + 25, 8 + Math.sin(time * 3) * 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Radiation symbol
      ctx.strokeStyle = 'rgba(0, 255, 150, 0.5)'
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(boxX + 15, boxY + 25, 12 + i * 4, -0.5 + i * 2.1, 0.5 + i * 2.1)
        ctx.stroke()
      }

      // Poison vial
      ctx.fillStyle = 'rgba(150, 0, 255, 0.6)'
      ctx.fillRect(boxX + boxWidth - 20, boxY + 15, 10, 25)
      ctx.fillStyle = 'rgba(150, 0, 255, 0.8)'
      ctx.font = '8px sans-serif'
      ctx.fillText('☠️', boxX + boxWidth - 18, boxY + 32)

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Ящик Шрёдингера', centerX, boxY - 10)

      // Wave function representation
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < width; x += 2) {
        const y = height - 30 + Math.sin(x * 0.05 + time * 2) * 10 * (catState === 'superposition' ? 1 : 0)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [catState, isObserving])

  const observe = () => {
    setIsObserving(true)
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'alive' : 'dead'
      setCatState(result)
      setIsObserving(false)
      setObservationCount(c => c + 1)
    }, 1000)
  }

  const reset = () => {
    setCatState('superposition')
  }

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="flex gap-2">
        <Button 
          onClick={observe} 
          disabled={isObserving || catState !== 'superposition'}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
          size="sm"
        >
          {isObserving ? '⏳ Наблюдение...' : '👁️ Открыть ящик'}
        </Button>
        <Button 
          onClick={reset} 
          variant="outline"
          size="sm"
          disabled={catState === 'superposition'}
        >
          🔄 Сброс
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-green-950/30 rounded p-2 border border-green-500/20">
          <div className="text-green-400 font-semibold">🐱 Жив</div>
          <div className="text-white font-mono">{observationCount > 0 ? Math.round(observationCount * 0.5) : '?'} раз</div>
        </div>
        <div className="bg-red-950/30 rounded p-2 border border-red-500/20">
          <div className="text-red-400 font-semibold">💀 Мёртв</div>
          <div className="text-white font-mono">{observationCount > 0 ? observationCount - Math.round(observationCount * 0.5) : '?'} раз</div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">🐱 Парадокс Шрёдингера (1935)</div>
        <p className="text-gray-400 mt-1">
          До наблюдения кот находится в суперпозиции живого и мёртвого состояний.
          Акт измерения "коллапсирует" волновую функцию в одно определённое состояние.
        </p>
      </div>
    </div>
  )
}

// ==================== BIG BANG ====================
function BigBangVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [expansionSpeed, setExpansionSpeed] = useState(50)
  const [timeScale, setTimeScale] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Particles representing matter/galaxies
    const particles: Array<{
      angle: number
      distance: number
      baseDistance: number
      size: number
      color: string
      type: 'galaxy' | 'particle' | 'photon'
    }> = []

    // Initialize particles
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const baseDist = 5 + Math.random() * 100
      particles.push({
        angle,
        distance: baseDist,
        baseDistance: baseDist,
        size: 1 + Math.random() * 2,
        color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
        type: Math.random() < 0.3 ? 'galaxy' : Math.random() < 0.5 ? 'photon' : 'particle'
      })
    }

    let time = 0

    const animate = () => {
      if (isPlaying) {
        time += 0.016
      }
      ctx.clearRect(0, 0, width, height)

      // Background - cosmic microwave radiation
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
      const temp = Math.max(0, 3000 - timeScale * 30)
      const bgAlpha = Math.min(0.3, timeScale * 0.01)
      bgGradient.addColorStop(0, `rgba(255, ${100 + temp/20}, ${50 + temp/30}, ${bgAlpha})`)
      bgGradient.addColorStop(0.5, `rgba(100, 50, 150, ${bgAlpha * 0.5})`)
      bgGradient.addColorStop(1, 'rgba(5, 5, 20, 1)')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Expansion factor based on time and speed
      const expansionFactor = 1 + (timeScale / 100) * (expansionSpeed / 50) * 3

      // Draw particles
      particles.forEach((p) => {
        const expandedDist = p.baseDistance * expansionFactor
        
        // Add some wobble
        const wobble = Math.sin(time * 2 + p.angle) * 2
        const x = centerX + Math.cos(p.angle) * (expandedDist + wobble)
        const y = centerY + Math.sin(p.angle) * (expandedDist + wobble)

        if (expandedDist < Math.max(width, height)) {
          if (p.type === 'galaxy') {
            // Galaxy spiral
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(x, y, p.size * 2, 0, Math.PI * 2)
            ctx.fill()
            
            // Spiral arms
            ctx.strokeStyle = p.color.replace('70%', '50%')
            ctx.lineWidth = 0.5
            for (let arm = 0; arm < 2; arm++) {
              ctx.beginPath()
              for (let t = 0; t < 20; t++) {
                const armAngle = p.angle + arm * Math.PI + t * 0.3
                const armDist = p.size * 2 + t * 0.5
                const ax = x + Math.cos(armAngle) * armDist
                const ay = y + Math.sin(armAngle) * armDist
                if (t === 0) ctx.moveTo(ax, ay)
                else ctx.lineTo(ax, ay)
              }
              ctx.stroke()
            }
          } else if (p.type === 'photon') {
            // Photon - faster, smaller
            ctx.fillStyle = `rgba(255, 255, 200, ${0.5 + Math.sin(time * 5 + p.angle) * 0.3})`
            ctx.beginPath()
            ctx.arc(x, y, p.size * 0.5, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Regular particle
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(x, y, p.size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Central singularity / early universe glow
      if (timeScale < 30) {
        const singularityGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50 - timeScale)
        singularityGlow.addColorStop(0, `rgba(255, 255, 200, ${1 - timeScale/30})`)
        singularityGlow.addColorStop(0.5, `rgba(255, 150, 50, ${0.5 - timeScale/60})`)
        singularityGlow.addColorStop(1, 'rgba(255, 50, 0, 0)')
        ctx.fillStyle = singularityGlow
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50 - timeScale, 0, Math.PI * 2)
        ctx.fill()
      }

      // Time scale indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      
      let eraText = ''
      if (timeScale < 5) eraText = '⏱️ t < 10⁻⁴³ с (Планковская эпоха)'
      else if (timeScale < 15) eraText = '⏱️ t ~ 10⁻³⁵ с (Инфляция)'
      else if (timeScale < 30) eraText = '⏱️ t ~ 1 с (Кварк-глюонная плазма)'
      else if (timeScale < 50) eraText = '⏱️ t ~ 3 мин (Нуклеосинтез)'
      else if (timeScale < 70) eraText = '⏱️ t ~ 380 000 лет (Рекомбинация)'
      else eraText = '⏱️ t ~ 13.8 млрд лет (Сейчас)'
      
      ctx.fillText(eraText, 10, 20)
      ctx.fillText(`Радиус: ${(expansionFactor * 100).toFixed(0)} млрд св. лет`, 10, 35)

      // Scale factor
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.fillText(`a(t) = ${expansionFactor.toFixed(2)}`, 10, height - 10)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [expansionSpeed, timeScale, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTimeScale(t => Math.min(100, t + 0.5))
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-cyan-400">Скорость расширения</span>
            <span className="text-white font-mono">{expansionSpeed}%</span>
          </div>
          <Slider value={[expansionSpeed]} onValueChange={(v) => setExpansionSpeed(v[0])} min={10} max={100} step={5} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-yellow-400">Время</span>
            <span className="text-white font-mono">{timeScale.toFixed(0)}%</span>
          </div>
          <Slider value={[timeScale]} onValueChange={(v) => setTimeScale(v[0])} min={0} max={100} step={1} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" size="sm" className="flex-1">
          {isPlaying ? '⏸️ Пауза' : '▶️ Играть'}
        </Button>
        <Button onClick={() => setTimeScale(0)} variant="outline" size="sm" className="flex-1">
          🔄 Сначала
        </Button>
      </div>

      <div className="bg-orange-900/20 rounded-lg p-2 border border-orange-500/20 text-xs">
        <div className="text-orange-300 font-semibold">💥 Большой взрыв (13.8 млрд лет назад)</div>
        <p className="text-gray-400 mt-1">
          Вселенная родилась из сингулярности. Закон Хаббла: v = H₀·d — галактики удаляются 
          со скоростью, пропорциональной расстоянию.
        </p>
      </div>
    </div>
  )
}

// ==================== PHOTOELECTRIC EFFECT ====================
function PhotoelectricEffectVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frequency, setFrequency] = useState(50) // as % of threshold
  const [intensity, setIntensity] = useState(50)
  const [workFunction, setWorkFunction] = useState(2.5) // eV

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Metal surface
    const metalY = height * 0.6
    const metalHeight = height * 0.3

    // Photons
    const photons: Array<{x: number, y: number, vx: number, vy: number, energy: number}> = []
    // Electrons
    const electrons: Array<{x: number, y: number, vx: number, vy: number, life: number}> = []

    // Calculate photon energy based on frequency
    const photonEnergy = (frequency / 100) * 6 // eV (simplified)
    const canEmit = photonEnergy >= workFunction
    const kineticEnergy = Math.max(0, photonEnergy - workFunction)

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#0a0a15'
      ctx.fillRect(0, 0, width, height)

      // Metal plate
      const metalGradient = ctx.createLinearGradient(0, metalY, 0, height)
      metalGradient.addColorStop(0, '#4a4a6a')
      metalGradient.addColorStop(0.5, '#3a3a5a')
      metalGradient.addColorStop(1, '#2a2a4a')
      ctx.fillStyle = metalGradient
      ctx.fillRect(50, metalY, width - 100, metalHeight)
      
      // Metal surface highlight
      ctx.strokeStyle = '#6a6a8a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, metalY)
      ctx.lineTo(width - 50, metalY)
      ctx.stroke()

      // Metal label
      ctx.fillStyle = '#888'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Металлическая пластина', width / 2, metalY + metalHeight / 2)

      // Light source
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(30, height * 0.3, 15, 0, Math.PI * 2)
      ctx.fill()
      
      // Light rays
      ctx.strokeStyle = `rgba(255, 200, 50, ${0.3 + intensity / 200})`
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(45, height * 0.3 + (i - 2) * 8)
        ctx.lineTo(100, metalY - 10)
        ctx.stroke()
      }

      // Spawn photons based on intensity
      if (Math.random() < intensity / 100) {
        photons.push({
          x: 50,
          y: height * 0.3 + (Math.random() - 0.5) * 20,
          vx: 3 + Math.random(),
          vy: (metalY - height * 0.3) / 50 + (Math.random() - 0.5) * 0.5,
          energy: photonEnergy
        })
      }

      // Update and draw photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const p = photons[i]
        p.x += p.vx
        p.y += p.vy

        // Draw photon as wave packet
        const wavelength = 30 - (frequency / 100) * 20
        ctx.strokeStyle = frequency > 50 
          ? `rgba(150, 50, 255, ${0.8})` // UV
          : `rgba(255, 200, 50, ${0.8})` // Visible
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let dx = -15; dx <= 15; dx++) {
          const waveY = p.y + Math.sin((dx + time * 20) / wavelength * Math.PI * 2) * 5
          if (dx === -15) ctx.moveTo(p.x + dx, waveY)
          else ctx.lineTo(p.x + dx, waveY)
        }
        ctx.stroke()

        // Check collision with metal
        if (p.y >= metalY - 5) {
          // Emit electron if energy > work function
          if (canEmit && Math.random() < 0.7) {
            const eVx = (Math.random() - 0.3) * 2
            const eVy = -2 - kineticEnergy * 1.5 - Math.random() * 2
            electrons.push({
              x: p.x,
              y: metalY - 5,
              vx: eVx,
              vy: eVy,
              life: 1
            })
          }
          photons.splice(i, 1)
        }
      }

      // Update and draw electrons
      for (let i = electrons.length - 1; i >= 0; i--) {
        const e = electrons[i]
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.02 // gravity
        e.life -= 0.005

        if (e.life <= 0 || e.y > height) {
          electrons.splice(i, 1)
          continue
        }

        // Draw electron
        ctx.fillStyle = `rgba(100, 200, 255, ${e.life})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Electron trail
        ctx.strokeStyle = `rgba(100, 200, 255, ${e.life * 0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(e.x, e.y)
        ctx.lineTo(e.x - e.vx * 5, e.y - e.vy * 5)
        ctx.stroke()
      }

      // Energy diagram
      const diagramX = width - 80
      const diagramY = 30
      const diagramH = 80

      // Work function level
      ctx.strokeStyle = 'rgba(255, 150, 100, 0.8)'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(255, 150, 100, 0.8)'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`W = ${workFunction} эВ`, diagramX - 28, diagramY + diagramH * (1 - workFunction / 6) - 3)

      // Photon energy level
      ctx.strokeStyle = frequency > 50 
        ? 'rgba(150, 50, 255, 0.8)' 
        : 'rgba(255, 200, 50, 0.8)'
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.stroke()

      ctx.fillStyle = frequency > 50 
        ? 'rgba(150, 50, 255, 0.8)' 
        : 'rgba(255, 200, 50, 0.8)'
      ctx.fillText(`hν = ${photonEnergy.toFixed(1)} эВ`, diagramX - 28, diagramY + diagramH * (1 - photonEnergy / 6) - 3)

      // Labels
      ctx.fillStyle = '#888'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Энергия', diagramX, diagramY - 5)

      // Status
      ctx.fillStyle = canEmit ? '#90EE90' : '#FF6B6B'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(canEmit ? '✓ Фотоэффект!' : '✗ hν < W', 10, 20)

      if (canEmit) {
        ctx.fillStyle = '#90EE90'
        ctx.font = '10px sans-serif'
        ctx.fillText(`Eкин = ${(kineticEnergy * 1.6e-19).toExponential(1)} Дж`, 10, 35)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [frequency, intensity, workFunction])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg" />
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-purple-400">Частота ν</span>
            <span className="text-white font-mono">{(frequency * 0.8 + 400).toFixed(0)} ТГц</span>
          </div>
          <Slider value={[frequency]} onValueChange={(v) => setFrequency(v[0])} min={10} max={100} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-yellow-400">Интенсивность</span>
            <span className="text-white font-mono">{intensity}%</span>
          </div>
          <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} min={10} max={100} step={5} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-400">Работа выхода</span>
            <span className="text-white font-mono">{workFunction} эВ</span>
          </div>
          <Slider value={[workFunction * 10]} onValueChange={(v) => setWorkFunction(v[0] / 10)} min={10} max={50} step={1} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-purple-950/30 rounded p-2 border border-purple-500/20">
          <div className="text-purple-400 font-semibold">Уравнение Эйнштейна</div>
          <div className="text-white font-mono">hν = W + E_кин</div>
        </div>
        <div className="bg-green-950/30 rounded p-2 border border-green-500/20">
          <div className="text-green-400 font-semibold">Кин. энергия</div>
          <div className="text-white font-mono">E = hν - W</div>
        </div>
      </div>

      <div className="bg-yellow-900/20 rounded-lg p-2 border border-yellow-500/20 text-xs">
        <div className="text-yellow-300 font-semibold">⚡ Фотоэффект (Эйнштейн, 1905)</div>
        <p className="text-gray-400 mt-1">
          Свет состоит из квантов (фотонов). Электрон вылетает только если hν ≥ W. 
          Интенсивность влияет на количество электронов, а не их энергию!
        </p>
      </div>
    </div>
  )
}

// ==================== BROWNIAN MOTION ====================
function BrownianMotionVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particleCount, setParticleCount] = useState(5)
  const [temperature, setTemperature] = useState(300) // Kelvin
  const [showTrails, setShowTrails] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Large visible particles
    interface Particle {
      x: number
      y: number
      trail: Array<{x: number, y: number}>
      color: string
    }
    
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 50,
        trail: [],
        color: `hsl(${i * 60 + 200}, 70%, 60%)`
      })
    }

    // Small water molecules (for visualization)
    const molecules: Array<{x: number, y: number, vx: number, vy: number}> = []
    for (let i = 0; i < 200; i++) {
      molecules.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4
      })
    }

    // Speed based on temperature (simplified)
    const speedFactor = Math.sqrt(temperature / 300) * 2

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background - water
      ctx.fillStyle = 'rgba(20, 40, 80, 0.3)'
      ctx.fillRect(0, 0, width, height)

      // Update and draw molecules
      ctx.fillStyle = 'rgba(100, 150, 255, 0.4)'
      molecules.forEach((m) => {
        // Random walk
        m.vx += (Math.random() - 0.5) * speedFactor
        m.vy += (Math.random() - 0.5) * speedFactor
        
        // Limit speed
        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy)
        if (speed > 3 * speedFactor) {
          m.vx = (m.vx / speed) * 3 * speedFactor
          m.vy = (m.vy / speed) * 3 * speedFactor
        }

        m.x += m.vx
        m.y += m.vy

        // Bounce off walls
        if (m.x < 0 || m.x > width) m.vx *= -1
        if (m.y < 0 || m.y > height) m.vy *= -1
        m.x = Math.max(0, Math.min(width, m.x))
        m.y = Math.max(0, Math.min(height, m.y))

        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update large particles
      particles.forEach((p) => {
        // Store trail
        if (showTrails) {
          p.trail.push({x: p.x, y: p.y})
          if (p.trail.length > 100) p.trail.shift()
        }

        // Brownian motion - random kicks from molecules
        let kickX = 0, kickY = 0
        molecules.forEach((m) => {
          const dx = p.x - m.x
          const dy = p.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 20) {
            kickX += dx / dist * speedFactor * 0.3
            kickY += dy / dist * speedFactor * 0.3
          }
        })

        // Apply kick with damping
        p.x += kickX + (Math.random() - 0.5) * speedFactor * 0.5
        p.y += kickY + (Math.random() - 0.5) * speedFactor * 0.5

        // Keep in bounds
        p.x = Math.max(20, Math.min(width - 20, p.x))
        p.y = Math.max(20, Math.min(height - 20, p.y))

        // Draw trail
        if (showTrails && p.trail.length > 1) {
          ctx.strokeStyle = p.color.replace('60%)', '40%)')
          ctx.lineWidth = 1
          ctx.beginPath()
          p.trail.forEach((t, i) => {
            if (i === 0) ctx.moveTo(t.x, t.y)
            else ctx.lineTo(t.x, t.y)
          })
          ctx.stroke()
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, p.color.replace('60%)', '30%)'))
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Temperature indicator
      ctx.fillStyle = `rgba(255, ${200 - temperature / 5}, ${100 - temperature / 10}, 0.8)`
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`T = ${temperature} K`, 10, 20)

      // Info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '9px sans-serif'
      ctx.fillText('H₂O молекулы: 200', 10, height - 20)
      ctx.fillText(`Частицы: ${particleCount}`, 10, height - 8)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, temperature, showTrails])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg" />
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-400">Температура</span>
            <span className="text-white font-mono">{temperature} K</span>
          </div>
          <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={100} max={1000} step={50} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-cyan-400">Частицы</span>
            <span className="text-white font-mono">{particleCount}</span>
          </div>
          <Slider value={[particleCount]} onValueChange={(v) => setParticleCount(v[0])} min={1} max={15} step={1} />
        </div>
      </div>

      <Button onClick={() => setShowTrails(!showTrails)} variant="outline" size="sm" className="w-full text-xs">
        {showTrails ? '🔄 Скрыть следы' : '🔄 Показать следы'}
      </Button>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-950/30 rounded p-2 border border-blue-500/20">
          <div className="text-blue-400 font-semibold">Броуновское движение</div>
          <div className="text-gray-400">Хаотичное движение частиц</div>
        </div>
        <div className="bg-orange-950/30 rounded p-2 border border-orange-500/20">
          <div className="text-orange-400 font-semibold">Броун, 1827</div>
          <div className="text-gray-400">Пыльца в воде</div>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-500/20 text-xs">
        <div className="text-blue-300 font-semibold">🔬 Броуновское движение</div>
        <p className="text-gray-400 mt-1">
          Крупные частицы хаотично движутся под ударами молекул. Эйнштейн (1905) объяснил это 
          тепловой энергией молекул: &lt;x²&gt; = 2Dt, где D — коэффициент диффузии.
        </p>
      </div>
    </div>
  )
}

// ==================== GRAVITATIONAL WAVES ====================
function GravitationalWavesVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mass1, setMass1] = useState(30) // Solar masses
  const [mass2, setMass2] = useState(30)
  const [distance, setDistance] = useState(50)
  const [timeScale, setTimeScale] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    let time = 0

    const animate = () => {
      if (isPlaying) {
        time += 0.016
        setTimeScale(t => Math.min(100, t + 0.2))
      }
      ctx.clearRect(0, 0, width, height)

      // Background - spacetime grid
      ctx.fillStyle = '#050510'
      ctx.fillRect(0, 0, width, height)

      // Draw spacetime grid with distortions
      const gridSize = 20
      ctx.strokeStyle = 'rgba(60, 60, 150, 0.3)'
      ctx.lineWidth = 0.5

      // Calculate orbital parameters
      const totalMass = mass1 + mass2
      const orbitalRadius = distance * 0.5
      const orbitalPeriod = Math.sqrt(Math.pow(orbitalRadius, 3)) * 10
      const orbitalAngle = time * (2 + timeScale / 20)

      // Position of the two masses
      const r1 = orbitalRadius * mass2 / totalMass
      const r2 = orbitalRadius * mass1 / totalMass
      const x1 = centerX - Math.cos(orbitalAngle) * r1
      const y1 = centerY - Math.sin(orbitalAngle) * r1
      const x2 = centerX + Math.cos(orbitalAngle) * r2
      const y2 = centerY + Math.sin(orbitalAngle) * r2

      // Gravitational wave strain (simplified)
      const strain = (mass1 * mass2) / (distance * distance) * 0.001

      // Draw distorted grid
      for (let i = -15; i <= 15; i++) {
        ctx.beginPath()
        for (let j = -15; j <= 15; j++) {
          const baseX = centerX + i * gridSize
          const baseY = centerY + j * gridSize
          
          // Calculate wave distortion
          const dist1 = Math.sqrt(Math.pow(baseX - x1, 2) + Math.pow(baseY - y1, 2))
          const dist2 = Math.sqrt(Math.pow(baseX - x2, 2) + Math.pow(baseY - y2, 2))
          
          // Wave amplitude decreases with distance
          const wave1 = Math.sin(dist1 * 0.05 - time * 3) * strain * 2000 / (1 + dist1 * 0.02)
          const wave2 = Math.sin(dist2 * 0.05 - time * 3) * strain * 2000 / (1 + dist2 * 0.02)
          
          const distortedX = baseX + wave1 + wave2
          const distortedY = baseY + wave1 + wave2
          
          if (j === -15) ctx.moveTo(distortedX, distortedY)
          else ctx.lineTo(distortedX, distortedY)
        }
        ctx.stroke()
      }

      // Draw perpendicular grid lines
      for (let j = -15; j <= 15; j++) {
        ctx.beginPath()
        for (let i = -15; i <= 15; i++) {
          const baseX = centerX + i * gridSize
          const baseY = centerY + j * gridSize
          
          const dist1 = Math.sqrt(Math.pow(baseX - x1, 2) + Math.pow(baseY - y1, 2))
          const dist2 = Math.sqrt(Math.pow(baseX - x2, 2) + Math.pow(baseY - y2, 2))
          
          const wave1 = Math.sin(dist1 * 0.05 - time * 3) * strain * 2000 / (1 + dist1 * 0.02)
          const wave2 = Math.sin(dist2 * 0.05 - time * 3) * strain * 2000 / (1 + dist2 * 0.02)
          
          const distortedX = baseX + wave1 + wave2
          const distortedY = baseY + wave1 + wave2
          
          if (i === -15) ctx.moveTo(distortedX, distortedY)
          else ctx.lineTo(distortedX, distortedY)
        }
        ctx.stroke()
      }

      // Draw gravitational wave ripples
      for (let r = 0; r < 8; r++) {
        const waveRadius = ((time * 60 + r * 30) % 200) + 50
        const alpha = 0.3 - waveRadius / 600
        if (alpha > 0) {
          ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Draw binary black holes
      const size1 = 8 + mass1 * 0.3
      const size2 = 8 + mass2 * 0.3

      // Black hole 1
      const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, size1)
      gradient1.addColorStop(0, '#000')
      gradient1.addColorStop(0.8, '#000')
      gradient1.addColorStop(1, 'rgba(255, 100, 50, 0.5)')
      ctx.fillStyle = gradient1
      ctx.beginPath()
      ctx.arc(x1, y1, size1, 0, Math.PI * 2)
      ctx.fill()

      // Black hole 2
      const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, size2)
      gradient2.addColorStop(0, '#000')
      gradient2.addColorStop(0.8, '#000')
      gradient2.addColorStop(1, 'rgba(100, 150, 255, 0.5)')
      ctx.fillStyle = gradient2
      ctx.beginPath()
      ctx.arc(x2, y2, size2, 0, Math.PI * 2)
      ctx.fill()

      // Orbital trail
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbitalRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`M₁ = ${mass1} M☉`, 10, 20)
      ctx.fillText(`M₂ = ${mass2} M☉`, 10, 35)
      ctx.fillText(`D = ${distance} км`, 10, 50)
      ctx.fillText(`h ≈ ${strain.toExponential(1)}`, 10, 65)

      // Frequency
      const freq = (1 / orbitalPeriod) * 10
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.fillText(`f ≈ ${freq.toFixed(1)} Гц`, 10, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mass1, mass2, distance, isPlaying, timeScale])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-400">M₁</span>
            <span className="text-white font-mono">{mass1} M☉</span>
          </div>
          <Slider value={[mass1]} onValueChange={(v) => setMass1(v[0])} min={5} max={50} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-400">M₂</span>
            <span className="text-white font-mono">{mass2} M☉</span>
          </div>
          <Slider value={[mass2]} onValueChange={(v) => setMass2(v[0])} min={5} max={50} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-400">Расст.</span>
            <span className="text-white font-mono">{distance} км</span>
          </div>
          <Slider value={[distance]} onValueChange={(v) => setDistance(v[0])} min={20} max={100} step={5} />
        </div>
      </div>

      <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" size="sm" className="w-full text-xs">
        {isPlaying ? '⏸️ Пауза' : '▶️ Играть'}
      </Button>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-purple-950/30 rounded p-2 border border-purple-500/20">
          <div className="text-purple-400 font-semibold">LIGO, 2015</div>
          <div className="text-gray-400">Первое обнаружение GW150914</div>
        </div>
        <div className="bg-cyan-950/30 rounded p-2 border border-cyan-500/20">
          <div className="text-cyan-400 font-semibold">Деформация h</div>
          <div className="text-gray-400">~10⁻²¹ (безмерная)</div>
        </div>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">〰️ Гравитационные волны</div>
        <p className="text-gray-400 mt-1">
          Рябь пространства-времени от ускоренных масс. Объекты с ~30 M☉ сливаются за доли секунды, 
          излучая больше энергии, чем все звёзды Вселенной вместе!
        </p>
      </div>
    </div>
  )
}

// ==================== QUANTUM ENTANGLEMENT ====================
function QuantumEntanglementVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [entanglementStrength, setEntanglementStrength] = useState(80)
  const [measuredParticle, setMeasuredParticle] = useState<'left' | 'right' | null>(null)
  const [leftState, setLeftState] = useState<'superposition' | 'up' | 'down'>('superposition')
  const [rightState, setRightState] = useState<'superposition' | 'up' | 'down'>('superposition')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const leftX = width * 0.25
    const rightX = width * 0.75
    const centerY = height / 2

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = '#0a0a15'
      ctx.fillRect(0, 0, width, height)

      // Entanglement visualization - wave connection
      if (leftState === 'superposition' && rightState === 'superposition') {
        ctx.strokeStyle = `rgba(150, 100, 255, ${entanglementStrength / 100 * 0.5})`
        ctx.lineWidth = 2
        ctx.beginPath()
        
        for (let x = leftX + 40; x < rightX - 40; x += 2) {
          const progress = (x - leftX) / (rightX - leftX)
          const waveY = Math.sin(progress * Math.PI * 4 + time * 3) * 20 * (entanglementStrength / 100)
          const y = centerY + waveY
          if (x === leftX + 40) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Particles along the entanglement line
        for (let i = 0; i < 10; i++) {
          const progress = (time * 0.5 + i * 0.1) % 1
          const x = leftX + 40 + progress * (rightX - leftX - 80)
          const y = centerY + Math.sin(progress * Math.PI * 4 + time * 3) * 20 * (entanglementStrength / 100)
          
          ctx.fillStyle = `rgba(150, 100, 255, ${0.5 + Math.sin(time * 5 + i) * 0.3})`
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw left particle
      const drawParticle = (x: number, state: 'superposition' | 'up' | 'down', label: string) => {
        const radius = 30
        
        // Glow
        const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, radius + 20)
        if (state === 'superposition') {
          gradient.addColorStop(0, 'rgba(150, 100, 255, 0.3)')
          gradient.addColorStop(1, 'rgba(150, 100, 255, 0)')
        } else if (state === 'up') {
          gradient.addColorStop(0, 'rgba(100, 255, 150, 0.3)')
          gradient.addColorStop(1, 'rgba(100, 255, 150, 0)')
        } else {
          gradient.addColorStop(0, 'rgba(255, 100, 150, 0.3)')
          gradient.addColorStop(1, 'rgba(255, 100, 150, 0)')
        }
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, centerY, radius + 20, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(x, centerY, radius, 0, Math.PI * 2)
        
        if (state === 'superposition') {
          ctx.fillStyle = `rgba(100, 80, 200, ${0.7 + Math.sin(time * 3) * 0.2})`
          ctx.fill()
          
          // Spin both ways
          ctx.strokeStyle = 'rgba(100, 255, 150, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, centerY - 8, 10, 0, Math.PI * 2)
          ctx.stroke()
          ctx.strokeStyle = 'rgba(255, 100, 150, 0.6)'
          ctx.beginPath()
          ctx.arc(x, centerY + 8, 10, 0, Math.PI * 2)
          ctx.stroke()
          
          // Question mark
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.font = 'bold 20px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('?', x, centerY + 7)
        } else if (state === 'up') {
          ctx.fillStyle = 'rgba(100, 200, 150, 0.8)'
          ctx.fill()
          
          // Up arrow
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x, centerY + 10)
          ctx.lineTo(x, centerY - 10)
          ctx.moveTo(x - 8, centerY - 2)
          ctx.lineTo(x, centerY - 10)
          ctx.lineTo(x + 8, centerY - 2)
          ctx.stroke()
          
          ctx.fillStyle = '#90EE90'
          ctx.font = 'bold 12px sans-serif'
          ctx.fillText('↑', x, centerY + 25)
        } else {
          ctx.fillStyle = 'rgba(200, 100, 150, 0.8)'
          ctx.fill()
          
          // Down arrow
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x, centerY - 10)
          ctx.lineTo(x, centerY + 10)
          ctx.moveTo(x - 8, centerY + 2)
          ctx.lineTo(x, centerY + 10)
          ctx.lineTo(x + 8, centerY + 2)
          ctx.stroke()
          
          ctx.fillStyle = '#FF9999'
          ctx.font = 'bold 12px sans-serif'
          ctx.fillText('↓', x, centerY + 25)
        }

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(label, x, centerY + 50)
      }

      drawParticle(leftX, leftState, 'Частица A')
      drawParticle(rightX, rightState, 'Частица B')

      // Info text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Запутанность: ${entanglementStrength}%`, width / 2, 20)

      if (measuredParticle) {
        ctx.fillStyle = 'rgba(255, 200, 100, 0.8)'
        ctx.fillText(`Измерена частица: ${measuredParticle === 'left' ? 'A' : 'B'}`, width / 2, 35)
      }

      // Bell state formula
      ctx.fillStyle = 'rgba(100, 200, 255, 0.7)'
      ctx.font = '11px monospace'
      ctx.fillText('|Ψ⟩ = (|↑↑⟩ + |↓↓⟩) / √2', width / 2, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [entanglementStrength, leftState, rightState, measuredParticle])

  const measureLeft = () => {
    const result = Math.random() < 0.5 ? 'up' : 'down'
    setLeftState(result)
    setRightState(result === 'up' ? 'up' : 'down') // Entangled - same state!
    setMeasuredParticle('left')
  }

  const measureRight = () => {
    const result = Math.random() < 0.5 ? 'up' : 'down'
    setRightState(result)
    setLeftState(result === 'up' ? 'up' : 'down') // Entangled - same state!
    setMeasuredParticle('right')
  }

  const reset = () => {
    setLeftState('superposition')
    setRightState('superposition')
    setMeasuredParticle(null)
  }

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg" />
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-purple-400">Сила запутанности</span>
          <span className="text-white font-mono">{entanglementStrength}%</span>
        </div>
        <Slider value={[entanglementStrength]} onValueChange={(v) => setEntanglementStrength(v[0])} min={0} max={100} step={5} />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={measureLeft} 
          disabled={leftState !== 'superposition'}
          className="flex-1 text-xs bg-gradient-to-r from-green-600 to-teal-600"
          size="sm"
        >
          🔍 Измерить A
        </Button>
        <Button 
          onClick={measureRight} 
          disabled={rightState !== 'superposition'}
          className="flex-1 text-xs bg-gradient-to-r from-pink-600 to-purple-600"
          size="sm"
        >
          🔍 Измерить B
        </Button>
        <Button onClick={reset} variant="outline" size="sm" disabled={leftState === 'superposition'}>
          🔄
        </Button>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">🔗 "Жуткое дальнодействие" (Эйнштейн)</div>
        <p className="text-gray-400 mt-1">
          При измерении одной частицы другая мгновенно принимает то же состояние, 
          независимо от расстояния! Нарушает принцип локальности.
        </p>
      </div>
    </div>
  )
}

// ==================== BOHR ATOMIC MODEL ====================
function AtomicModelVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [element, setElement] = useState<'H' | 'He' | 'Li' | 'C' | 'Na'>('H')
  const [showTransitions, setShowTransitions] = useState(true)
  const [selectedTransition, setSelectedTransition] = useState<{from: number, to: number} | null>(null)

  // Element data: protons, electrons, electron configuration
  const elements = {
    H: { protons: 1, electrons: 1, shells: [1], name: 'Водород', color: '#FF6B6B' },
    He: { protons: 2, electrons: 2, shells: [2], name: 'Гелий', color: '#4ECDC4' },
    Li: { protons: 3, electrons: 3, shells: [2, 1], name: 'Литий', color: '#45B7D1' },
    C: { protons: 6, electrons: 6, shells: [2, 4], name: 'Углерод', color: '#96CEB4' },
    Na: { protons: 11, electrons: 11, shells: [2, 8, 1], name: 'Натрий', color: '#FFEAA7' },
  }

  const currentElement = elements[element]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Calculate shell radii
    const maxRadius = Math.min(width, height) * 0.4
    const shellRadii = currentElement.shells.map((_, i) => 
      maxRadius * (i + 1) / currentElement.shells.length
    )

    let time = 0
    const electronAngles: number[] = []
    let totalElectrons = 0
    currentElement.shells.forEach((count) => {
      for (let i = 0; i < count; i++) {
        electronAngles.push(totalElectrons * (360 / currentElement.electrons) * Math.PI / 180)
        totalElectrons++
      }
    })

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius + 30)
      bgGradient.addColorStop(0, '#0a0a20')
      bgGradient.addColorStop(1, '#050510')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Draw electron shells (orbits)
      shellRadii.forEach((radius, shellIndex) => {
        ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 - shellIndex * 0.05})`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        // Shell label
        ctx.fillStyle = 'rgba(150, 180, 255, 0.5)'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`n=${shellIndex + 1}`, centerX + radius + 15, centerY)
      })

      // Draw nucleus
      const nucleusRadius = 15 + currentElement.protons * 0.5
      const nucleusGradient = ctx.createRadialGradient(
        centerX - nucleusRadius/3, centerY - nucleusRadius/3, 0,
        centerX, centerY, nucleusRadius
      )
      nucleusGradient.addColorStop(0, currentElement.color)
      nucleusGradient.addColorStop(0.7, currentElement.color.replace(')', ', 0.7)').replace('rgb', 'rgba'))
      nucleusGradient.addColorStop(1, 'rgba(50, 50, 80, 0.8)')
      
      ctx.fillStyle = nucleusGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw protons and neutrons in nucleus
      const nucleonCount = currentElement.protons + Math.round(currentElement.protons * 1.1) // Approximate neutrons
      for (let i = 0; i < Math.min(nucleonCount, 15); i++) {
        const angle = (i / 15) * Math.PI * 2
        const r = nucleusRadius * 0.5 * Math.sqrt(i / 15)
        const nx = centerX + Math.cos(angle + time * 0.5) * r
        const ny = centerY + Math.sin(angle + time * 0.5) * r
        
        ctx.fillStyle = i < currentElement.protons ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 150, 255, 0.8)'
        ctx.beginPath()
        ctx.arc(nx, ny, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Element symbol
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(element, centerX, centerY + 5)

      // Draw electrons
      let electronIndex = 0
      currentElement.shells.forEach((count, shellIndex) => {
        const radius = shellRadii[shellIndex]
        const shellSpeed = 2 - shellIndex * 0.3 // Outer shells move slower

        for (let i = 0; i < count; i++) {
          const angle = electronAngles[electronIndex] + time * shellSpeed
          const ex = centerX + Math.cos(angle) * radius
          const ey = centerY + Math.sin(angle) * radius

          // Electron glow
          const electronGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8)
          electronGlow.addColorStop(0, 'rgba(100, 200, 255, 0.8)')
          electronGlow.addColorStop(1, 'rgba(100, 200, 255, 0)')
          ctx.fillStyle = electronGlow
          ctx.beginPath()
          ctx.arc(ex, ey, 8, 0, Math.PI * 2)
          ctx.fill()

          // Electron core
          ctx.fillStyle = '#64B5F6'
          ctx.beginPath()
          ctx.arc(ex, ey, 4, 0, Math.PI * 2)
          ctx.fill()

          // Electron trail
          ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, angle - 0.5, angle)
          ctx.stroke()

          electronIndex++
        }
      })

      // Show transition animation
      if (showTransitions && selectedTransition) {
        const fromRadius = shellRadii[selectedTransition.from - 1]
        const toRadius = shellRadii[selectedTransition.to - 1]
        const transitionProgress = (Math.sin(time * 3) + 1) / 2
        const currentRadius = fromRadius + (toRadius - fromRadius) * transitionProgress

        // Photon emission/absorption
        const photonX = centerX + currentRadius
        const photonY = centerY

        ctx.fillStyle = selectedTransition.to > selectedTransition.from 
          ? 'rgba(255, 255, 100, 0.9)' // Absorption (yellow)
          : 'rgba(255, 100, 100, 0.9)' // Emission (red)
        
        ctx.beginPath()
        ctx.arc(photonX, photonY, 6, 0, Math.PI * 2)
        ctx.fill()

        // Wave representation
        ctx.strokeStyle = selectedTransition.to > selectedTransition.from 
          ? 'rgba(255, 255, 100, 0.5)' 
          : 'rgba(255, 100, 100, 0.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = photonX + 10; x < width - 20; x += 2) {
          const y = photonY + Math.sin((x - photonX) * 0.2 + time * 5) * 5
          if (x === photonX + 10) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Energy label
        const deltaE = Math.abs(selectedTransition.to - selectedTransition.from) * 2.18 // Simplified
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`ΔE = ${deltaE.toFixed(2)} эВ`, photonX + 20, photonY - 10)
      }

      // Element info
      ctx.fillStyle = currentElement.color
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(currentElement.name, 15, 25)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '10px sans-serif'
      ctx.fillText(`Протонов: ${currentElement.protons}`, 15, 40)
      ctx.fillText(`Электронов: ${currentElement.electrons}`, 15, 55)
      ctx.fillText(`Оболочек: ${currentElement.shells.length}`, 15, 70)

      // Formula
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.font = '11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('E_n = -13.6 eV / n²', width / 2, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [element, showTransitions, selectedTransition, currentElement])

  const triggerTransition = (from: number, to: number) => {
    setSelectedTransition({ from, to })
    setTimeout(() => setSelectedTransition(null), 3000)
  }

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="flex gap-2 flex-wrap">
        {Object.keys(elements).map((el) => (
          <Button
            key={el}
            onClick={() => setElement(el as 'H' | 'He' | 'Li' | 'C' | 'Na')}
            variant={element === el ? 'default' : 'outline'}
            size="sm"
            className={`text-xs ${element === el ? 'bg-purple-600' : ''}`}
          >
            {el}
          </Button>
        ))}
      </div>

      {showTransitions && currentElement.shells.length > 1 && (
        <div className="flex gap-2">
          <Button 
            onClick={() => triggerTransition(1, 2)}
            variant="outline"
            size="sm"
            className="text-xs text-yellow-400 border-yellow-500/50"
          >
            ↑ Возбуждение
          </Button>
          <Button 
            onClick={() => triggerTransition(2, 1)}
            variant="outline"
            size="sm"
            className="text-xs text-red-400 border-red-500/50"
          >
            ↓ Излучение
          </Button>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-2 border border-blue-500/20 text-xs">
        <div className="text-cyan-300 font-semibold">⚛️ Модель Бора (1913)</div>
        <p className="text-gray-400 mt-1">
          Электроны движутся по дискретным орбитам. Переход между уровнями 
          сопровождается испусканием/поглощением фотона: ΔE = hν
        </p>
      </div>
    </div>
  )
}

// ==================== RADIOACTIVE DECAY ====================
function RadioactiveDecayVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [decayType, setDecayType] = useState<'alpha' | 'beta' | 'gamma'>('alpha')
  const [halfLife, setHalfLife] = useState(50)
  const [atomCount, setAtomCount] = useState(100)
  const [decayProgress, setDecayProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [decayedCount, setDecayedCount] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Initialize atoms in a grid
    interface Atom {
      x: number
      y: number
      decayed: boolean
      decayTime: number
    }
    const atoms: Atom[] = []
    const gridSize = Math.ceil(Math.sqrt(atomCount))
    const cellSize = Math.min(width, height) / (gridSize + 1)
    
    for (let i = 0; i < atomCount; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize
      atoms.push({
        x: cellSize + col * cellSize,
        y: cellSize + row * cellSize,
        decayed: false,
        decayTime: Math.random() * halfLife * 2
      })
    }

    // Particles from decay
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      type: 'alpha' | 'beta' | 'gamma'
      life: number
    }
    const particles: Particle[] = []

    let time = 0
    let currentDecayed = 0

    const animate = () => {
      if (isPlaying) {
        time += 0.016
        setDecayProgress(Math.min(100, time * 2))
      }

      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = decayType === 'alpha' ? '#0a1510' : 
                      decayType === 'beta' ? '#100a15' : '#15100a'
      ctx.fillRect(0, 0, width, height)

      // Decay logic
      atoms.forEach((atom) => {
        if (!atom.decayed && time > atom.decayTime * (100 / halfLife)) {
          atom.decayed = true
          currentDecayed++
          setDecayedCount(currentDecayed)

          // Emit particle
          const angle = Math.random() * Math.PI * 2
          const speed = decayType === 'alpha' ? 1.5 : 
                        decayType === 'beta' ? 3 : 4
          particles.push({
            x: atom.x,
            y: atom.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            type: decayType,
            life: 1
          })
        }
      })

      // Draw atoms
      atoms.forEach((atom) => {
        if (atom.decayed) {
          ctx.fillStyle = 'rgba(100, 100, 100, 0.5)'
        } else {
          const gradient = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, 8)
          gradient.addColorStop(0, decayType === 'alpha' ? '#4CAF50' : 
                                       decayType === 'beta' ? '#9C27B0' : '#FF9800')
          gradient.addColorStop(1, 'rgba(50, 50, 50, 0.5)')
          ctx.fillStyle = gradient
        }
        ctx.beginPath()
        ctx.arc(atom.x, atom.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.008

        if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles.splice(i, 1)
          continue
        }

        // Particle color based on type
        let color: string
        switch (p.type) {
          case 'alpha':
            color = `rgba(76, 175, 80, ${p.life})` // Green - He nucleus
            break
          case 'beta':
            color = `rgba(156, 39, 176, ${p.life})` // Purple - electron
            break
          case 'gamma':
            color = `rgba(255, 152, 0, ${p.life})` // Orange - photon
            break
        }

        // Particle trail
        ctx.strokeStyle = color.replace('1)', '0.3)')
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 5, p.y - p.vy * 5)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        // Particle glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
        glow.addColorStop(0, color)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()

        // Particle core
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, decayType === 'alpha' ? 4 : 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Decay curve
      const graphX = width - 100
      const graphY = 10
      const graphW = 90
      const graphH = 60

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(graphX, graphY, graphW, graphH)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(graphX, graphY + graphH)
      ctx.lineTo(graphX + graphW, graphY + graphH)
      ctx.moveTo(graphX, graphY + graphH)
      ctx.lineTo(graphX, graphY)
      ctx.stroke()

      // Exponential decay curve
      ctx.strokeStyle = decayType === 'alpha' ? '#4CAF50' : 
                        decayType === 'beta' ? '#9C27B0' : '#FF9800'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= graphW; i++) {
        const t = (i / graphW) * 5
        const remaining = Math.exp(-t * Math.LN2 / (halfLife / 50))
        const y = graphY + graphH - remaining * graphH
        if (i === 0) ctx.moveTo(graphX + i, y)
        else ctx.lineTo(graphX + i, y)
      }
      ctx.stroke()

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`N(t) = N₀·e^(-λt)`, 10, 25)
      ctx.fillText(`T½ = ${halfLife} ед.`, 10, 40)
      ctx.fillText(`Распалось: ${currentDecayed}/${atomCount}`, 10, 55)

      // Decay type info
      let decayLabel: string
      switch (decayType) {
        case 'alpha':
          decayLabel = 'α: ²⁴He (2p + 2n)'
          break
        case 'beta':
          decayLabel = 'β: e⁻ + ν̄ₑ'
          break
        case 'gamma':
          decayLabel = 'γ: hν (фотон)'
          break
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText(decayLabel, 10, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [decayType, halfLife, atomCount, isPlaying])

  const reset = () => {
    setDecayProgress(0)
    setDecayedCount(0)
  }

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-48 rounded-lg" />
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <Button 
          onClick={() => { setDecayType('alpha'); reset() }}
          variant={decayType === 'alpha' ? 'default' : 'outline'}
          className={`text-xs ${decayType === 'alpha' ? 'bg-green-600' : 'border-green-500/50 text-green-400'}`}
          size="sm"
        >
          α Альфа
        </Button>
        <Button 
          onClick={() => { setDecayType('beta'); reset() }}
          variant={decayType === 'beta' ? 'default' : 'outline'}
          className={`text-xs ${decayType === 'beta' ? 'bg-purple-600' : 'border-purple-500/50 text-purple-400'}`}
          size="sm"
        >
          β Бета
        </Button>
        <Button 
          onClick={() => { setDecayType('gamma'); reset() }}
          variant={decayType === 'gamma' ? 'default' : 'outline'}
          className={`text-xs ${decayType === 'gamma' ? 'bg-orange-600' : 'border-orange-500/50 text-orange-400'}`}
          size="sm"
        >
          γ Гамма
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-cyan-400">T½ Период полураспада</span>
            <span className="text-white font-mono">{halfLife}</span>
          </div>
          <Slider value={[halfLife]} onValueChange={(v) => { setHalfLife(v[0]); reset() }} min={10} max={100} step={5} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-yellow-400">Атомов</span>
            <span className="text-white font-mono">{atomCount}</span>
          </div>
          <Slider value={[atomCount]} onValueChange={(v) => { setAtomCount(v[0]); reset() }} min={25} max={200} step={25} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" size="sm" className="flex-1 text-xs">
          {isPlaying ? '⏸️ Пауза' : '▶️ Играть'}
        </Button>
        <Button onClick={reset} variant="outline" size="sm" className="flex-1 text-xs">
          🔄 Сброс
        </Button>
      </div>

      <div className="bg-green-900/20 rounded-lg p-2 border border-green-500/20 text-xs">
        <div className="text-green-300 font-semibold">☢️ Закон радиоактивного распада</div>
        <p className="text-gray-400 mt-1">
          N(t) = N₀·e^(-λt), где λ = ln(2)/T½. Распад — случайный процесс: 
          каждый атом имеет вероятность 50% распасться за период полураспада.
        </p>
      </div>
    </div>
  )
}

// ==================== SUPERCONDUCTIVITY ====================
function SuperconductivityVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [temperature, setTemperature] = useState(100) // Kelvin
  const [criticalTemp, setCriticalTemp] = useState(90) // Tc for YBCO
  const [showMagneticField, setShowMagneticField] = useState(true)
  const [levitationHeight, setLevitationHeight] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2

    // Superconducting state
    const isSuperconducting = temperature < criticalTemp
    const targetHeight = isSuperconducting ? 40 : 0
    
    let time = 0
    let currentHeight = levitationHeight

    const animate = () => {
      time += 0.03
      
      // Smoothly animate levitation height
      currentHeight += (targetHeight - currentHeight) * 0.05
      setLevitationHeight(currentHeight)

      ctx.clearRect(0, 0, width, height)

      // Background gradient based on temperature
      const tempRatio = temperature / 150
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      if (isSuperconducting) {
        bgGradient.addColorStop(0, '#0a1525')
        bgGradient.addColorStop(1, '#152540')
      } else {
        bgGradient.addColorStop(0, '#251510')
        bgGradient.addColorStop(1, '#402520')
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Temperature indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`T = ${temperature} K`, 10, 20)
      ctx.fillText(`Tc = ${criticalTemp} K`, 10, 35)
      
      // Superconductor state indicator
      ctx.fillStyle = isSuperconducting ? '#60A5FA' : '#F87171'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(isSuperconducting ? '✓ Сверхпроводник' : '✗ Нормальное состояние', width - 10, 20)

      // Draw permanent magnet (top)
      const magnetY = 30
      const magnetWidth = 80
      const magnetHeight = 25
      
      // Magnet poles
      ctx.fillStyle = '#EF4444'
      ctx.fillRect(centerX - magnetWidth/2, magnetY, magnetWidth/2, magnetHeight)
      ctx.fillStyle = '#3B82F6'
      ctx.fillRect(centerX, magnetY, magnetWidth/2, magnetHeight)
      
      // Magnet labels
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', centerX - magnetWidth/4, magnetY + 17)
      ctx.fillText('S', centerX + magnetWidth/4, magnetY + 17)

      // Draw magnetic field lines
      if (showMagneticField) {
        ctx.strokeStyle = isSuperconducting ? 'rgba(96, 165, 250, 0.4)' : 'rgba(248, 113, 113, 0.4)'
        ctx.lineWidth = 1.5
        
        for (let i = 0; i < 5; i++) {
          const offset = (i - 2) * 15
          
          ctx.beginPath()
          if (isSuperconducting) {
            // Field lines bend around superconductor (Meissner effect)
            const superconductorY = magnetY + magnetHeight + currentHeight + 30
            const superconductorTop = superconductorY - 20
            
            ctx.moveTo(centerX + offset, magnetY + magnetHeight)
            ctx.quadraticCurveTo(
              centerX + offset * 2.5, 
              (magnetY + magnetHeight + superconductorTop) / 2,
              centerX + offset, 
              superconductorTop
            )
          } else {
            // Field lines penetrate normal material
            ctx.moveTo(centerX + offset, magnetY + magnetHeight)
            ctx.lineTo(centerX + offset, height - 30)
          }
          ctx.stroke()
        }
      }

      // Draw superconductor sample
      const sampleY = magnetY + magnetHeight + currentHeight + 30
      const sampleWidth = 100
      const sampleHeight = 40

      // Sample glow when superconducting
      if (isSuperconducting) {
        const glow = ctx.createRadialGradient(centerX, sampleY + sampleHeight/2, 0, centerX, sampleY + sampleHeight/2, 80)
        glow.addColorStop(0, 'rgba(96, 165, 250, 0.3)')
        glow.addColorStop(1, 'rgba(96, 165, 250, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(centerX - 80, sampleY - 20, 160, sampleHeight + 40)
      }

      // Sample body
      const sampleGradient = ctx.createLinearGradient(centerX - sampleWidth/2, sampleY, centerX + sampleWidth/2, sampleY + sampleHeight)
      if (isSuperconducting) {
        sampleGradient.addColorStop(0, '#1E3A5F')
        sampleGradient.addColorStop(0.5, '#2563EB')
        sampleGradient.addColorStop(1, '#1E3A5F')
      } else {
        sampleGradient.addColorStop(0, '#4A4A4A')
        sampleGradient.addColorStop(0.5, '#6B6B6B')
        sampleGradient.addColorStop(1, '#4A4A4A')
      }
      ctx.fillStyle = sampleGradient
      ctx.beginPath()
      ctx.roundRect(centerX - sampleWidth/2, sampleY, sampleWidth, sampleHeight, 5)
      ctx.fill()

      // Sample label
      ctx.fillStyle = 'white'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('YBCO (YBa₂Cu₃O₇)', centerX, sampleY + sampleHeight/2 + 4)

      // Cooper pairs visualization (inside superconductor)
      if (isSuperconducting) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        for (let i = 0; i < 4; i++) {
          const px = centerX - 35 + i * 25
          const py = sampleY + sampleHeight/2 + Math.sin(time * 2 + i) * 3
          
          // Cooper pair (two electrons)
          ctx.beginPath()
          ctx.arc(px - 4, py, 3, 0, Math.PI * 2)
          ctx.arc(px + 4, py, 3, 0, Math.PI * 2)
          ctx.fill()
          
          // Connection line (pairing)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(px - 4, py)
          ctx.lineTo(px + 4, py)
          ctx.stroke()
        }
      }

      // Levitation arrow
      if (currentHeight > 5) {
        ctx.strokeStyle = '#4ADE80'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX - 60, sampleY + sampleHeight/2)
        ctx.lineTo(centerX - 70, sampleY + sampleHeight/2)
        ctx.lineTo(centerX - 65, sampleY + sampleHeight/2 - 5)
        ctx.moveTo(centerX - 70, sampleY + sampleHeight/2)
        ctx.lineTo(centerX - 65, sampleY + sampleHeight/2 + 5)
        ctx.stroke()
        
        ctx.fillStyle = '#4ADE80'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('левитация', centerX - 65, sampleY + sampleHeight/2 + 18)
      }

      // Temperature bar
      const barX = width - 30
      const barY = 50
      const barHeight = 80
      
      ctx.fillStyle = 'rgba(50, 50, 50, 0.5)'
      ctx.fillRect(barX - 8, barY, 16, barHeight)
      
      // Temperature fill
      const tempFill = 1 - (temperature / 150)
      const fillGradient = ctx.createLinearGradient(barX - 8, barY + barHeight, barX - 8, barY)
      fillGradient.addColorStop(0, '#3B82F6')
      fillGradient.addColorStop(0.5, '#8B5CF6')
      fillGradient.addColorStop(1, '#EF4444')
      ctx.fillStyle = fillGradient
      ctx.fillRect(barX - 6, barY + barHeight * (1 - tempFill), 12, barHeight * tempFill)
      
      // Critical temperature marker
      const tcY = barY + barHeight * (criticalTemp / 150)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(barX - 12, tcY)
      ctx.lineTo(barX + 12, tcY)
      ctx.stroke()
      ctx.fillStyle = '#FFD700'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Tc', barX + 15, tcY + 3)

      // Formula
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('B = 0 внутри сверхпроводника (эффект Мейсснера)', centerX, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [temperature, criticalTemp, showMagneticField, levitationHeight])

  const isSuperconducting = temperature < criticalTemp

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Температура T (K)</span>
            <span className="text-white font-mono">{temperature} K</span>
          </div>
          <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={4} max={150} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-yellow-400">Критическая Tc (K)</span>
            <span className="text-white font-mono">{criticalTemp} K</span>
          </div>
          <Slider value={[criticalTemp]} onValueChange={(v) => setCriticalTemp(v[0])} min={20} max={120} step={5} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={() => setShowMagneticField(!showMagneticField)} 
          variant="outline"
          size="sm"
          className={`flex-1 text-xs ${showMagneticField ? 'border-blue-500/50 text-blue-300' : ''}`}
        >
          🧲 Магнитное поле
        </Button>
        <Button 
          onClick={() => {
            setTemperature(temperature < criticalTemp ? 120 : 77)
          }}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          {temperature < criticalTemp ? '🔥 Нагреть' : '❄️ Охладить'}
        </Button>
      </div>

      <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-500/20 text-xs">
        <div className="text-blue-300 font-semibold">❄️ Сверхпроводимость (1911, Оннес)</div>
        <p className="text-gray-400 mt-1">
          При T &lt; Tc электрическое сопротивление падает до нуля. 
          Эффект Мейсснера (1933): сверхпроводник полностью вытесняет магнитное поле — 
          именно это позволяет магнитам левитировать!
        </p>
        <p className="text-cyan-400 mt-1">
          Куперовские пары: электроны объединяются и движутся без сопротивления.
        </p>
      </div>
    </div>
  )
}

// ==================== STANDARD MODEL ====================
function StandardModelVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null)
  const [showDecays, setShowDecays] = useState(false)

  // Standard Model particles data
  const particles = {
    quarks: [
      { name: 'u', fullName: 'Up', mass: '2.2 MeV', charge: '+2/3', color: '#EF4444', generation: 1 },
      { name: 'd', fullName: 'Down', mass: '4.7 MeV', charge: '-1/3', color: '#22C55E', generation: 1 },
      { name: 'c', fullName: 'Charm', mass: '1.28 GeV', charge: '+2/3', color: '#F97316', generation: 2 },
      { name: 's', fullName: 'Strange', mass: '95 MeV', charge: '-1/3', color: '#84CC16', generation: 2 },
      { name: 't', fullName: 'Top', mass: '173 GeV', charge: '+2/3', color: '#DC2626', generation: 3 },
      { name: 'b', fullName: 'Bottom', mass: '4.18 GeV', charge: '-1/3', color: '#16A34A', generation: 3 },
    ],
    leptons: [
      { name: 'e', fullName: 'Electron', mass: '0.511 MeV', charge: '-1', color: '#3B82F6', generation: 1 },
      { name: 'νe', fullName: 'Electron neutrino', mass: '< 0.000002 eV', charge: '0', color: '#60A5FA', generation: 1 },
      { name: 'μ', fullName: 'Muon', mass: '105.7 MeV', charge: '-1', color: '#8B5CF6', generation: 2 },
      { name: 'νμ', fullName: 'Muon neutrino', mass: '< 0.17 MeV', charge: '0', color: '#A78BFA', generation: 2 },
      { name: 'τ', fullName: 'Tau', mass: '1.777 GeV', charge: '-1', color: '#EC4899', generation: 3 },
      { name: 'ντ', fullName: 'Tau neutrino', mass: '< 18 MeV', charge: '0', color: '#F472B6', generation: 3 },
    ],
    bosons: [
      { name: 'γ', fullName: 'Photon', mass: '0', charge: '0', color: '#FBBF24', spin: '1', generation: 0 },
      { name: 'g', fullName: 'Gluon', mass: '0', charge: '0', color: '#F59E0B', spin: '1', generation: 0 },
      { name: 'Z', fullName: 'Z boson', mass: '91.2 GeV', charge: '0', color: '#A855F7', spin: '1', generation: 0 },
      { name: 'W', fullName: 'W boson', mass: '80.4 GeV', charge: '±1', color: '#EF4444', spin: '1', generation: 0 },
      { name: 'H', fullName: 'Higgs', mass: '125 GeV', charge: '0', color: '#FFD700', spin: '0', generation: 0 },
    ]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    let time = 0
    let hoveredParticle: typeof particles.quarks[0] | null = null

    const drawParticle = (
      x: number, y: number, 
      particle: typeof particles.quarks[0], 
      isHovered: boolean,
      isQuark: boolean = false
    ) => {
      const radius = isHovered ? 28 : 22
      
      // Glow effect
      if (isHovered) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2)
        glow.addColorStop(0, particle.color + 'AA')
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Particle body
      const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius)
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, particle.color + '88')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = isHovered ? '#FFFFFF' : particle.color
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()

      // Quark color charges (r, g, b)
      if (isQuark) {
        const colors = ['#EF4444', '#22C55E', '#3B82F6']
        for (let i = 0; i < 3; i++) {
          const angle = time * 2 + (i * Math.PI * 2 / 3)
          const px = x + Math.cos(angle) * (radius + 6)
          const py = y + Math.sin(angle) * (radius + 6)
          ctx.fillStyle = colors[i]
          ctx.beginPath()
          ctx.arc(px, py, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Particle symbol
      ctx.fillStyle = 'white'
      ctx.font = `bold ${isHovered ? 14 : 12}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(particle.name, x, y)

      return { x, y, radius, particle }
    }

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0a0a15')
      bgGradient.addColorStop(1, '#15152a')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Grid pattern
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Section labels
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      
      // Quarks section
      ctx.fillStyle = '#EF4444'
      ctx.fillText('КВАРКИ', width * 0.18, 25)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)'
      ctx.strokeRect(10, 35, width * 0.32, height - 50)
      
      // Leptons section
      ctx.fillStyle = '#3B82F6'
      ctx.fillText('ЛЕПТОНЫ', width * 0.5, 25)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.strokeRect(width * 0.35, 35, width * 0.3, height - 50)
      
      // Bosons section
      ctx.fillStyle = '#FBBF24'
      ctx.fillText('БОЗОНЫ', width * 0.82, 25)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
      ctx.strokeRect(width * 0.68, 35, width * 0.3, height - 50)

      // Generation labels
      ctx.font = '9px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText('I', 25, 55)
      ctx.fillText('II', 25, height * 0.4)
      ctx.fillText('III', 25, height * 0.7)

      const particlePositions: { x: number, y: number, radius: number, particle: typeof particles.quarks[0] }[] = []

      // Draw quarks
      particles.quarks.forEach((p, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = 30 + width * 0.05 + col * 60
        const y = 60 + row * (height - 80) / 3
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered, true)
        particlePositions.push(pos)
      })

      // Draw leptons
      particles.leptons.forEach((p, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = width * 0.35 + 30 + col * 60
        const y = 60 + row * (height - 80) / 3
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered)
        particlePositions.push(pos)
      })

      // Draw bosons
      particles.bosons.forEach((p, i) => {
        const x = width * 0.68 + 35 + (i % 2) * 60
        const y = 60 + Math.floor(i / 2) * 60 + (i >= 4 ? 30 : 0)
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered)
        particlePositions.push(pos)
      })

      // Show selected particle info
      const selected = [...particles.quarks, ...particles.leptons, ...particles.bosons]
        .find(p => p.name === selectedParticle)
      
      if (selected) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(width - 95, height - 70, 90, 65)
        ctx.strokeStyle = selected.color
        ctx.lineWidth = 2
        ctx.strokeRect(width - 95, height - 70, 90, 65)

        ctx.fillStyle = selected.color
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(selected.fullName, width - 88, height - 52)
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.font = '9px sans-serif'
        ctx.fillText(`m: ${selected.mass}`, width - 88, height - 38)
        ctx.fillText(`q: ${selected.charge}`, width - 88, height - 24)
        if ('spin' in selected) {
          ctx.fillText(`spin: ${selected.spin}`, width - 88, height - 10)
        }
      }

      // Force carriers animation
      if (showDecays) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        
        // Gluon lines between quarks
        for (let i = 0; i < 5; i++) {
          const q1 = particlePositions[i]
          const q2 = particlePositions[i + 1]
          if (q1 && q2 && i % 2 === 0) {
            ctx.beginPath()
            ctx.moveTo(q1.x, q1.y)
            const midX = (q1.x + q2.x) / 2 + Math.sin(time * 3) * 10
            const midY = (q1.y + q2.y) / 2 + Math.cos(time * 3) * 10
            ctx.quadraticCurveTo(midX, midY, q2.x, q2.y)
            ctx.stroke()
          }
        }
        ctx.setLineDash([])
      }

      // Higgs field effect
      const higgsPos = particlePositions.find(p => p.particle.name === 'H')
      if (higgsPos) {
        for (let i = 0; i < 8; i++) {
          const angle = time + i * Math.PI / 4
          const radius = 40 + Math.sin(time * 2 + i) * 5
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 - i * 0.03})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(higgsPos.x, higgsPos.y, radius, angle, angle + 0.3)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse interaction
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Check all particles
      const allParticles = [...particles.quarks, ...particles.leptons, ...particles.bosons]
      let found = false
      
      // This is simplified - in real implementation would need proper position tracking
      allParticles.forEach(p => {
        if (Math.abs(x - width * 0.5) < 30 && Math.abs(y - height * 0.5) < 30) {
          setSelectedParticle(p.name)
          found = true
        }
      })
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [selectedParticle, showDecays])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg cursor-pointer" />
      
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => setSelectedParticle('u')}
          variant={selectedParticle === 'u' ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${selectedParticle === 'u' ? 'bg-red-600' : 'border-red-500/50 text-red-400'}`}
        >
          u - Up
        </Button>
        <Button 
          onClick={() => setSelectedParticle('e')}
          variant={selectedParticle === 'e' ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${selectedParticle === 'e' ? 'bg-blue-600' : 'border-blue-500/50 text-blue-400'}`}
        >
          e - Электрон
        </Button>
        <Button 
          onClick={() => setSelectedParticle('H')}
          variant={selectedParticle === 'H' ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${selectedParticle === 'H' ? 'bg-yellow-500' : 'border-yellow-500/50 text-yellow-400'}`}
        >
          H - Хиггс
        </Button>
        <Button 
          onClick={() => setShowDecays(!showDecays)}
          variant="outline"
          size="sm"
          className="text-xs border-purple-500/50 text-purple-400"
        >
          🔄 Взаимодействия
        </Button>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">🧩 Стандартная модель (1970s)</div>
        <p className="text-gray-400 mt-1">
          Описывает все известные элементарные частицы и 3 из 4 фундаментальных взаимодействий 
          (электромагнитное, слабое, сильное). Гравитация не включена — это главная проблема физики!
        </p>
        <p className="text-yellow-400 mt-1">
          Бозон Хиггса (2012): даёт массу всем частицам через поле Хиггса.
        </p>
      </div>
    </div>
  )
}

// ==================== PHYSICS TIMELINE ====================
function PhysicsTimeline() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null)

  const events = [
    { year: -300, era: 'ancient', title: 'Аристотель', desc: 'Физика античности', detail: 'Основы механики и космологии', color: '#8B5CF6' },
    { year: -250, era: 'ancient', title: 'Архимед', desc: 'Закон рычага', detail: 'Eureka! Закон гидростатики', color: '#8B5CF6' },
    { year: 1543, era: 'renaissance', title: 'Коперник', desc: 'Гелиоцентризм', detail: 'Революция в астрономии', color: '#F59E0B' },
    { year: 1609, era: 'renaissance', title: 'Кеплер', desc: 'Законы планет', detail: 'Эллиптические орбиты планет', color: '#F59E0B' },
    { year: 1666, era: 'classical', title: 'Ньютон', desc: 'Классическая механика', detail: 'Законы движения, гравитация', color: '#EF4444' },
    { year: 1687, era: 'classical', title: 'Principia', desc: 'Математические начала', detail: 'Величайший труд Ньютона', color: '#EF4444' },
    { year: 1800, era: 'classical', title: 'Вольта', desc: 'Электрическая батарея', detail: 'Первый источник тока', color: '#3B82F6' },
    { year: 1820, era: 'classical', title: 'Эрстед', desc: 'Электромагнетизм', detail: 'Связь электричества и магнетизма', color: '#3B82F6' },
    { year: 1831, era: 'classical', title: 'Фарадей', desc: 'Электромагнитная индукция', detail: 'Основы электротехники', color: '#3B82F6' },
    { year: 1865, era: 'classical', title: 'Максвелл', desc: 'Уравнения Максвелла', detail: 'Теория электромагнетизма', color: '#3B82F6' },
    { year: 1887, era: 'modern', title: 'Михельсон', desc: 'Опыт Михельсона', detail: 'Постоянство скорости света', color: '#10B981' },
    { year: 1895, era: 'modern', title: 'Рентген', desc: 'Рентгеновские лучи', detail: 'Открытие ионизирующего излучения', color: '#10B981' },
    { year: 1896, era: 'modern', title: 'Беккерель', desc: 'Радиоактивность', detail: 'Явление самопроизвольного распада', color: '#10B981' },
    { year: 1897, era: 'modern', title: 'Томсон', desc: 'Открытие электрона', detail: 'Первая элементарная частица', color: '#10B981' },
    { year: 1900, era: 'quantum', title: 'Планк', desc: 'Квантовая гипотеза', detail: 'Рождение квантовой физики', color: '#EC4899' },
    { year: 1905, era: 'relativity', title: 'Эйнштейн', desc: 'Специальная относительность', detail: 'E = mc², 4 статьи за год чудес', color: '#F97316' },
    { year: 1911, era: 'quantum', title: 'Оннес', desc: 'Сверхпроводимость', detail: 'Нулевое сопротивление при низких T', color: '#EC4899' },
    { year: 1911, era: 'quantum', title: 'Резерфорд', desc: 'Ядерная модель атома', detail: 'Планетарная модель', color: '#EC4899' },
    { year: 1913, era: 'quantum', title: 'Бор', desc: 'Модель атома Бора', detail: 'Квантовые орбиты электронов', color: '#EC4899' },
    { year: 1915, era: 'relativity', title: 'Эйнштейн', desc: 'Общая относительность', detail: 'Искривление пространства-времени', color: '#F97316' },
    { year: 1924, era: 'quantum', title: 'де Бройль', desc: 'Волновой дуализм', detail: 'Волны материи λ = h/p', color: '#EC4899' },
    { year: 1925, era: 'quantum', title: 'Гейзенберг', desc: 'Матричная механика', detail: 'Принцип неопределённости', color: '#EC4899' },
    { year: 1926, era: 'quantum', title: 'Шрёдингер', desc: 'Волновое уравнение', detail: 'Уравнение Шрёдингера', color: '#EC4899' },
    { year: 1927, era: 'quantum', title: 'Леметр', desc: 'Большой взрыв', detail: 'Теория расширяющейся Вселенной', color: '#EC4899' },
    { year: 1928, era: 'quantum', title: 'Дирак', desc: 'Релятивистское уравнение', detail: 'Предсказание античастиц', color: '#EC4899' },
    { year: 1929, era: 'cosmology', title: 'Хаббл', desc: 'Расширение Вселенной', detail: 'Закон Хаббла: галактики разлетаются', color: '#A855F7' },
    { year: 1932, era: 'quantum', title: 'Чедвик', desc: 'Открытие нейтрона', detail: 'Структура ядра атома', color: '#EC4899' },
    { year: 1938, era: 'nuclear', title: 'Ган и Штрассман', desc: 'Деление ядра', detail: 'Основа ядерной энергетики', color: '#FBBF24' },
    { year: 1947, era: 'quantum', title: 'Лэмб', desc: 'Сдвиг Лэмба', detail: 'Квантовая электродинамика', color: '#EC4899' },
    { year: 1964, era: 'quantum', title: 'Гелл-Манн', desc: 'Кварки', detail: 'Стандартная модель зарождается', color: '#EC4899' },
    { year: 1965, era: 'cosmology', title: 'Пензиас и Вильсон', desc: 'Реликтовое излучение', detail: 'Доказательство Большого взрыва', color: '#A855F7' },
    { year: 1967, era: 'unified', title: 'Вайнберг', desc: 'Электрослабая теория', detail: 'Объединение сил природы', color: '#14B8A6' },
    { year: 1970, era: 'quantum', title: 'Стандартная модель', desc: 'Кварки и лептоны', detail: 'Современная теория частиц', color: '#EC4899' },
    { year: 1980, era: 'cosmology', title: 'Гут', desc: 'Инфляция', detail: 'Теория экспоненциального расширения', color: '#A855F7' },
    { year: 1998, era: 'cosmology', title: 'Тёмная энергия', desc: 'Ускорение расширения', detail: '70% Вселенной — тёмная энергия', color: '#A855F7' },
    { year: 2012, era: 'quantum', title: 'CERN', desc: 'Бозон Хиггса', detail: 'Последний элемент Стандартной модели', color: '#EC4899' },
    { year: 2015, era: 'relativity', title: 'LIGO', desc: 'Гравитационные волны', detail: 'Подтверждение общей относительности', color: '#F97316' },
    { year: 2019, era: 'cosmology', title: 'EHT', desc: 'Фото чёрной дыры', detail: 'M87* — первое изображение', color: '#A855F7' },
  ]

  const eras = [
    { id: 'ancient', name: 'Античность', range: '-300 — 0', color: '#8B5CF6' },
    { id: 'renaissance', name: 'Ренессанс', range: '1500 — 1600', color: '#F59E0B' },
    { id: 'classical', name: 'Классика', range: '1600 — 1900', color: '#3B82F6' },
    { id: 'modern', name: 'Современность', range: '1900 — 1930', color: '#10B981' },
    { id: 'quantum', name: 'Кванты', range: '1900 — 2020', color: '#EC4899' },
    { id: 'relativity', name: 'Относительность', range: '1905 — 2020', color: '#F97316' },
    { id: 'cosmology', name: 'Космология', range: '1920 — 2020', color: '#A855F7' },
    { id: 'nuclear', name: 'Ядерная физика', range: '1930 — 1950', color: '#FBBF24' },
    { id: 'unified', name: 'Великие теории', range: '1960 — 2020', color: '#14B8A6' },
  ]

  const filteredEvents = selectedEra ? events.filter(e => e.era === selectedEra) : events

  const yearToX = (year: number, width: number) => {
    const minYear = -300
    const maxYear = 2025
    return ((year - minYear) / (maxYear - minYear)) * width
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerY = height / 2

    let time = 0
    let scrollOffset = 0

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0a0a18')
      bgGradient.addColorStop(1, '#151530')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Draw timeline line
      const lineY = centerY
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, '#8B5CF6')
      gradient.addColorStop(0.25, '#3B82F6')
      gradient.addColorStop(0.5, '#10B981')
      gradient.addColorStop(0.75, '#EC4899')
      gradient.addColorStop(1, '#F97316')
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(width, lineY)
      ctx.stroke()

      // Draw era markers
      eras.forEach((era, i) => {
        ctx.fillStyle = era.color + '40'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(era.name, 10, 15 + i * 12)
      })

      // Draw events
      filteredEvents.forEach((event, i) => {
        const x = yearToX(event.year, width)
        const y = lineY + (i % 2 === 0 ? -30 : 30)
        const isHovered = hoveredEvent === i

        // Event marker
        const radius = isHovered ? 8 : 5
        const glow = ctx.createRadialGradient(x, lineY, 0, x, lineY, radius * 3)
        glow.addColorStop(0, event.color)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, lineY, radius * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = event.color
        ctx.beginPath()
        ctx.arc(x, lineY, radius, 0, Math.PI * 2)
        ctx.fill()

        // Connection line
        ctx.strokeStyle = event.color + '80'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, lineY)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Label
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#AAAAAA'
        ctx.font = `${isHovered ? 'bold ' : ''}9px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(event.year.toString(), x, y + (i % 2 === 0 ? -8 : 15))
        ctx.fillText(event.title, x, y + (i % 2 === 0 ? -18 : 25))

        // Detail on hover
        if (isHovered) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
          ctx.fillRect(x - 60, lineY + 50, 120, 35)
          ctx.strokeStyle = event.color
          ctx.lineWidth = 1
          ctx.strokeRect(x - 60, lineY + 50, 120, 35)
          
          ctx.fillStyle = event.color
          ctx.font = 'bold 10px sans-serif'
          ctx.fillText(event.desc, x, lineY + 65)
          ctx.fillStyle = '#AAAAAA'
          ctx.font = '8px sans-serif'
          ctx.fillText(event.detail, x, lineY + 78)
        }
      })

      // Year labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'center'
      for (let year = -300; year <= 2025; year += 200) {
        const x = yearToX(year, width)
        ctx.fillText(year.toString(), x, height - 5)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [filteredEvents, hoveredEvent])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg cursor-pointer" />
      
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setSelectedEra(null)}
          variant={selectedEra === null ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${selectedEra === null ? 'bg-purple-600' : ''}`}
        >
          Все эпохи
        </Button>
        {eras.slice(2, 7).map((era) => (
          <Button
            key={era.id}
            onClick={() => setSelectedEra(selectedEra === era.id ? null : era.id)}
            variant={selectedEra === era.id ? 'default' : 'outline'}
            size="sm"
            className={`text-xs ${selectedEra === era.id ? '' : ''}`}
            style={{ borderColor: era.color + '80', color: selectedEra === era.id ? 'white' : era.color }}
          >
            {era.name}
          </Button>
        ))}
      </div>

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">📅 История физики</div>
        <p className="text-gray-400 mt-1">
          От Архимеда до Хокинга — более 2300 лет открытий. Каждая эпоха приносила революционные идеи, 
          менявшие наше понимание Вселенной.
        </p>
      </div>
    </div>
  )
}

// ==================== SOLAR SYSTEM ====================
function SolarSystemVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [speed, setSpeed] = useState(1)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  // Planet data (relative to Earth)
  const planets = [
    { name: 'Меркурий', nameEn: 'Mercury', distance: 0.39, period: 0.24, radius: 0.38, color: '#B5B5B5', moons: 0 },
    { name: 'Венера', nameEn: 'Venus', distance: 0.72, period: 0.62, radius: 0.95, color: '#E6C229', moons: 0 },
    { name: 'Земля', nameEn: 'Earth', distance: 1.0, period: 1.0, radius: 1.0, color: '#6B93D6', moons: 1 },
    { name: 'Марс', nameEn: 'Mars', distance: 1.52, period: 1.88, radius: 0.53, color: '#C1440E', moons: 2 },
    { name: 'Юпитер', nameEn: 'Jupiter', distance: 2.2, period: 11.86, radius: 2.5, color: '#D8CA9D', moons: 95 },
    { name: 'Сатурн', nameEn: 'Saturn', distance: 2.8, period: 29.46, radius: 2.2, color: '#F4D59E', moons: 146, rings: true },
    { name: 'Уран', nameEn: 'Uranus', distance: 3.3, period: 84.01, radius: 1.6, color: '#D1E7E7', moons: 28 },
    { name: 'Нептун', nameEn: 'Neptune', distance: 3.7, period: 164.8, radius: 1.5, color: '#5B5DDF', moons: 16 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    let time = 0

    const animate = () => {
      time += 0.01 * speed
      ctx.clearRect(0, 0, width, height)

      // Background - space
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2)
      bgGradient.addColorStop(0, '#0a0a20')
      bgGradient.addColorStop(1, '#000005')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * width
        const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * height
        const size = (Math.sin(time + i) * 0.5 + 0.5) * 1.5 + 0.5
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      const baseOrbitRadius = 25 * zoom

      // Draw orbits
      if (showOrbits) {
        planets.forEach((planet) => {
          const orbitRadius = baseOrbitRadius + planet.distance * 35 * zoom
          ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)'
          ctx.lineWidth = 1
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        })
      }

      // Draw Sun
      const sunRadius = 15 * zoom
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius * 3)
      sunGlow.addColorStop(0, '#FFD700')
      sunGlow.addColorStop(0.3, '#FFA500')
      sunGlow.addColorStop(0.6, 'rgba(255, 100, 0, 0.3)')
      sunGlow.addColorStop(1, 'rgba(255, 50, 0, 0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Sun core
      const sunCore = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, sunRadius)
      sunCore.addColorStop(0, '#FFFACD')
      sunCore.addColorStop(0.5, '#FFD700')
      sunCore.addColorStop(1, '#FFA500')
      ctx.fillStyle = sunCore
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Sun corona animation
      for (let i = 0; i < 12; i++) {
        const angle = (time * 0.5 + i * Math.PI / 6)
        const len = sunRadius + Math.sin(time * 3 + i * 2) * 5 + 5
        ctx.strokeStyle = `rgba(255, 200, 0, ${0.3 + Math.sin(time * 2 + i) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * sunRadius, centerY + Math.sin(angle) * sunRadius)
        ctx.lineTo(centerX + Math.cos(angle) * len, centerY + Math.sin(angle) * len)
        ctx.stroke()
      }

      // Draw planets
      planets.forEach((planet) => {
        const orbitRadius = baseOrbitRadius + planet.distance * 35 * zoom
        const angle = time / planet.period
        const x = centerX + Math.cos(angle) * orbitRadius
        const y = centerY + Math.sin(angle) * orbitRadius
        const planetRadius = Math.max(3, planet.radius * 4 * zoom)

        // Planet glow when selected
        if (selectedPlanet === planet.nameEn) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, planetRadius * 3)
          glow.addColorStop(0, planet.color + 'AA')
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, planetRadius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Saturn's rings
        if (planet.rings) {
          ctx.strokeStyle = 'rgba(244, 213, 158, 0.6)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.ellipse(x, y, planetRadius * 2, planetRadius * 0.5, Math.PI / 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Planet body
        const planetGradient = ctx.createRadialGradient(x - planetRadius * 0.3, y - planetRadius * 0.3, 0, x, y, planetRadius)
        planetGradient.addColorStop(0, planet.color)
        planetGradient.addColorStop(1, '#333')
        ctx.fillStyle = planetGradient
        ctx.beginPath()
        ctx.arc(x, y, planetRadius, 0, Math.PI * 2)
        ctx.fill()

        // Moon for Earth
        if (planet.nameEn === 'Earth') {
          const moonAngle = time * 12
          const moonX = x + Math.cos(moonAngle) * (planetRadius + 8)
          const moonY = y + Math.sin(moonAngle) * (planetRadius + 8)
          ctx.fillStyle = '#AAAAAA'
          ctx.beginPath()
          ctx.arc(moonX, moonY, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Planet label
        if (showLabels) {
          ctx.fillStyle = selectedPlanet === planet.nameEn ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'
          ctx.font = `${selectedPlanet === planet.nameEn ? 'bold ' : ''}9px sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(planet.name, x, y - planetRadius - 5)
        }
      })

      // Info panel for selected planet
      if (selectedPlanet) {
        const planet = planets.find(p => p.nameEn === selectedPlanet)
        if (planet) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.fillRect(10, height - 65, 130, 55)
          ctx.strokeStyle = planet.color
          ctx.lineWidth = 1
          ctx.strokeRect(10, height - 65, 130, 55)

          ctx.fillStyle = planet.color
          ctx.font = 'bold 11px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(planet.name, 15, height - 50)

          ctx.fillStyle = '#AAAAAA'
          ctx.font = '9px sans-serif'
          ctx.fillText(`Орбита: ${planet.distance} а.е.`, 15, height - 35)
          ctx.fillText(`Период: ${planet.period} года`, 15, height - 22)
          ctx.fillText(`Спутники: ${planet.moons}`, 15, height - 9)
        }
      }

      // Scale indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('Масштаб не сохранён', width - 10, height - 5)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [speed, showOrbits, showLabels, selectedPlanet, zoom])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg cursor-pointer" />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-yellow-400">Скорость</span>
            <span className="text-white font-mono">{speed.toFixed(1)}x</span>
          </div>
          <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} min={0.1} max={5} step={0.1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Масштаб</span>
            <span className="text-white font-mono">{zoom.toFixed(1)}x</span>
          </div>
          <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} min={0.5} max={2} step={0.1} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={() => setShowOrbits(!showOrbits)} 
          variant={showOrbits ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${showOrbits ? 'bg-blue-600' : ''}`}
        >
          🔵 Орбиты
        </Button>
        <Button 
          onClick={() => setShowLabels(!showLabels)} 
          variant={showLabels ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${showLabels ? 'bg-purple-600' : ''}`}
        >
          🏷️ Названия
        </Button>
        {planets.slice(0, 4).map((planet) => (
          <Button
            key={planet.nameEn}
            onClick={() => setSelectedPlanet(selectedPlanet === planet.nameEn ? null : planet.nameEn)}
            variant={selectedPlanet === planet.nameEn ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            style={{ borderColor: planet.color, color: selectedPlanet === planet.nameEn ? 'white' : planet.color }}
          >
            {planet.name}
          </Button>
        ))}
      </div>

      <div className="bg-yellow-900/20 rounded-lg p-2 border border-yellow-500/20 text-xs">
        <div className="text-yellow-300 font-semibold">🌍 Солнечная система</div>
        <p className="text-gray-400 mt-1">
          8 планет обращаются вокруг Солнца. Внутренние — каменистые (Меркурий, Венера, Земля, Марс), 
          внешние — газовые гиганты (Юпитер, Сатурн, Уран, Нептун).
        </p>
        <p className="text-cyan-400 mt-1">
          Период обращения Земли = 1 год. Нептун делает оборот за ~165 лет!
        </p>
      </div>
    </div>
  )
}

// ==================== COSMIC MICROWAVE BACKGROUND ====================
function CMBVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [temperature, setTemperature] = useState(2.725) // Current CMB temperature in K
  const [showGalaxies, setShowGalaxies] = useState(true)
  const [timeScale, setTimeScale] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Generate CMB-like noise pattern
    const generateCMBNoise = (x: number, y: number, time: number): number => {
      const scale = 0.05
      let noise = 0
      noise += Math.sin(x * scale + time * 0.1) * Math.cos(y * scale)
      noise += Math.sin((x + y) * scale * 0.7 + time * 0.15) * 0.5
      noise += Math.cos(x * scale * 1.3 - y * scale * 0.8 + time * 0.05) * 0.3
      noise += Math.sin((x - y) * scale * 2.1 + time * 0.2) * 0.2
      return (noise + 1) / 2 // Normalize to 0-1
    }

    let time = 0

    const animate = () => {
      time += 0.01 * timeScale
      ctx.clearRect(0, 0, width, height)

      // Draw CMB temperature map
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const noise = generateCMBNoise(x, y, time)
          
          // Temperature fluctuation (±0.0001 K around 2.725 K)
          const tempFluctuation = (noise - 0.5) * 0.0002
          const localTemp = temperature + tempFluctuation

          // Color mapping: blue (cold) -> white -> red (hot)
          let r, g, b
          if (noise < 0.5) {
            // Cold regions - blue
            const t = noise * 2
            r = Math.floor(t * 100)
            g = Math.floor(t * 150 + 50)
            b = Math.floor(200 + t * 55)
          } else {
            // Hot regions - red/yellow
            const t = (noise - 0.5) * 2
            r = Math.floor(200 + t * 55)
            g = Math.floor(150 - t * 50)
            b = Math.floor(200 - t * 150)
          }

          const idx = (y * width + x) * 4
          data[idx] = r
          data[idx + 1] = g
          data[idx + 2] = b
          data[idx + 3] = 255
        }
      }
      ctx.putImageData(imageData, 0, 0)

      // Draw galaxy formations overlay
      if (showGalaxies) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2 + time * 0.1
          const radius = 50 + Math.sin(i * 3 + time) * 30
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          
          ctx.beginPath()
          ctx.arc(x, y, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Temperature scale
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(width - 35, 20, 25, 150)
      
      const gradient = ctx.createLinearGradient(0, 20, 0, 170)
      gradient.addColorStop(0, '#FF6666')
      gradient.addColorStop(0.5, '#FFFFFF')
      gradient.addColorStop(1, '#6666FF')
      ctx.fillStyle = gradient
      ctx.fillRect(width - 32, 22, 19, 146)

      ctx.fillStyle = '#FFF'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('+0.1mK', width - 55, 28)
      ctx.fillText('0', width - 55, 95)
      ctx.fillText('-0.1mK', width - 55, 168)

      // Info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(5, height - 55, 180, 50)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('🌡️ T = ' + temperature.toFixed(3) + ' K', 10, height - 40)
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#AAAAAA'
      ctx.fillText('Возраст: ~380 000 лет после БВ', 10, height - 25)
      ctx.fillText('ΔT/T ≈ 10⁻⁵ (флуктуации)', 10, height - 12)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [temperature, showGalaxies, timeScale])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-red-400">T (K)</span>
            <span className="text-white font-mono">{temperature.toFixed(3)}</span>
          </div>
          <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={2.7} max={3.0} step={0.001} />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowGalaxies(!showGalaxies)} 
            variant={showGalaxies ? 'default' : 'outline'}
            size="sm"
            className="flex-1 text-xs"
          >
            🌌 Галактики
          </Button>
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20 text-xs">
        <div className="text-blue-300 font-semibold mb-1">🌡️ Реликтовое излучение (CMB)</div>
        <p className="text-gray-400">
          Космический микроволновый фон — это свет, испущенный ~380 000 лет после Большого взрыва, 
          когда Вселенная стала прозрачной. Температура 2.725 K с флуктуациями ~10⁻⁵.
        </p>
        <p className="text-cyan-400 mt-1">
          Изучено спутниками COBE, WMAP, Planck — подтверждает теорию Большого взрыва!
        </p>
      </div>
    </div>
  )
}

// ==================== DARK ENERGY VISUALIZATION ====================
function DarkEnergyVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [expansionRate, setExpansionRate] = useState(0.7) // Hubble parameter visualization
  const [darkEnergyFraction, setDarkEnergyFraction] = useState(68) // % of universe
  const [showMatter, setShowMatter] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvasContext(canvas, ctx)
    }
    resize()
    window.addEventListener('resize', resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Galaxy positions
    const galaxies: { angle: number; distance: number; size: number; color: string }[] = []
    for (let i = 0; i < 50; i++) {
      galaxies.push({
        angle: Math.random() * Math.PI * 2,
        distance: 20 + Math.random() * 100,
        size: 1 + Math.random() * 2,
        color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`
      })
    }

    let time = 0

    const animate = () => {
      time += 0.016 * expansionRate
      ctx.clearRect(0, 0, width, height)

      // Background - expanding space gradient
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2)
      bgGradient.addColorStop(0, '#0a0020')
      bgGradient.addColorStop(0.5, '#050015')
      bgGradient.addColorStop(1, '#000005')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Dark energy field visualization
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 20; i++) {
        const radius = (time * 50 + i * 20) % (width / 2)
        const alpha = 1 - radius / (width / 2)
        ctx.strokeStyle = `rgba(138, 43, 226, ${alpha * 0.3})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Draw galaxies accelerating outward
      galaxies.forEach((galaxy) => {
        // Accelerating expansion - distance grows faster over time
        const acceleratedDistance = galaxy.distance * (1 + time * 0.1 * (darkEnergyFraction / 50))
        const x = centerX + Math.cos(galaxy.angle) * acceleratedDistance
        const y = centerY + Math.sin(galaxy.angle) * acceleratedDistance

        // Galaxy glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, galaxy.size * 3)
        glow.addColorStop(0, galaxy.color)
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, galaxy.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Galaxy core
        ctx.fillStyle = galaxy.color
        ctx.beginPath()
        ctx.arc(x, y, galaxy.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Matter density visualization (if enabled)
      if (showMatter) {
        ctx.fillStyle = 'rgba(255, 200, 100, 0.1)'
        for (let i = 0; i < 10; i++) {
          const x = centerX + Math.cos(time * 0.5 + i) * (30 + i * 10)
          const y = centerY + Math.sin(time * 0.5 + i * 1.3) * (30 + i * 10)
          ctx.beginPath()
          ctx.arc(x, y, 5 + Math.sin(time + i) * 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Central marker (observer)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX - 5, centerY)
      ctx.lineTo(centerX + 5, centerY)
      ctx.moveTo(centerX, centerY - 5)
      ctx.lineTo(centerX, centerY + 5)
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Наблюдатель', centerX, centerY + 20)

      // Universe composition pie chart (mini)
      const pieX = 60
      const pieY = 50
      const pieR = 30
      
      // Dark energy
      ctx.fillStyle = '#8B00FF'
      ctx.beginPath()
      ctx.moveTo(pieX, pieY)
      ctx.arc(pieX, pieY, pieR, -Math.PI / 2, -Math.PI / 2 + (darkEnergyFraction / 100) * Math.PI * 2)
      ctx.closePath()
      ctx.fill()

      // Dark matter
      ctx.fillStyle = '#4B0082'
      ctx.beginPath()
      ctx.moveTo(pieX, pieY)
      ctx.arc(pieX, pieY, pieR, -Math.PI / 2 + (darkEnergyFraction / 100) * Math.PI * 2, -Math.PI / 2 + 0.95 * Math.PI * 2)
      ctx.closePath()
      ctx.fill()

      // Normal matter
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(pieX, pieY)
      ctx.arc(pieX, pieY, pieR, -Math.PI / 2 + 0.95 * Math.PI * 2, -Math.PI / 2 + Math.PI * 2)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#FFF'
      ctx.font = '7px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Ω_Λ = ${darkEnergyFraction}%`, 95, 40)
      ctx.fillText('Ω_dm = 27%', 95, 52)
      ctx.fillText('Ω_m = 5%', 95, 64)

      // Info panel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(width - 130, height - 45, 125, 40)
      ctx.fillStyle = '#AAAAAA'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`H₀ ≈ 70 км/с/Мпк`, width - 125, height - 30)
      ctx.fillText(`Ускорение: +${(expansionRate * 100).toFixed(0)}%`, width - 125, height - 18)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [expansionRate, darkEnergyFraction, showMatter])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="w-full h-56 rounded-lg" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">Тёмная энергия %</span>
            <span className="text-white font-mono">{darkEnergyFraction}%</span>
          </div>
          <Slider value={[darkEnergyFraction]} onValueChange={(v) => setDarkEnergyFraction(v[0])} min={50} max={80} step={1} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Расширение H</span>
            <span className="text-white font-mono">{expansionRate.toFixed(1)}</span>
          </div>
          <Slider value={[expansionRate]} onValueChange={(v) => setExpansionRate(v[0])} min={0.1} max={2} step={0.1} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={() => setShowMatter(!showMatter)} 
          variant={showMatter ? 'default' : 'outline'}
          size="sm"
          className="text-xs"
        >
          🌟 Материя
        </Button>
      </div>

      <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold mb-1">💫 Тёмная энергия</div>
        <p className="text-gray-400">
          Загадочная сила, составляющая ~68% Вселенной и вызывающая ускоренное расширение.
          Открыта в 1998 г. (Нобелевская премия 2011). Природа неизвестна — возможно, 
          энергия вакуума или модификация гравитации.
        </p>
        <p className="text-cyan-400 mt-1">
          Без неё галактики разбегались бы медленнее!
        </p>
      </div>
    </div>
  )
}

// ==================== PHYSICS QUIZ ====================
function PhysicsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('physics-lang') as Language
      return saved || 'ru'
    }
    return 'ru'
  })

  const questions = {
    ru: [
      {
        question: 'Чему равна скорость света в вакууме?',
        options: ['3×10⁶ м/с', '3×10⁸ м/с', '3×10¹⁰ м/с', '3×10⁵ м/с'],
        correct: 1,
        explanation: 'Скорость света c ≈ 299 792 458 м/с ≈ 3×10⁸ м/с'
      },
      {
        question: 'Какая частица является переносчиком электромагнитного взаимодействия?',
        options: ['Глюон', 'Фотон', 'W-бозон', 'Гравитон'],
        correct: 1,
        explanation: 'Фотон — квант электромагнитного поля, переносчик электромагнитного взаимодействия.'
      },
      {
        question: 'Что описывает уравнение Шрёдингера?',
        options: ['Движение планет', 'Эволюцию квантового состояния', 'Распад радиоактивных ядер', 'Течение жидкости'],
        correct: 1,
        explanation: 'Уравнение Шрёдингера описывает изменение волновой функции квантовой системы во времени.'
      },
      {
        question: 'Каков период полураспада определяется законом?',
        options: ['T₁/₂ = τ·ln(2)', 'T₁/₂ = τ/ln(2)', 'T₁/₂ = ln(2)/τ', 'T₁/₂ = 1/τ'],
        correct: 0,
        explanation: 'Период полураспада связан со временем жизни τ: T₁/₂ = τ·ln(2) ≈ 0.693τ'
      },
      {
        question: 'Что происходит с массой объекта при приближении к скорости света?',
        options: ['Уменьшается', 'Не изменяется', 'Увеличивается', 'Становится отрицательной'],
        correct: 2,
        explanation: 'Согласно СТО, релятивистская масса m = γm₀ увеличивается при приближении к c.'
      },
      {
        question: 'Какой принцип сформулировал Гейзенберг?',
        options: ['Принцип относительности', 'Принцип неопределённости', 'Принцип дополнительности', 'Принцип суперпозиции'],
        correct: 1,
        explanation: 'Принцип неопределённости: Δx·Δp ≥ ℏ/2'
      },
      {
        question: 'Что такое сингулярность чёрной дыры?',
        options: ['Область низкой плотности', 'Точка бесконечной плотности', 'Горизонт событий', 'Аккреционный диск'],
        correct: 1,
        explanation: 'Сингулярность — точка, где плотность и кривизна пространства-времени стремятся к бесконечности.'
      },
      {
        question: 'Какая сила доминирует во Вселенной на больших масштабах?',
        options: ['Электромагнитная', 'Сильная ядерная', 'Слабая ядерная', 'Гравитационная'],
        correct: 3,
        explanation: 'Гравитация — единственная сила, действующая на бесконечных расстояниях, доминирует в космосе.'
      },
      {
        question: 'Каков возраст Вселенной согласно современным оценкам?',
        options: ['4.5 млрд лет', '10 млрд лет', '13.8 млрд лет', '20 млрд лет'],
        correct: 2,
        explanation: 'Возраст Вселенной ~13.8 млрд лет, определён по данным спутника Planck.'
      },
      {
        question: 'Что такое бозон Хиггса?',
        options: ['Переносчик гравитации', 'Частица, дающая массу', 'Разновидность кварка', 'Тип излучения'],
        correct: 1,
        explanation: 'Бозон Хиггса — квант поля Хиггса, взаимодействие с которым придаёт частицам массу.'
      }
    ],
    en: [
      {
        question: 'What is the speed of light in vacuum?',
        options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁵ m/s'],
        correct: 1,
        explanation: 'Speed of light c ≈ 299,792,458 m/s ≈ 3×10⁸ m/s'
      },
      {
        question: 'Which particle carries the electromagnetic interaction?',
        options: ['Gluon', 'Photon', 'W-boson', 'Graviton'],
        correct: 1,
        explanation: 'Photon is the quantum of the electromagnetic field, carrier of electromagnetic interaction.'
      },
      {
        question: 'What does the Schrödinger equation describe?',
        options: ['Planetary motion', 'Quantum state evolution', 'Radioactive decay', 'Fluid flow'],
        correct: 1,
        explanation: 'The Schrödinger equation describes how the wave function of a quantum system changes over time.'
      },
      {
        question: 'What happens to mass as an object approaches the speed of light?',
        options: ['Decreases', 'Remains unchanged', 'Increases', 'Becomes negative'],
        correct: 2,
        explanation: 'According to special relativity, relativistic mass m = γm₀ increases as v approaches c.'
      },
      {
        question: 'What principle did Heisenberg formulate?',
        options: ['Principle of relativity', 'Uncertainty principle', 'Complementarity principle', 'Superposition principle'],
        correct: 1,
        explanation: 'Uncertainty principle: Δx·Δp ≥ ℏ/2'
      }
    ],
    zh: [
      {
        question: '真空中的光速是多少？',
        options: ['3×10⁶ 米/秒', '3×10⁸ 米/秒', '3×10¹⁰ 米/秒', '3×10⁵ 米/秒'],
        correct: 1,
        explanation: '光速 c ≈ 299,792,458 米/秒 ≈ 3×10⁸ 米/秒'
      },
      {
        question: '哪种粒子传递电磁相互作用？',
        options: ['胶子', '光子', 'W玻色子', '引力子'],
        correct: 1,
        explanation: '光子是电磁场的量子，是电磁相互作用的传递者。'
      },
      {
        question: '薛定谔方程描述什么？',
        options: ['行星运动', '量子态演化', '放射性衰变', '流体流动'],
        correct: 1,
        explanation: '薛定谔方程描述量子系统的波函数如何随时间变化。'
      },
      {
        question: '当物体接近光速时，质量会发生什么变化？',
        options: ['减小', '保持不变', '增加', '变为负数'],
        correct: 2,
        explanation: '根据狭义相对论，相对论质量 m = γm₀ 随着速度接近光速而增加。'
      },
      {
        question: '海森堡提出了什么原理？',
        options: ['相对性原理', '不确定性原理', '互补原理', '叠加原理'],
        correct: 1,
        explanation: '不确定性原理：Δx·Δp ≥ ℏ/2'
      }
    ],
    he: [
      {
        question: 'מהי מהירות האור בריק?',
        options: ['3×10⁶ מ/ש', '3×10⁸ מ/ש', '3×10¹⁰ מ/ש', '3×10⁵ מ/ש'],
        correct: 1,
        explanation: 'מהירות האור c ≈ 299,792,458 מ/ש ≈ 3×10⁸ מ/ש'
      },
      {
        question: 'איזו חלקיק נושא את האינטראקציה האלקטרומגנטית?',
        options: ['גלואון', 'פוטון', 'בוזון W', 'גרביטון'],
        correct: 1,
        explanation: 'פוטון הוא קוונטום של השדה האלקטרומגנטי.'
      }
    ]
  }

  const currentQuestions = questions[language] || questions.ru
  const q = currentQuestions[currentQuestion]

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === q.correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const resultText = {
    ru: { score: 'Ваш результат', of: 'из', restart: 'Начать заново', next: 'Далее', correct: 'Правильно!', incorrect: 'Неправильно' },
    en: { score: 'Your score', of: 'of', restart: 'Restart', next: 'Next', correct: 'Correct!', incorrect: 'Incorrect' },
    zh: { score: '您的得分', of: '共', restart: '重新开始', next: '下一题', correct: '正确！', incorrect: '错误' },
    he: { score: 'הציון שלך', of: 'מתוך', restart: 'התחל מחדש', next: 'הבא', correct: 'נכון!', incorrect: 'לא נכון' }
  }

  const text = resultText[language] || resultText.ru

  if (showResult) {
    const percentage = Math.round((score / currentQuestions.length) * 100)
    return (
      <div className="space-y-4 text-center">
        <div className="text-4xl font-bold text-purple-400">{text.score}</div>
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
          {score} {text.of} {currentQuestions.length}
        </div>
        <div className="text-2xl">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : percentage >= 40 ? '📚' : '💪'}
        </div>
        <div className={`text-sm ${percentage >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
          {percentage >= 80 ? (language === 'ru' ? 'Отлично!' : language === 'en' ? 'Excellent!' : language === 'zh' ? '太棒了！' : 'מעולה!') :
           percentage >= 60 ? (language === 'ru' ? 'Хорошо!' : language === 'en' ? 'Good!' : language === 'zh' ? '不错！' : 'טוב!') :
           (language === 'ru' ? 'Попробуйте ещё!' : language === 'en' ? 'Try again!' : language === 'zh' ? '再试一次！' : 'נסה שוב!')}
        </div>
        <Button onClick={restartQuiz} className="bg-gradient-to-r from-purple-600 to-cyan-600">
          {text.restart}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-purple-400">
          {language === 'ru' ? 'Вопрос' : language === 'en' ? 'Question' : language === 'zh' ? '问题' : 'שאלה'} {currentQuestion + 1}/{currentQuestions.length}
        </span>
        <span className="text-green-400">
          {language === 'ru' ? 'Счёт' : language === 'en' ? 'Score' : language === 'zh' ? '得分' : 'ציון'}: {score}
        </span>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-4 border border-purple-500/30">
        <div className="text-white font-medium mb-4">{q.question}</div>
        
        <div className="space-y-2">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                answered
                  ? index === q.correct
                    ? 'bg-green-600/50 border-2 border-green-400'
                    : index === selectedAnswer
                    ? 'bg-red-600/50 border-2 border-red-400'
                    : 'bg-gray-800/50 opacity-50'
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-purple-500'
              }`}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {answered && (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg text-sm ${selectedAnswer === q.correct ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
            <div className={selectedAnswer === q.correct ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
              {selectedAnswer === q.correct ? text.correct : text.incorrect}
            </div>
            <div className="text-gray-400 mt-1">{q.explanation}</div>
          </div>
          
          <Button onClick={nextQuestion} className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
            {text.next} →
          </Button>
        </div>
      )}
    </div>
  )
}

// ==================== SCIENTISTS BIOGRAPHIES ====================
function ScientistsBiographies() {
  const [selectedScientist, setSelectedScientist] = useState<number | null>(null)
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('physics-lang') as Language
      if (saved && ['ru', 'en', 'zh', 'he'].includes(saved)) {
        return saved
      }
    }
    return 'ru'
  })

  const scientists = {
    ru: [
      {
        name: 'Альберт Эйнштейн',
        years: '1879-1955',
        field: 'Теоретическая физика',
        achievement: 'Теория относительности, E=mc²',
        nobel: '1921 — Фотоэффект',
        quote: '"Воображение важнее знания. Знание ограничено, воображение охватывает весь мир."',
        bio: 'Разработал специальную и общую теорию относительности, объяснил броуновское движение и фотоэффект. Его уравнение E=mc² стало символом взаимосвязи массы и энергии.',
        color: '#FFD700'
      },
      {
        name: 'Нильс Бор',
        years: '1885-1962',
        field: 'Квантовая физика',
        achievement: 'Модель атома, принцип дополнительности',
        nobel: '1922 — Строение атома',
        quote: '"Противоположности не противоречивы, а взаимодополняемы."',
        bio: 'Создал квантовую модель атома, объяснил структуру электронных оболочек. Основатель Копенгагенской интерпретации квантовой механики.',
        color: '#4169E1'
      },
      {
        name: 'Ричард Фейнман',
        years: '1918-1988',
        field: 'Квантовая электродинамика',
        achievement: 'Диаграммы Фейнмана, путь интегралов',
        nobel: '1965 — Квантовая электродинамика',
        quote: '"Если вы думаете, что понимаете квантовую механику, то вы не понимаете квантовую механику."',
        bio: 'Разработал формулировку квантовой механики через интегралы по путям. Известен своими лекциями по физике и участием в расследовании катастрофы "Челленджера".',
        color: '#32CD32'
      },
      {
        name: 'Макс Планк',
        years: '1858-1947',
        field: 'Квантовая физика',
        achievement: 'Квантовая гипотеза, постоянная Планка',
        nobel: '1918 — Открытие квантов',
        quote: '"Наука не может решить тайну последней природы. И то, что она не может сделать это, не означает, что наука не добилась успеха."',
        bio: 'Отец квантовой физики. Ввёл понятие кванта энергии для объяснения спектра излучения чёрного тела. Его постоянная h — фундаментальная константа природы.',
        color: '#9370DB'
      },
      {
        name: 'Эрвин Шрёдингер',
        years: '1887-1961',
        field: 'Квантовая физика',
        achievement: 'Уравнение Шрёдингера, кот Шрёдингера',
        nobel: '1933 — Волновая механика',
        quote: '"Я не люблю её, и мне жаль, что я когда-либо имел к ней отношение." (о квантовой механике)',
        bio: 'Создал волновую механику — математический аппарат квантовой теории. Знаменит мысленным экспериментом с котом, иллюстрирующим парадоксы суперпозиции.',
        color: '#DC143C'
      },
      {
        name: 'Вернер Гейзенберг',
        years: '1901-1976',
        field: 'Квантовая механика',
        achievement: 'Принцип неопределённости, матричная механика',
        nobel: '1932 — Квантовая механика',
        quote: '"Первый глоток из кубка естественных наук делает атеистом, но на дне кубка вас ждёт Бог."',
        bio: 'Сформулировал принцип неопределённости — фундаментальное ограничение точности измерений. Создал матричную формулировку квантовой механики.',
        color: '#FF6347'
      },
      {
        name: 'Стивен Хокинг',
        years: '1942-2018',
        field: 'Космология',
        achievement: 'Излучение Хокинга, сингулярности',
        nobel: '— (многие считают это упущением)',
        quote: '"Смотри на звёзды, а не под ноги. Пытайся понять то, что видишь."',
        bio: 'Доказал существование излучения чёрных дыр. Написал "Краткую историю времени", сделав космологию доступной широкой публике. Болезнь ALS не помешала его научной работе.',
        color: '#00CED1'
      },
      {
        name: 'Мария Кюри',
        years: '1867-1934',
        field: 'Радиоактивность',
        achievement: 'Открытие полония и радия',
        nobel: '1903 (физика) и 1911 (химия)',
        quote: '"Ничего в жизни не надо бояться, надо только понимать."',
        bio: 'Первая женщина — лауреат Нобелевской премии, единственный учёный, получивший Нобелевскую премию в двух разных науках. Пионер исследований радиоактивности.',
        color: '#FF69B4'
      }
    ],
    en: [
      {
        name: 'Albert Einstein',
        years: '1879-1955',
        field: 'Theoretical Physics',
        achievement: 'Theory of Relativity, E=mc²',
        nobel: '1921 — Photoelectric effect',
        quote: '"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."',
        bio: 'Developed special and general relativity, explained Brownian motion and the photoelectric effect. His equation E=mc² became a symbol of mass-energy equivalence.',
        color: '#FFD700'
      },
      {
        name: 'Niels Bohr',
        years: '1885-1962',
        field: 'Quantum Physics',
        achievement: 'Atomic model, complementarity principle',
        nobel: '1922 — Atomic structure',
        quote: '"Opposites are not contradictory, they are complementary."',
        bio: 'Created the quantum model of the atom, explained the structure of electron shells. Founder of the Copenhagen interpretation of quantum mechanics.',
        color: '#4169E1'
      },
      {
        name: 'Richard Feynman',
        years: '1918-1988',
        field: 'Quantum Electrodynamics',
        achievement: 'Feynman diagrams, path integrals',
        nobel: '1965 — Quantum electrodynamics',
        quote: '"If you think you understand quantum mechanics, you don\'t understand quantum mechanics."',
        bio: 'Developed the path integral formulation of quantum mechanics. Known for his physics lectures and participation in the Challenger disaster investigation.',
        color: '#32CD32'
      },
      {
        name: 'Stephen Hawking',
        years: '1942-2018',
        field: 'Cosmology',
        achievement: 'Hawking radiation, singularities',
        nobel: '— (many consider this an oversight)',
        quote: '"Look up at the stars, not down at your feet. Try to make sense of what you see."',
        bio: 'Proved the existence of black hole radiation. Wrote "A Brief History of Time," making cosmology accessible to the public. ALS disease did not stop his scientific work.',
        color: '#00CED1'
      },
      {
        name: 'Marie Curie',
        years: '1867-1934',
        field: 'Radioactivity',
        achievement: 'Discovery of polonium and radium',
        nobel: '1903 (physics) and 1911 (chemistry)',
        quote: '"Nothing in life is to be feared, it is only to be understood."',
        bio: 'First woman to win a Nobel Prize, only scientist to win Nobel Prizes in two different sciences. Pioneer of radioactivity research.',
        color: '#FF69B4'
      }
    ],
    zh: [
      {
        name: '阿尔伯特·爱因斯坦',
        years: '1879-1955',
        field: '理论物理',
        achievement: '相对论，E=mc²',
        nobel: '1921 — 光电效应',
        quote: '"想象力比知识更重要。知识是有限的，想象力环绕整个世界。"',
        bio: '发展了狭义和广义相对论，解释了布朗运动和光电效应。他的方程E=mc²成为质能等价的象征。',
        color: '#FFD700'
      },
      {
        name: '尼尔斯·玻尔',
        years: '1885-1962',
        field: '量子物理',
        achievement: '原子模型，互补原理',
        nobel: '1922 — 原子结构',
        quote: '"对立面并不矛盾，而是互补的。"',
        bio: '创建了原子的量子模型，解释了电子壳层结构。哥本哈根量子力学解释的创始人。',
        color: '#4169E1'
      },
      {
        name: '斯蒂芬·霍金',
        years: '1942-2018',
        field: '宇宙学',
        achievement: '霍金辐射，奇点',
        nobel: '—',
        quote: '"仰望星空，不要低头看脚下。试着理解你所看到的。"',
        bio: '证明了黑洞辐射的存在。著有《时间简史》，使宇宙学为公众所理解。渐冻症没有阻止他的科学研究。',
        color: '#00CED1'
      }
    ],
    he: [
      {
        name: 'אלברט איינשטיין',
        years: '1879-1955',
        field: 'פיזיקה תיאורטית',
        achievement: 'תורת היחסות, E=mc²',
        nobel: '1921 — אפקט פוטואלקטרי',
        quote: '"דמיון חשוב יותר מידע. ידע מוגבל, דמיון מקיף את העולם."',
        bio: 'פיתח את תורת היחסות הפרטית והכללית, הסביר תנועה בראונית והאפקט הפוטואלקטרי.',
        color: '#FFD700'
      },
      {
        name: 'סטיבן הוקינג',
        years: '1942-2018',
        field: 'קוסמולוגיה',
        achievement: 'קרינת הוקינג, סינגולריות',
        nobel: '—',
        quote: '"הבט לכוכבים, לא לרגליים. נסה להבין את מה שאתה רואה."',
        bio: 'הוכיח את קיומה של קרינת חורים שחורים. כתב "קיצור תולדות הזמן".',
        color: '#00CED1'
      }
    ]
  }

  const currentScientists = scientists[language] || scientists.ru

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {currentScientists.map((scientist, index) => (
          <button
            key={index}
            onClick={() => setSelectedScientist(selectedScientist === index ? null : index)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedScientist === index 
                ? 'bg-gradient-to-br from-purple-600/50 to-cyan-600/50 border-2' 
                : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
            }`}
            style={{ borderColor: selectedScientist === index ? scientist.color : undefined }}
          >
            <div 
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2"
              style={{ backgroundColor: scientist.color + '30', color: scientist.color }}
            >
              {scientist.name.charAt(0)}
            </div>
            <div className="text-xs font-medium text-white truncate">{scientist.name}</div>
            <div className="text-[10px] text-gray-500">{scientist.years}</div>
          </button>
        ))}
      </div>

      {selectedScientist !== null && (
        <div 
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border animate-fadeIn"
          style={{ borderColor: currentScientists[selectedScientist].color + '50' }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{ 
                backgroundColor: currentScientists[selectedScientist].color + '20', 
                color: currentScientists[selectedScientist].color 
              }}
            >
              {currentScientists[selectedScientist].name.charAt(0)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">{currentScientists[selectedScientist].name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: currentScientists[selectedScientist].color + '30', color: currentScientists[selectedScientist].color }}
                >
                  {currentScientists[selectedScientist].years}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  {currentScientists[selectedScientist].field}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === 'ru' ? 'Главные достижения' : language === 'en' ? 'Key achievements' : language === 'zh' ? '主要成就' : 'הישגים מרכזיים'}
              </div>
              <div className="text-sm text-cyan-300">{currentScientists[selectedScientist].achievement}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === 'ru' ? 'Нобелевская премия' : language === 'en' ? 'Nobel Prize' : language === 'zh' ? '诺贝尔奖' : 'פרס נובל'}
              </div>
              <div className="text-sm text-yellow-400">{currentScientists[selectedScientist].nobel}</div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-purple-500">
              <p className="text-sm italic text-gray-300">{currentScientists[selectedScientist].quote}</p>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === 'ru' ? 'Биография' : language === 'en' ? 'Biography' : language === 'zh' ? '传记' : 'ביוגרפיה'}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{currentScientists[selectedScientist].bio}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold mb-1">
          {language === 'ru' ? '👨‍🔬 Великие физики' : language === 'en' ? '👨‍🔬 Great Physicists' : language === 'zh' ? '👨‍🔬 伟大物理学家' : '👨‍🔬 פיזיקאים דגולים'}
        </div>
        <p className="text-gray-400">
          {language === 'ru' 
            ? 'Эти учёные совершили революцию в нашем понимании Вселенной — от атомов до космоса.' 
            : language === 'en' 
            ? 'These scientists revolutionized our understanding of the Universe — from atoms to cosmos.' 
            : language === 'zh' 
            ? '这些科学家彻底改变了我们对宇宙的理解——从原子到宇宙。' 
            : 'מדענים אלה חוללו מהפכה בהבנתנו את היקום.'}
        </p>
      </div>
    </div>
  )
}

// ==================== FORMULA CALCULATOR ====================
function FormulaCalculator() {
  const [category, setCategory] = useState<'mechanics' | 'electromagnetism' | 'quantum' | 'relativity'>('mechanics')
  const [formula, setFormula] = useState('kinetic_energy')
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [resultUnit, setResultUnit] = useState('')

  const formulas = {
    mechanics: [
      { id: 'kinetic_energy', name: 'E = ½mv²', inputs: ['m', 'v'], unit: 'Дж', calc: (i: Record<string, number>) => 0.5 * i.m * i.v * i.v },
      { id: 'potential_energy', name: 'E = mgh', inputs: ['m', 'g', 'h'], unit: 'Дж', calc: (i: Record<string, number>) => i.m * i.g * i.h },
      { id: 'force', name: 'F = ma', inputs: ['m', 'a'], unit: 'Н', calc: (i: Record<string, number>) => i.m * i.a },
      { id: 'momentum', name: 'p = mv', inputs: ['m', 'v'], unit: 'кг·м/с', calc: (i: Record<string, number>) => i.m * i.v },
      { id: 'work', name: 'W = F·s·cos(θ)', inputs: ['F', 's', 'theta'], unit: 'Дж', calc: (i: Record<string, number>) => i.F * i.s * Math.cos(i.theta * Math.PI / 180) },
      { id: 'power', name: 'P = W/t', inputs: ['W', 't'], unit: 'Вт', calc: (i: Record<string, number>) => i.W / i.t },
      { id: 'pressure', name: 'P = F/S', inputs: ['F', 'S'], unit: 'Па', calc: (i: Record<string, number>) => i.F / i.S },
      { id: 'velocity_freefall', name: 'v = √(2gh)', inputs: ['g', 'h'], unit: 'м/с', calc: (i: Record<string, number>) => Math.sqrt(2 * i.g * i.h) },
    ],
    electromagnetism: [
      { id: 'ohm_law', name: 'U = IR', inputs: ['I', 'R'], unit: 'В', calc: (i: Record<string, number>) => i.I * i.R },
      { id: 'power_electric', name: 'P = UI', inputs: ['U', 'I'], unit: 'Вт', calc: (i: Record<string, number>) => i.U * i.I },
      { id: 'resistance', name: 'R = ρL/S', inputs: ['rho', 'L', 'S'], unit: 'Ом', calc: (i: Record<string, number>) => i.rho * i.L / i.S },
      { id: 'coulomb', name: 'F = kq₁q₂/r²', inputs: ['q1', 'q2', 'r'], unit: 'Н', calc: (i: Record<string, number>) => 8.99e9 * i.q1 * i.q2 / (i.r * i.r) },
      { id: 'capacitance', name: 'C = ε₀εS/d', inputs: ['epsilon', 'S', 'd'], unit: 'Ф', calc: (i: Record<string, number>) => 8.85e-12 * i.epsilon * i.S / i.d },
      { id: 'energy_capacitor', name: 'E = ½CU²', inputs: ['C', 'U'], unit: 'Дж', calc: (i: Record<string, number>) => 0.5 * i.C * i.U * i.U },
      { id: 'magnetic_force', name: 'F = BILsin(θ)', inputs: ['B', 'I', 'L', 'theta'], unit: 'Н', calc: (i: Record<string, number>) => i.B * i.I * i.L * Math.sin(i.theta * Math.PI / 180) },
    ],
    quantum: [
      { id: 'photon_energy', name: 'E = hf', inputs: ['f'], unit: 'Дж', calc: (i: Record<string, number>) => 6.626e-34 * i.f },
      { id: 'de_broglie', name: 'λ = h/p', inputs: ['p'], unit: 'м', calc: (i: Record<string, number>) => 6.626e-34 / i.p },
      { id: 'de_broglie_mv', name: 'λ = h/mv', inputs: ['m', 'v'], unit: 'м', calc: (i: Record<string, number>) => 6.626e-34 / (i.m * i.v) },
      { id: 'uncertainty_xp', name: 'Δx·Δp ≥ ℏ/2', inputs: ['delta_x'], unit: 'кг·м/с', calc: (i: Record<string, number>) => 1.055e-34 / (2 * i.delta_x) },
      { id: 'energy_levels', name: 'Eₙ = -13.6/n² эВ', inputs: ['n'], unit: 'эВ', calc: (i: Record<string, number>) => -13.6 / (i.n * i.n) },
      { id: 'photon_momentum', name: 'p = h/λ', inputs: ['lambda'], unit: 'кг·м/с', calc: (i: Record<string, number>) => 6.626e-34 / i.lambda },
      { id: 'photoelectric', name: 'Eₖ = hf - A', inputs: ['f', 'A'], unit: 'Дж', calc: (i: Record<string, number>) => 6.626e-34 * i.f - i.A },
    ],
    relativity: [
      { id: 'lorentz_factor', name: 'γ = 1/√(1-v²/c²)', inputs: ['v_fraction'], unit: '', calc: (i: Record<string, number>) => 1 / Math.sqrt(1 - i.v_fraction * i.v_fraction) },
      { id: 'time_dilation', name: 't\' = t/γ', inputs: ['t', 'v_fraction'], unit: 'с', calc: (i: Record<string, number>) => i.t / (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction)) },
      { id: 'length_contraction', name: "L' = L/γ", inputs: ['L', 'v_fraction'], unit: 'м', calc: (i: Record<string, number>) => i.L * Math.sqrt(1 - i.v_fraction * i.v_fraction) },
      { id: 'mass_energy', name: 'E = mc²', inputs: ['m'], unit: 'Дж', calc: (i: Record<string, number>) => i.m * 8.98755179e16 },
      { id: 'relativistic_mass', name: "m' = γm₀", inputs: ['m0', 'v_fraction'], unit: 'кг', calc: (i: Record<string, number>) => i.m0 / Math.sqrt(1 - i.v_fraction * i.v_fraction) },
      { id: 'relativistic_ke', name: 'Eₖ = (γ-1)mc²', inputs: ['m', 'v_fraction'], unit: 'Дж', calc: (i: Record<string, number>) => (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction) - 1) * i.m * 8.98755179e16 },
    ],
  }

  const inputLabels: Record<string, string> = {
    m: 'Масса m (кг)',
    v: 'Скорость v (м/с)',
    g: 'Ускорение g (м/с²)',
    h: 'Высота h (м)',
    a: 'Ускорение a (м/с²)',
    F: 'Сила F (Н)',
    s: 'Расстояние s (м)',
    theta: 'Угол θ (°)',
    W: 'Работа W (Дж)',
    t: 'Время t (с)',
    S: 'Площадь S (м²)',
    I: 'Сила тока I (А)',
    R: 'Сопротивление R (Ом)',
    U: 'Напряжение U (В)',
    P: 'Мощность P (Вт)',
    rho: 'Уд. сопротивление ρ (Ом·м)',
    L: 'Длина L (м)',
    q1: 'Заряд q₁ (Кл)',
    q2: 'Заряд q₂ (Кл)',
    r: 'Расстояние r (м)',
    epsilon: 'Диэл. проницаемость ε',
    d: 'Расстояние d (м)',
    C: 'Ёмкость C (Ф)',
    B: 'Индукция B (Тл)',
    f: 'Частота f (Гц)',
    p: 'Импульс p (кг·м/с)',
    lambda: 'Длина волны λ (м)',
    delta_x: 'Неопр. позиции Δx (м)',
    n: 'Квантовое число n',
    A: 'Работа выхода A (Дж)',
    v_fraction: 'Скорость v/c (0-0.999)',
    m0: 'Масса покоя m₀ (кг)',
  }

  const categoryLabels: Record<string, string> = {
    mechanics: '⚙️ Механика',
    electromagnetism: '⚡ Электричество',
    quantum: '⚛️ Квантовая физика',
    relativity: '🚀 Относительность',
  }

  const currentFormula = formulas[category].find(f => f.id === formula) || formulas[category][0]

  const handleCategoryChange = (cat: typeof category) => {
    setCategory(cat)
    setInputs({})
    setResult(null)
    setFormula(formulas[cat][0].id)
  }

  const calculate = () => {
    try {
      const values: Record<string, number> = {}
      for (const key of currentFormula.inputs) {
        const val = parseFloat(inputs[key] || '0')
        if (isNaN(val)) {
          setResult('Ошибка: введите корректные числа')
          return
        }
        values[key] = val
      }
      const res = currentFormula.calc(values)
      if (isNaN(res) || !isFinite(res)) {
        setResult('Ошибка: неверный результат')
        return
      }
      setResult(res.toExponential(6))
      setResultUnit(currentFormula.unit)
    } catch {
      setResult('Ошибка вычисления')
    }
  }

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(formulas) as Array<keyof typeof formulas>).map((cat) => (
          <Button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            className={`text-xs ${category === cat ? 'bg-purple-600' : ''}`}
          >
            {categoryLabels[cat]}
          </Button>
        ))}
      </div>

      {/* Formula selector */}
      <div className="space-y-2">
        <label className="text-xs text-purple-400">Выберите формулу:</label>
        <div className="flex gap-2 flex-wrap">
          {formulas[category].map((f) => (
            <Button
              key={f.id}
              onClick={() => { setFormula(f.id); setInputs({}); setResult(null) }}
              variant={formula === f.id ? 'default' : 'outline'}
              size="sm"
              className={`text-xs font-mono ${formula === f.id ? 'bg-cyan-600' : 'border-cyan-500/50 text-cyan-300'}`}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-3">
        {currentFormula.inputs.map((input) => (
          <div key={input} className="space-y-1">
            <label className="text-xs text-gray-400">{inputLabels[input] || input}</label>
            <input
              type="number"
              step="any"
              value={inputs[input] || ''}
              onChange={(e) => setInputs({ ...inputs, [input]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              placeholder={input}
            />
          </div>
        ))}
      </div>

      {/* Calculate button */}
      <Button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
      >
        🧮 Вычислить
      </Button>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="text-xs text-purple-400 mb-1">Результат:</div>
          <div className="text-2xl font-mono text-white">
            {result} {resultUnit && <span className="text-cyan-400 text-lg">{resultUnit}</span>}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-gray-800/30 rounded-lg p-3 text-xs">
        <div className="text-gray-400 mb-2">📋 Константы:</div>
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

// ==================== MAIN PAGE ====================
export default function Home() {
  const [activeSection, setActiveSection] = useState('quantum')
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('physics-lang') as Language
      return saved && translations[saved] ? saved : 'ru'
    }
    return 'ru'
  })
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('physics-theme') as Theme
      return saved || 'dark'
    }
    return 'dark'
  })
  const [menuOpen, setMenuOpen] = useState(false)

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('physics-lang', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('physics-theme', theme)
  }, [theme])

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      const sections = ['quantum', 'relativity', 'cosmos', 'advanced']
      
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1
        if (sections[index]) {
          setActiveSection(sections[index])
        }
      } else if (e.key === 'm' || e.key === 'M') {
        setMenuOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const t = translations[language]
  const isRTL = language === 'he'
  const isDark = theme === 'dark'

  const navItems = [
    { id: 'quantum', label: t.quantum, color: 'from-purple-600 to-blue-600' },
    { id: 'relativity', label: t.relativity, color: 'from-yellow-600 to-orange-600' },
    { id: 'cosmos', label: t.cosmos, color: 'from-red-600 to-purple-600' },
    { id: 'advanced', label: t.advanced, color: 'from-pink-600 to-purple-600' },
  ]

  return (
    <div 
      className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white' : 'bg-gradient-to-b from-gray-100 via-white to-gray-50 text-gray-900'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Side Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 z-[60] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDark ? 'bg-gray-900/98' : 'bg-white/98'} backdrop-blur-lg shadow-2xl border-l ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Close button */}
          <button 
            onClick={() => setMenuOpen(false)}
            className={`absolute top-4 right-4 p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            ✕
          </button>

          {/* Menu content */}
          <div className="mt-8 space-y-6">
            <div>
              <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {language === 'ru' && '📚 О проекте'}
                {language === 'en' && '📚 About'}
                {language === 'zh' && '📚 关于项目'}
                {language === 'he' && '📚 אודות'}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'ru' && 'Интерактивные визуализации физических явлений: от квантовой механики до космологии.'}
                {language === 'en' && 'Interactive visualizations of physical phenomena: from quantum mechanics to cosmology.'}
                {language === 'zh' && '物理现象的交互式可视化：从量子力学到宇宙学。'}
                {language === 'he' && 'ויזואליזציות אינטראקטיביות של תופעות פיזיקליות'}
              </p>
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ru' && '📖 Разделы'}
                {language === 'en' && '📖 Sections'}
                {language === 'zh' && '📖 章节'}
                {language === 'he' && '📖 סעיפים'}
              </h3>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setMenuOpen(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-purple-600/20 text-purple-400' 
                        : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ru' && '🔬 Визуализации'}
                {language === 'en' && '🔬 Visualizations'}
                {language === 'zh' && '🔬 可视化'}
                {language === 'he' && '🔬 ויזואליזציות'}
              </h3>
              <div className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div>🌊 {language === 'ru' ? 'Волновая функция' : language === 'en' ? 'Wave Function' : language === 'zh' ? '波函数' : 'פונקציית גל'}</div>
                <div>📐 {language === 'ru' ? 'Принцип неопределённости' : language === 'en' ? 'Uncertainty Principle' : language === 'zh' ? '不确定性原理' : 'עיקרון אי-הוודאות'}</div>
                <div>🚧 {language === 'ru' ? 'Квантовое туннелирование' : language === 'en' ? 'Quantum Tunneling' : language === 'zh' ? '量子隧穿' : 'מינהור קוונטי'}</div>
                <div>⏱️ {language === 'ru' ? 'Замедление времени' : language === 'en' ? 'Time Dilation' : language === 'zh' ? '时间膨胀' : 'התארכות זמן'}</div>
                <div>💥 E = mc²</div>
                <div>📊 {language === 'ru' ? 'Диаграмма Г-Р' : language === 'en' ? 'H-R Diagram' : language === 'zh' ? '赫罗图' : 'דיאגרמת H-R'}</div>
                <div>💫 {language === 'ru' ? 'Нейтронная звезда' : language === 'en' ? 'Neutron Star' : language === 'zh' ? '中子星' : 'כוכב נייטרון'}</div>
                <div>🕳️ {language === 'ru' ? 'Чёрная дыра' : language === 'en' ? 'Black Hole' : language === 'zh' ? '黑洞' : 'חור שחור'}</div>
                <div>⚪ {language === 'ru' ? 'Белая дыра' : language === 'en' ? 'White Hole' : language === 'zh' ? '白洞' : 'חור לבן'}</div>
                <div>🔬 {language === 'ru' ? 'Двойная щель' : language === 'en' ? 'Double Slit' : language === 'zh' ? '双缝实验' : 'סדק כפול'}</div>
                <div>🌀 {language === 'ru' ? 'Тёмная материя' : language === 'en' ? 'Dark Matter' : language === 'zh' ? '暗物质' : 'חומר אפל'}</div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ru' && '📐 Формулы'}
                {language === 'en' && '📐 Formulas'}
                {language === 'zh' && '📐 公式'}
                {language === 'he' && '📐 נוסחאות'}
              </h3>
              <div className={`text-xs space-y-2 font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <div>E = mc²</div>
                <div>Δx·Δp ≥ ℏ/2</div>
                <div>ψ(x,t) = Ae^(i(kx-ωt))</div>
                <div>R_s = 2GM/c²</div>
                <div>T_H = ℏc³/8πGMk_B</div>
                <div>γ = 1/√(1-v²/c²)</div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {language === 'ru' && '⚙️ Настройки'}
                {language === 'en' && '⚙️ Settings'}
                {language === 'zh' && '⚙️ 设置'}
                {language === 'he' && '⚙️ הגדרות'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ru' ? 'Язык' : language === 'en' ? 'Language' : language === 'zh' ? '语言' : 'שפה'}
                  </label>
                  <div className="flex gap-1 mt-1">
                    {(['ru', 'en', 'zh', 'he'] as Language[]).map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        variant={language === lang ? 'default' : 'ghost'}
                        size="sm"
                        className={`text-xs px-2 ${language === lang ? 'bg-purple-600' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'ru' ? 'Тема' : language === 'en' ? 'Theme' : language === 'zh' ? '主题' : 'ערכת נושא'}
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      onClick={() => setTheme('dark')}
                      variant={theme === 'dark' ? 'default' : 'ghost'}
                      size="sm"
                      className={`text-xs ${theme === 'dark' ? 'bg-gray-700' : ''}`}
                    >
                      🌙 Dark
                    </Button>
                    <Button
                      onClick={() => setTheme('light')}
                      variant={theme === 'light' ? 'default' : 'ghost'}
                      size="sm"
                      className={`text-xs ${theme === 'light' ? 'bg-gray-200 text-gray-900' : ''}`}
                    >
                      ☀️ Light
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {language === 'ru' && 'Создано с ❤️ для любителей физики'}
                {language === 'en' && 'Made with ❤️ for physics enthusiasts'}
                {language === 'zh' && '为物理爱好者用❤️制作'}
                {language === 'he' && 'נבנה ב❤️ לחובבי פיזיקה'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Header with controls */}
      <header className={`relative overflow-hidden py-6 md:py-10 ${isDark ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_center,rgba(60,30,120,0.15),transparent_70%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(100,80,180,0.08),transparent_70%)]'}`} />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Language, Theme and Menu controls */}
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="flex gap-2">
              {/* Language buttons */}
              <div className="flex gap-1">
                {(['ru', 'en', 'zh', 'he'] as Language[]).map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    variant={language === lang ? 'default' : 'ghost'}
                    size="sm"
                    className={`text-xs px-2 ${language === lang ? 'bg-purple-600' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>
              {/* Theme toggle */}
              <Button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                variant="outline"
                size="sm"
                className={`text-xs ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
              >
                {isDark ? '☀️' : '🌙'}
              </Button>
              {/* Menu toggle */}
              <Button
                onClick={() => setMenuOpen(true)}
                variant="outline"
                size="sm"
                className={`text-xs ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
              >
                ☰ {language === 'ru' ? 'Меню' : language === 'en' ? 'Menu' : language === 'zh' ? '菜单' : 'תפריט'}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
              {t.title}
            </h1>
            <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.subtitle}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-center gap-2 flex-wrap">
            {navItems.map((tab, index) => (
              <Button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                variant={activeSection === tab.id ? 'default' : 'ghost'}
                title={`快捷键: ${index + 1} | Shortcut: ${index + 1}`}
                className={`text-xs md:text-sm ${activeSection === tab.id ? `bg-gradient-to-r ${tab.color}` : isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {activeSection === 'quantum' && (
          <>
            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.waveFunction}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.waveFunctionDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.waveFunction} isDark={isDark}><WaveFunctionVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30' : 'bg-white border-blue-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.uncertainty}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.uncertaintyDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.uncertainty} isDark={isDark}><UncertaintyVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30' : 'bg-white border-green-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>{t.tunneling}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.tunnelingDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.tunneling} isDark={isDark}><TunnelingVisualization /></FullscreenWrapper></CardContent>
            </Card>
          </>
        )}

        {activeSection === 'relativity' && (
          <>
            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-orange-500/30' : 'bg-white border-orange-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t.timeDilation}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.timeDilationDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.timeDilation} isDark={isDark}><TimeDilationVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.lengthContraction}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.lengthContractionDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.lengthContraction} isDark={isDark}><LengthContractionVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30' : 'bg-white border-yellow-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{t.massEnergy}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.massEnergyDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.massEnergy} isDark={isDark}><MassEnergyVisualization /></FullscreenWrapper></CardContent>
            </Card>
          </>
        )}

        {activeSection === 'cosmos' && (
          <>
            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30' : 'bg-white border-blue-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.hrDiagram}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.hrDiagramDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.hrDiagram} isDark={isDark}><HRDiagramVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30' : 'bg-white border-cyan-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.neutronStar}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.neutronStarDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.neutronStar} isDark={isDark}><NeutronStarVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-red-500/30' : 'bg-white border-red-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>{t.blackHole}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.blackHoleDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.blackHole} isDark={isDark}><BlackHoleVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30' : 'bg-white border-cyan-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.whiteHole}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.whiteHoleDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.whiteHole} isDark={isDark}><WhiteHoleVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30' : 'bg-white border-yellow-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{t.solarSystem}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.solarSystemDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.solarSystem} isDark={isDark}><SolarSystemVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30' : 'bg-white border-blue-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.cmb}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.cmbDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.cmb} isDark={isDark}><CMBVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.darkEnergy}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.darkEnergyDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.darkEnergy} isDark={isDark}><DarkEnergyVisualization /></FullscreenWrapper></CardContent>
            </Card>
          </>
        )}

        {activeSection === 'advanced' && (
          <>
            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-pink-500/30' : 'bg-white border-pink-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>{t.doubleSlit}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.doubleSlitDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.doubleSlit} isDark={isDark}><DoubleSlitVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.darkMatter}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.darkMatterDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.darkMatter} isDark={isDark}><DarkMatterVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30' : 'bg-white border-green-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>{t.schrodingersCat}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.schrodingersCatDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.schrodingersCat} isDark={isDark}><SchrodingersCatVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-orange-500/30' : 'bg-white border-orange-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t.bigBang}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.bigBangDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.bigBang} isDark={isDark}><BigBangVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30' : 'bg-white border-yellow-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{t.photoelectric}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.photoelectricDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.photoelectric} isDark={isDark}><PhotoelectricEffectVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30' : 'bg-white border-blue-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.brownianMotion}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.brownianMotionDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.brownianMotion} isDark={isDark}><BrownianMotionVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.gravitationalWaves}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.gravitationalWavesDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.gravitationalWaves} isDark={isDark}><GravitationalWavesVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-pink-500/30' : 'bg-white border-pink-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>{t.quantumEntanglement}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.quantumEntanglementDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.quantumEntanglement} isDark={isDark}><QuantumEntanglementVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30' : 'bg-white border-cyan-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.atomicModel}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.atomicModelDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.atomicModel} isDark={isDark}><AtomicModelVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30' : 'bg-white border-green-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>{t.radioactiveDecay}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.radioactiveDecayDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.radioactiveDecay} isDark={isDark}><RadioactiveDecayVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30' : 'bg-white border-cyan-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.superconductivity}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.superconductivityDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.superconductivity} isDark={isDark}><SuperconductivityVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30' : 'bg-white border-yellow-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{t.standardModel}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.standardModelDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.standardModel} isDark={isDark}><StandardModelVisualization /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.calculator}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.calculatorDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.calculator} isDark={isDark}><FormulaCalculator /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30' : 'bg-white border-purple-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t.timeline}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.timelineDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.timeline} isDark={isDark}><PhysicsTimeline /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30' : 'bg-white border-cyan-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t.physicsQuiz}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.physicsQuizDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.physicsQuiz} isDark={isDark}><PhysicsQuiz /></FullscreenWrapper></CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30' : 'bg-white border-yellow-300'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{t.scientists}</CardTitle>
                <CardDescription className={`text-xs ${isDark ? '' : 'text-gray-600'}`}>{t.scientistsDesc}</CardDescription>
              </CardHeader>
              <CardContent className="relative"><FullscreenWrapper title={t.scientists} isDark={isDark}><ScientistsBiographies /></FullscreenWrapper></CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className={`border-t py-4 mt-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className={`max-w-6xl mx-auto px-4 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>{t.footer}</p>
          <p className={`mt-1 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            ⌨️ {language === 'ru' ? 'Клавиши: 1-4 разделы, M меню, Esc закрыть' : 
                language === 'en' ? 'Keys: 1-4 sections, M menu, Esc close' : 
                language === 'zh' ? '快捷键: 1-4章节, M菜单, Esc关闭' : 
                'מקשים: 1-4 סעיפים, M תפריט, Esc סגור'}
          </p>
        </div>
      </footer>
    </div>
  )
}
