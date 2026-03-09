import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Интерактивные Научные Визуализации",
  description: "Погрузитесь в мир физики через интерактивные демонстрации фундаментальных законов Вселенной. Термодинамика и космология.",
  keywords: ["физика", "термодинамика", "космология", "визуализация", "наука", "образование", "Next.js"],
  authors: [{ name: "Научные Визуализации" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Интерактивные Научные Визуализации",
    description: "Изучайте физику через интерактивные демонстрации",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Интерактивные Научные Визуализации",
    description: "Изучайте физику через интерактивные демонстрации",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
