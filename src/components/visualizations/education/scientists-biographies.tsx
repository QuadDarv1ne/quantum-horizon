"use client"

import { useState } from "react"

type Language = "ru" | "en" | "zh" | "he"

interface Scientist {
  name: string
  years: string
  field: string
  achievement: string
  nobel: string
  quote: string
  bio: string
  color: string
}

const SCIENTISTS: Record<Language, Scientist[]> = {
  ru: [
    {
      name: "Альберт Эйнштейн",
      years: "1879-1955",
      field: "Теоретическая физика",
      achievement: "Теория относительности, E=mc²",
      nobel: "1921 — Фотоэффект",
      quote: '"Воображение важнее знания. Знание ограничено, воображение охватывает весь мир."',
      bio: "Разработал специальную и общую теорию относительности, объяснил броуновское движение и фотоэффект. Его уравнение E=mc² стало символом взаимосвязи массы и энергии.",
      color: "#FFD700",
    },
    {
      name: "Нильс Бор",
      years: "1885-1962",
      field: "Квантовая физика",
      achievement: "Модель атома, принцип дополнительности",
      nobel: "1922 — Строение атома",
      quote: '"Противоположности не противоречивы, а взаимодополняемы."',
      bio: "Создал квантовую модель атома, объяснил структуру электронных оболочек. Основатель Копенгагенской интерпретации квантовой механики.",
      color: "#4169E1",
    },
    {
      name: "Ричард Фейнман",
      years: "1918-1988",
      field: "Квантовая электродинамика",
      achievement: "Диаграммы Фейнмана, путь интегралов",
      nobel: "1965 — Квантовая электродинамика",
      quote:
        '"Если вы думаете, что понимаете квантовую механику, то вы не понимаете квантовую механику."',
      bio: "Разработал формулировку квантовой механики через интегралы по путям. Известен своими лекциями по физике и участием в расследовании катастрофы «Челленджера».",
      color: "#32CD32",
    },
    {
      name: "Макс Планк",
      years: "1858-1947",
      field: "Квантовая физика",
      achievement: "Квантовая гипотеза, постоянная Планка",
      nobel: "1918 — Открытие квантов",
      quote:
        '"Наука не может решить тайну последней природы. И то, что она не может сделать этого, не означает, что наука не добилась успеха."',
      bio: "Отец квантовой физики. Ввёл понятие кванта энергии для объяснения спектра излучения чёрного тела. Его постоянная h — фундаментальная константа природы.",
      color: "#9370DB",
    },
    {
      name: "Эрвин Шрёдингер",
      years: "1887-1961",
      field: "Квантовая физика",
      achievement: "Уравнение Шрёдингера, кот Шрёдингера",
      nobel: "1933 — Волновая механика",
      quote:
        '"Я не люблю её, и мне жаль, что я когда-либо имел к ней отношение." (о квантовой механике)',
      bio: "Создал волновую механику — математический аппарат квантовой теории. Знаменит мысленным экспериментом с котом, иллюстрирующим парадоксы суперпозиции.",
      color: "#DC143C",
    },
    {
      name: "Вернер Гейзенберг",
      years: "1901-1976",
      field: "Квантовая механика",
      achievement: "Принцип неопределённости, матричная механика",
      nobel: "1932 — Квантовая механика",
      quote:
        '"Первый глоток из кубка естественных наук делает атеистом, но на дне кубка вас ждёт Бог."',
      bio: "Сформулировал принцип неопределённости — фундаментальное ограничение точности измерений. Создал матричную формулировку квантовой механики.",
      color: "#FF6347",
    },
    {
      name: "Стивен Хокинг",
      years: "1942-2018",
      field: "Космология",
      achievement: "Излучение Хокинга, сингулярности",
      nobel: "— (многие считают это упущением)",
      quote: '"Смотри на звёзды, а не под ноги. Пытайся понять то, что видишь."',
      bio: 'Доказал существование излучения чёрных дыр. Написал "Краткую историю времени", сделав космологию доступной широкой публике. Болезнь ALS не помешала его научной работе.',
      color: "#00CED1",
    },
    {
      name: "Мария Кюри",
      years: "1867-1934",
      field: "Радиоактивность",
      achievement: "Открытие полония и радия",
      nobel: "1903 (физика) и 1911 (химия)",
      quote: '"Ничего в жизни не надо бояться, надо только понимать."',
      bio: "Первая женщина — лауреат Нобелевской премии, единственный учёный, получивший Нобелевскую премию в двух разных науках. Пионер исследований радиоактивности.",
      color: "#FF69B4",
    },
  ],
  en: [
    {
      name: "Albert Einstein",
      years: "1879-1955",
      field: "Theoretical Physics",
      achievement: "Theory of Relativity, E=mc²",
      nobel: "1921 — Photoelectric effect",
      quote:
        '"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."',
      bio: "Developed special and general relativity, explained Brownian motion and the photoelectric effect. His equation E=mc² became a symbol of mass-energy equivalence.",
      color: "#FFD700",
    },
    {
      name: "Niels Bohr",
      years: "1885-1962",
      field: "Quantum Physics",
      achievement: "Atomic model, complementarity principle",
      nobel: "1922 — Atomic structure",
      quote: '"Opposites are not contradictory, they are complementary."',
      bio: "Created the quantum model of the atom, explained the structure of electron shells. Founder of the Copenhagen interpretation of quantum mechanics.",
      color: "#4169E1",
    },
    {
      name: "Richard Feynman",
      years: "1918-1988",
      field: "Quantum Electrodynamics",
      achievement: "Feynman diagrams, path integrals",
      nobel: "1965 — Quantum electrodynamics",
      quote:
        '"If you think you understand quantum mechanics, you don\'t understand quantum mechanics."',
      bio: "Developed the path integral formulation of quantum mechanics. Known for his physics lectures and participation in the Challenger disaster investigation.",
      color: "#32CD32",
    },
    {
      name: "Stephen Hawking",
      years: "1942-2018",
      field: "Cosmology",
      achievement: "Hawking radiation, singularities",
      nobel: "— (many consider this an oversight)",
      quote: '"Look up at the stars, not down at your feet. Try to make sense of what you see."',
      bio: 'Proved the existence of black hole radiation. Wrote "A Brief History of Time," making cosmology accessible to the public. ALS disease did not stop his scientific work.',
      color: "#00CED1",
    },
    {
      name: "Marie Curie",
      years: "1867-1934",
      field: "Radioactivity",
      achievement: "Discovery of polonium and radium",
      nobel: "1903 (physics) and 1911 (chemistry)",
      quote: '"Nothing in life is to be feared, it is only to be understood."',
      bio: "First woman to win a Nobel Prize, only scientist to win Nobel Prizes in two different sciences. Pioneer of radioactivity research.",
      color: "#FF69B4",
    },
  ],
  zh: [
    {
      name: "阿尔伯特·爱因斯坦",
      years: "1879-1955",
      field: "理论物理",
      achievement: "相对论，E=mc²",
      nobel: "1921 — 光电效应",
      quote: '"想象力比知识更重要。知识是有限的，想象力环绕整个世界。"',
      bio: "发展了狭义和广义相对论，解释了布朗运动和光电效应。他的方程 E=mc² 成为质能等价的象征。",
      color: "#FFD700",
    },
    {
      name: "尼尔斯·玻尔",
      years: "1885-1962",
      field: "量子物理",
      achievement: "原子模型，互补原理",
      nobel: "1922 — 原子结构",
      quote: '"对立面并不矛盾，而是互补的。"',
      bio: "创建了原子的量子模型，解释了电子壳层结构。哥本哈根量子力学解释的创始人。",
      color: "#4169E1",
    },
    {
      name: "史蒂芬·霍金",
      years: "1942-2018",
      field: "宇宙学",
      achievement: "霍金辐射，奇点",
      nobel: "—",
      quote: '"仰望星空，不要低头看脚下。试着理解你所看到的。"',
      bio: "证明了黑洞辐射的存在。著有《时间简史》，使宇宙学为公众所理解。渐冻症没有阻止他的科学研究。",
      color: "#00CED1",
    },
  ],
  he: [
    {
      name: "אלברט איינשטיין",
      years: "1879-1955",
      field: "פיזיקה תיאורטית",
      achievement: "תורת היחסות, E=mc²",
      nobel: "1921 — אפקט פוטואלקטרי",
      quote: '"דמיון חשוב יותר מידע. ידע מוגבל, דמיון מקיף את העולם."',
      bio: "פיתח את תורת היחסות הפרטית והכללית, הסביר תנועה בראונית והאפקט הפוטואלקטרי.",
      color: "#FFD700",
    },
    {
      name: "סטיבן הוקינג",
      years: "1942-2018",
      field: "קוסמולוגיה",
      achievement: "קרינת הוקינג, סינגולריות",
      nobel: "—",
      quote: '"הבט לכוכבים, לא לרגליך. נסה להבין את מה שאתה רואה."',
      bio: 'הוכיח את קיומה של קרינת חורים שחורים. כתב "קיצור תולדות הזמן".',
      color: "#00CED1",
    },
  ],
}

const LABELS: Record<Language, Record<string, string>> = {
  ru: {
    achievements: "Главные достижения",
    nobel: "Нобелевская премия",
    bio: "Биография",
    great: "👨‍🔬 Великие физики",
    desc: "Эти учёные совершили революцию в нашем понимании Вселенной — от атомов до космоса.",
  },
  en: {
    achievements: "Key achievements",
    nobel: "Nobel Prize",
    bio: "Biography",
    great: "👨‍🔬 Great Physicists",
    desc: "These scientists revolutionized our understanding of the Universe — from atoms to cosmos.",
  },
  zh: {
    achievements: "主要成就",
    nobel: "诺贝尔奖",
    bio: "传记",
    great: "👨‍🔬 伟大物理学家",
    desc: "这些科学家彻底改变了我们对宇宙的理解——从原子到宇宙。",
  },
  he: {
    achievements: "הישגים מרכזיים",
    nobel: "פרס נובל",
    bio: "ביוגרפיה",
    great: "👨‍🔬 פיזיקאים דגולים",
    desc: "מדענים אלה חוללו מהפכה בהבנתנו את היקום.",
  },
}

export function ScientistsBiographies() {
  const [selectedScientist, setSelectedScientist] = useState<number | null>(null)
  const [language] = useState<Language>("ru")

  const currentScientists = SCIENTISTS[language]
  const labels = LABELS[language]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {currentScientists.map((scientist, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedScientist(selectedScientist === index ? null : index)
            }}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedScientist === index
                ? "bg-gradient-to-br from-purple-600/50 to-cyan-600/50 border-2"
                : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
            }`}
            style={{ borderColor: selectedScientist === index ? scientist.color : undefined }}
          >
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2"
              style={{ backgroundColor: scientist.color + "30", color: scientist.color }}
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
          style={{ borderColor: currentScientists[selectedScientist].color + "50" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{
                backgroundColor: currentScientists[selectedScientist].color + "20",
                color: currentScientists[selectedScientist].color,
              }}
            >
              {currentScientists[selectedScientist].name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">
                {currentScientists[selectedScientist].name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: currentScientists[selectedScientist].color + "30",
                    color: currentScientists[selectedScientist].color,
                  }}
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
              <div className="text-xs text-gray-500 mb-1">{labels.achievements}</div>
              <div className="text-sm text-cyan-300">
                {currentScientists[selectedScientist].achievement}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">{labels.nobel}</div>
              <div className="text-sm text-yellow-400">
                {currentScientists[selectedScientist].nobel}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-purple-500">
              <p className="text-sm italic text-gray-300">
                {currentScientists[selectedScientist].quote}
              </p>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">{labels.bio}</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentScientists[selectedScientist].bio}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold mb-1">{labels.great}</div>
        <p className="text-gray-400">{labels.desc}</p>
      </div>
    </div>
  )
}
