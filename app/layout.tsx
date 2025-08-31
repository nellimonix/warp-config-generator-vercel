import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import AnalyticsLoader from "@/components/rybbit-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WARP конфигуратор - Генератор конфигураций WARP для обхода блокировок",
  description: "Бесплатный генератор конфигураций WARP для Cloudflare. Создавайте конфиги для обхода блокировок сайтов, настройки VPN и доступа к заблокированным ресурсам. Поддержка всех устройств.",
  keywords: "WARP, конфигуратор, генератор, VPN, обход блокировок, Cloudflare, конфиг, настройка, доступ к сайтам",
  authors: [{ name: "WARP Generator" }],
  openGraph: {
    title: "WARP Конфигуратор - Генератор конфигураций WARP",
    description: "Создавайте конфигурации WARP для обхода блокировок и доступа к заблокированным сайтам",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <AnalyticsLoader/>
        <link rel="icon" href="/cloud.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
