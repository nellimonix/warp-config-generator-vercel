"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Rss,
  FolderOpen,
  Info,
  Star,
} from "lucide-react"
import { RiTelegram2Line, RiGithubLine, RiRobot2Line } from "react-icons/ri";
import { WarpGenerator } from "@/components/warp-generator"

export default function Home() {
  const [starCount, setStarCount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/nellimonix/warp-config-generator-vercel')
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
        }
      } catch (error) {
        console.error('Ошибка при получении количества звезд:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStars()
  }, [])

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <Alert className="alert mb-6 break-words">
          <AlertTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            WARP на мобильном интернете
          </AlertTitle>

          <AlertDescription className="break-words mt-3">
            Добавлен новый параметр <strong>AmneziaWG 1.5</strong>, который работает только
            в приложении <strong>AmneziaVPN</strong> и на мобильных устройствах:{" "}
            <a
              href="https://t.me/findllimonix/55"
              className="font-medium text-gray-400 hover:underline"
            >
              инструкция по настройке
            </a>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <Image src="/logo.svg" alt="Логотип" width={300} height={300}/>
          <WarpGenerator/>
          <Button asChild variant="secondary" className="w-full">
            <a href="https://t.me/warp_generator_bot" target="_blank"><RiRobot2Line />Warp Generator Bot</a>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <a href="https://t.me/+fDYczngHDFplZDli" target="_blank"><RiTelegram2Line />Telegram канал</a>
          </Button>
          <Button asChild variant="secondary" className="w-full relative">
            <a href="https://github.com/nellimonix/warp-config-generator-vercel" target="_blank" className="flex items-center gap-2">
              <RiGithubLine />
              GitHub репозиторий
              {!loading && starCount !== null && (
                <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1.5 py-0.5 rounded-[5px] min-w-[20px] text-center font-medium">
                  ★ {starCount}
                </div>
              )}
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, поддержите меня на GitHub, поставив звезду.
          </p>
        </div>
      </main>
    </>
  )
}