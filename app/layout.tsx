import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import AnalyticsLoader from "@/components/rybbit-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WARP Конфигуратор - Генератор конфигураций Cloudflare WARP",
  description: "Удобный генератор конфигураций Cloudflare WARP. Создавайте конфиги для оптимизации сетевого подключения, повышения безопасности и защиты трафика. Поддержка всех платформ.",
  keywords: "WARP, Cloudflare, конфигуратор, генератор конфигураций, сетевая безопасность, защита трафика, DNS, оптимизация сети",
  authors: [{ name: "WARP Generator" }],
  openGraph: {
    title: "WARP Конфигуратор - Cloudflare WARP",
    description: "Генератор конфигураций Cloudflare WARP для оптимизации и защиты сетевого подключения",
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
    <html lang="ru" className="dark" style={{ colorScheme: "dark" }}>
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
