import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quantum Horizon — Интерактивные научные визуализации",
  description:
    "От частиц до космоса: погрузитесь в мир физики через интерактивные демонстрации квантовой механики, теории относительности и космологии.",
  keywords: [
    "физика",
    "квантовая механика",
    "теория относительности",
    "космология",
    "визуализация",
    "наука",
    "образование",
    "Next.js",
  ],
  authors: [{ name: "QuadDarv1ne" }],
  creator: "QuadDarv1ne",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192x192.png",
    shortcut: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quantum Horizon",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Quantum Horizon — Интерактивные научные визуализации",
    description: "От частиц до космоса: изучайте физику через интерактивные демонстрации",
    type: "website",
    locale: "ru_RU",
    siteName: "Quantum Horizon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantum Horizon — Интерактивные научные визуализации",
    description: "От частиц до космоса: изучайте физику через интерактивные демонстрации",
    creator: "@QuadDarv1ne",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
