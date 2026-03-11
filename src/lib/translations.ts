// ==================== TRANSLATIONS ====================
export type Language = "ru" | "en" | "zh" | "he"

export interface Translation {
  title: string
  subtitle: string
  quantum: string
  relativity: string
  cosmos: string
  advanced: string
  waveFunction: string
  waveFunctionDesc: string
  uncertainty: string
  uncertaintyDesc: string
  tunneling: string
  tunnelingDesc: string
  timeDilation: string
  timeDilationDesc: string
  lengthContraction: string
  lengthContractionDesc: string
  massEnergy: string
  massEnergyDesc: string
  hrDiagram: string
  hrDiagramDesc: string
  neutronStar: string
  neutronStarDesc: string
  blackHole: string
  blackHoleDesc: string
  whiteHole: string
  whiteHoleDesc: string
  doubleSlit: string
  doubleSlitDesc: string
  darkMatter: string
  darkMatterDesc: string
  schrodingersCat: string
  schrodingersCatDesc: string
  bigBang: string
  bigBangDesc: string
  photoelectric: string
  photoelectricDesc: string
  brownianMotion: string
  brownianMotionDesc: string
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
  footer: string
  theme: string
  language: string
  fullscreen: string
  exitFullscreen: string
  calculator: string
  calculatorDesc: string
  mechanics: string
  electromagnetism: string
  calculate: string
  result: string
  timeline: string
  timelineDesc: string
  solarSystem: string
  solarSystemDesc: string
  cmb: string
  cmbDesc: string
  darkEnergy: string
  darkEnergyDesc: string
  physicsQuiz: string
  physicsQuizDesc: string
  scientists: string
  scientistsDesc: string
}

export const translations: Record<Language, Translation> = {
  ru: {
    title: "⧫ QUANTUM HORIZON",
    subtitle: "От частиц до космоса • From Particles to Cosmos",
    quantum: "⚛️ Кванты",
    relativity: "🚀 Относительность",
    cosmos: "🌌 Космос",
    advanced: "🔬 Продвинутые",
    waveFunction: "🌊 Волновая функция",
    waveFunctionDesc: "Уравнение Шрёдингера для частицы в яме",
    uncertainty: "📐 Принцип неопределённости",
    uncertaintyDesc: "Δx·Δp ≥ ℏ/2 — Гейзенберг, 1927",
    tunneling: "🚧 Квантовое туннелирование",
    tunnelingDesc: "Прохождение сквозь потенциальный барьер",
    timeDilation: "⏱️ Замедление времени",
    timeDilationDesc: "Специальная теория относительности",
    lengthContraction: "📏 Сокращение длины",
    lengthContractionDesc: "Лоренцево сокращение",
    massEnergy: "💥 E = mc²",
    massEnergyDesc: "Эквивалентность массы и энергии",
    hrDiagram: "📊 Диаграмма Герцшпрунга-Рассела",
    hrDiagramDesc: "Классификация и эволюция звёзд",
    neutronStar: "💫 Нейтронная звезда / Пульсар",
    neutronStarDesc: "Вращающиеся магнитные диполи",
    blackHole: "🕳️ Чёрная дыра",
    blackHoleDesc: "С излучением Хокинга и аккреционным диском",
    whiteHole: "⚪ Белая дыра",
    whiteHoleDesc: "Теоретическая обратная сторона чёрной дыры",
    doubleSlit: "🔬 Эксперимент с двойной щелью",
    doubleSlitDesc: "Корпускулярно-волновой дуализм",
    darkMatter: "🌀 Тёмная материя",
    darkMatterDesc: "Кривые вращения галактик",
    schrodingersCat: "🐱 Кот Шрёдингера",
    schrodingersCatDesc: "Квантовая суперпозиция",
    bigBang: "💥 Большой взрыв",
    bigBangDesc: "Расширение Вселенной",
    photoelectric: "⚡ Фотоэффект",
    photoelectricDesc: "Кванты света и электроны",
    brownianMotion: "🔬 Броуновское движение",
    brownianMotionDesc: "Хаотичное движение частиц",
    gravitationalWaves: "〰️ Гравитационные волны",
    gravitationalWavesDesc: "Рябь пространства-времени",
    quantumEntanglement: "🔗 Квантовая запутанность",
    quantumEntanglementDesc: "Спутанность частиц",
    atomicModel: "⚛️ Атомная модель Бора",
    atomicModelDesc: "Электронные орбиты и квантовые переходы",
    radioactiveDecay: "☢️ Радиоактивный распад",
    radioactiveDecayDesc: "α, β, γ излучения",
    superconductivity: "❄️ Суперпроводимость",
    superconductivityDesc: "Эффект Мейсснера",
    standardModel: "🧩 Стандартная модель",
    standardModelDesc: "Кварки, лептоны, бозоны",
    footer: "⧫ QUANTUM HORIZON • Научные визуализации современной физики",
    theme: "Тема",
    language: "Язык",
    fullscreen: "Полный экран",
    exitFullscreen: "Выйти",
    calculator: "🧮 Калькулятор формул",
    calculatorDesc: "Расчёты физических величин",
    mechanics: "Механика",
    electromagnetism: "Электричество",
    calculate: "Вычислить",
    result: "Результат",
    timeline: "📅 Таймлайн открытий",
    timelineDesc: "История физики от античности до наших дней",
    solarSystem: "🌍 Солнечная система",
    solarSystemDesc: "Планеты и их орбиты",
    cmb: "🌡️ Реликтовое излучение",
    cmbDesc: "Карта ранней Вселенной (CMB)",
    darkEnergy: "💫 Тёмная энергия",
    darkEnergyDesc: "Расширение Вселенной",
    physicsQuiz: "📝 Тест по физике",
    physicsQuizDesc: "Проверь свои знания",
    scientists: "👨‍🔬 Учёные",
    scientistsDesc: "Биографии великих физиков",
  },
  en: {
    title: "⧫ QUANTUM HORIZON",
    subtitle: "From Particles to Cosmos • От частиц до космоса",
    quantum: "⚛️ Quantum",
    relativity: "🚀 Relativity",
    cosmos: "🌌 Cosmos",
    advanced: "🔬 Advanced",
    waveFunction: "🌊 Wave Function",
    waveFunctionDesc: "Schrödinger equation for a particle in a well",
    uncertainty: "📐 Uncertainty Principle",
    uncertaintyDesc: "Δx·Δp ≥ ℏ/2 — Heisenberg, 1927",
    tunneling: "🚧 Quantum Tunneling",
    tunnelingDesc: "Passing through a potential barrier",
    timeDilation: "⏱️ Time Dilation",
    timeDilationDesc: "Special theory of relativity",
    lengthContraction: "📏 Length Contraction",
    lengthContractionDesc: "Lorentz contraction",
    massEnergy: "💥 E = mc²",
    massEnergyDesc: "Mass-energy equivalence",
    hrDiagram: "📊 Hertzsprung-Russell Diagram",
    hrDiagramDesc: "Star classification and evolution",
    neutronStar: "💫 Neutron Star / Pulsar",
    neutronStarDesc: "Rotating magnetic dipoles",
    blackHole: "🕳️ Black Hole",
    blackHoleDesc: "With Hawking radiation and accretion disk",
    whiteHole: "⚪ White Hole",
    whiteHoleDesc: "Theoretical reverse of a black hole",
    doubleSlit: "🔬 Double-Slit Experiment",
    doubleSlitDesc: "Wave-particle duality",
    darkMatter: "🌀 Dark Matter",
    darkMatterDesc: "Galaxy rotation curves",
    schrodingersCat: "🐱 Schrödinger's Cat",
    schrodingersCatDesc: "Quantum superposition",
    bigBang: "💥 Big Bang",
    bigBangDesc: "Universe expansion",
    photoelectric: "⚡ Photoelectric Effect",
    photoelectricDesc: "Light quanta and electrons",
    brownianMotion: "🔬 Brownian Motion",
    brownianMotionDesc: "Random particle motion",
    gravitationalWaves: "〰️ Gravitational Waves",
    gravitationalWavesDesc: "Ripples in spacetime",
    quantumEntanglement: "🔗 Quantum Entanglement",
    quantumEntanglementDesc: "Spooky action at distance",
    atomicModel: "⚛️ Bohr Atomic Model",
    atomicModelDesc: "Electron orbits and transitions",
    radioactiveDecay: "☢️ Radioactive Decay",
    radioactiveDecayDesc: "α, β, γ radiation",
    superconductivity: "❄️ Superconductivity",
    superconductivityDesc: "Meissner effect",
    standardModel: "🧩 Standard Model",
    standardModelDesc: "Quarks, leptons, bosons",
    footer: "⧫ QUANTUM HORIZON • Scientific visualizations of modern physics",
    theme: "Theme",
    language: "Language",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit",
    calculator: "🧮 Formula Calculator",
    calculatorDesc: "Physical quantities calculations",
    mechanics: "Mechanics",
    electromagnetism: "Electricity",
    calculate: "Calculate",
    result: "Result",
    timeline: "📅 Timeline of Discoveries",
    timelineDesc: "History of physics from antiquity to modern times",
    solarSystem: "🌍 Solar System",
    solarSystemDesc: "Planets and their orbits",
    cmb: "🌡️ Cosmic Microwave Background",
    cmbDesc: "Map of the early universe",
    darkEnergy: "💫 Dark Energy",
    darkEnergyDesc: "Universe expansion",
    physicsQuiz: "📝 Physics Quiz",
    physicsQuizDesc: "Test your knowledge",
    scientists: "👨‍🔬 Scientists",
    scientistsDesc: "Biographies of great physicists",
  },
  zh: {
    title: "⧫ QUANTUM HORIZON",
    subtitle: "从粒子到宇宙 • From Particles to Cosmos",
    quantum: "⚛️ 量子",
    relativity: "🚀 相对论",
    cosmos: "🌌 宇宙",
    advanced: "🔬 高级",
    waveFunction: "🌊 波函数",
    waveFunctionDesc: "势阱中粒子的薛定谔方程",
    uncertainty: "📐 不确定性原理",
    uncertaintyDesc: "Δx·Δp ≥ ℏ/2 — 海森堡，1927",
    tunneling: "🚧 量子隧穿",
    tunnelingDesc: "穿越势垒",
    timeDilation: "⏱️ 时间膨胀",
    timeDilationDesc: "狭义相对论",
    lengthContraction: "📏 长度收缩",
    lengthContractionDesc: "洛伦兹收缩",
    massEnergy: "💥 E = mc²",
    massEnergyDesc: "质能等价",
    hrDiagram: "📊 赫罗图",
    hrDiagramDesc: "恒星分类与演化",
    neutronStar: "💫 中子星 / 脉冲星",
    neutronStarDesc: "旋转磁偶极子",
    blackHole: "🕳️ 黑洞",
    blackHoleDesc: "霍金辐射与吸积盘",
    whiteHole: "⚪ 白洞",
    whiteHoleDesc: "黑洞的理论反向",
    doubleSlit: "🔬 双缝实验",
    doubleSlitDesc: "波粒二象性",
    darkMatter: "🌀 暗物质",
    darkMatterDesc: "星系旋转曲线",
    schrodingersCat: "🐱 薛定谔的猫",
    schrodingersCatDesc: "量子叠加态",
    bigBang: "💥 大爆炸",
    bigBangDesc: "宇宙膨胀",
    photoelectric: "⚡ 光电效应",
    photoelectricDesc: "光量子与电子",
    brownianMotion: "🔬 布朗运动",
    brownianMotionDesc: "粒子随机运动",
    gravitationalWaves: "〰️ 引力波",
    gravitationalWavesDesc: "时空涟漪",
    quantumEntanglement: "🔗 量子纠缠",
    quantumEntanglementDesc: "幽灵般的超距作用",
    atomicModel: "⚛️ 玻尔原子模型",
    atomicModelDesc: "电子轨道与跃迁",
    radioactiveDecay: "☢️ 放射性衰变",
    radioactiveDecayDesc: "α、β、γ射线",
    superconductivity: "❄️ 超导现象",
    superconductivityDesc: "迈斯纳效应",
    standardModel: "🧩 标准模型",
    standardModelDesc: "夸克、轻子、玻色子",
    footer: "⧫ QUANTUM HORIZON • 现代物理学科学可视化",
    theme: "主题",
    language: "语言",
    fullscreen: "全屏",
    exitFullscreen: "退出",
    calculator: "🧮 公式计算器",
    calculatorDesc: "物理量计算",
    mechanics: "力学",
    electromagnetism: "电学",
    calculate: "计算",
    result: "结果",
    timeline: "📅 发现时间线",
    timelineDesc: "从古代到现代的物理学史",
    solarSystem: "🌍 太阳系",
    solarSystemDesc: "行星及其轨道",
    cmb: "🌡️ 宇宙微波背景",
    cmbDesc: "早期宇宙地图",
    darkEnergy: "💫 暗能量",
    darkEnergyDesc: "宇宙膨胀",
    physicsQuiz: "📝 物理测验",
    physicsQuizDesc: "测试你的知识",
    scientists: "👨‍🔬 科学家",
    scientistsDesc: "伟大物理学家传记",
  },
  he: {
    title: "⧫ QUANTUM HORIZON",
    subtitle: "מחלקיקים עד הקוסמוס • From Particles to Cosmos",
    quantum: "⚛️ קוונטים",
    relativity: "🚀 יחסות",
    cosmos: "🌌 קוסמוס",
    advanced: "🔬 מתקדם",
    waveFunction: "🌊 פונקציית גל",
    waveFunctionDesc: "משוואת שרדינגר לחלקיק בבור",
    uncertainty: "📐 עיקרון אי-הוודאות",
    uncertaintyDesc: "Δx·Δp ≥ ℏ/2 — הייזנברג, 1927",
    tunneling: "🚧 מינהור קוונטי",
    tunnelingDesc: "מעבר דרך מחסום פוטנציאל",
    timeDilation: "⏱️ התארכות זמן",
    timeDilationDesc: "תורת היחסות הפרטית",
    lengthContraction: "📏 התכווצות אורך",
    lengthContractionDesc: "התכווצות לורנץ",
    massEnergy: "💥 E = mc²",
    massEnergyDesc: "שקילות מסה-אנרגיה",
    hrDiagram: "📊 דיאגרמת הרצשפרונג-ראסל",
    hrDiagramDesc: "סיווג ואבולוציה של כוכבים",
    neutronStar: "💫 כוכב נייטרון / פולסר",
    neutronStarDesc: "דיפולים מגנטיים מסתובבים",
    blackHole: "🕳️ חור שחור",
    blackHoleDesc: "עם קרינת הוקינג ודיסקת ספיחה",
    whiteHole: "⚪ חור לבן",
    whiteHoleDesc: "ההפך התיאורטי של חור שחור",
    doubleSlit: "🔬 ניסוי הסדק הכפול",
    doubleSlitDesc: "דואליות גל-חלקיק",
    darkMatter: "🌀 חומר אפל",
    darkMatterDesc: "עקומות סיבוב גלקסיות",
    schrodingersCat: "🐱 החתול של שרדינגר",
    schrodingersCatDesc: "סופרפוזיציה קוונטית",
    bigBang: "💥 המפץ הגדול",
    bigBangDesc: "התפשטות היקום",
    photoelectric: "⚡ אפקט פוטואלקטרי",
    photoelectricDesc: "קוונטי אור ואלקטרונים",
    brownianMotion: "🔬 תנועה בראונית",
    brownianMotionDesc: "תנועת חלקיקים אקראית",
    gravitationalWaves: "〰️ גלי כבידה",
    gravitationalWavesDesc: "אדוות במרחב-זמן",
    quantumEntanglement: "🔗 שזירה קוונטית",
    quantumEntanglementDesc: "פעולה מרחוק",
    atomicModel: "⚛️ מודל האטום של בוהר",
    atomicModelDesc: "מסלולי אלקטרונים",
    radioactiveDecay: "☢️ דעיכה רדיואקטיבית",
    radioactiveDecayDesc: "קרינת α, β, γ",
    superconductivity: "❄️ מוליכות-על",
    superconductivityDesc: "אפקט מייסנר",
    standardModel: "🧩 המודל הסטנדרטי",
    standardModelDesc: "קווארקים, לפטונים, בוזונים",
    footer: "⧫ QUANTUM HORIZON • ויזואליזציות מדעיות של פיזיקה מודרנית",
    theme: "ערכת נושא",
    language: "שפה",
    fullscreen: "מסך מלא",
    exitFullscreen: "יציאה",
    calculator: "🧮 מחשבון נוסחאות",
    calculatorDesc: "חישובי כמויות פיזיקליות",
    mechanics: "מכניקה",
    electromagnetism: "חשמל",
    calculate: "חשב",
    result: "תוצאה",
    timeline: "📅 ציר הזמן של התגליות",
    timelineDesc: "תולדות הפיזיקה מהעת העתיקה ועד ימינו",
    solarSystem: "🌍 מערכת השמש",
    solarSystemDesc: "כוכבי הלכת ומסלוליהם",
    cmb: "🌡️ קרינת רקע קוסמית",
    cmbDesc: "מפת היקום המוקדם",
    darkEnergy: "💫 אנרגיה אפלה",
    darkEnergyDesc: "התפשטות היקום",
    physicsQuiz: "📝 חידון פיזיקה",
    physicsQuizDesc: "בדוק את הידע שלך",
    scientists: "👨‍🔬 מדענים",
    scientistsDesc: "ביוגרפיות של פיזיקאים גדולים",
  },
}
