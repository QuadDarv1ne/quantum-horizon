import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
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

  return (
    <NextIntlClientProvider messages={messages}>
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </NextIntlClientProvider>
  )
}
