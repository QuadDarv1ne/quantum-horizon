/* eslint-disable react-refresh/only-export-components */
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration"
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt"
import { WebVitals } from "@/components/pwa/web-vitals"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { metadata } from "./metadata"
import { locales, type Locale } from "@/i18n/config"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export { metadata }

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// Определение направления текста для RTL языков
function getTextDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "he" ? "rtl" : "ltr"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = getTextDirection(locale)

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Quantum Horizon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            {children}
            <Toaster />
            <ServiceWorkerRegistration />
            <PWAInstallPrompt />
            <WebVitals />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
