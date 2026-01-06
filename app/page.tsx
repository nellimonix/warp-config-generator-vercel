"use client"

import Image from "next/image"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Info,
} from "lucide-react"
import { RiTelegram2Line, RiRobot2Line, RiMoneyDollarCircleLine } from "react-icons/ri";
import { RxLightningBolt } from "react-icons/rx";
import { EnhancedWarpGenerator } from "@/components/warp-generator"
import { GitHubStarsBadge } from "@/components/github-stars-badge"
import { Badge } from "@/components/ui/badge"

export default function EnhancedHome() {
  const [showNewFormatsAlert, setShowNewFormatsAlert] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        {/* Уведомление о новых форматах */}
        {showNewFormatsAlert && (
          <Alert className="alert mb-6 break-words">
            <AlertTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Новые форматы конфигураций
              <Badge variant="secondary" className="ml-2">Новое</Badge>
            </AlertTitle>

            <AlertDescription className="break-words mt-3">
              Добавлена поддержка новых форматов: <strong>Throne</strong>, <strong>Clash</strong>, <strong>NekoRay/Exclave</strong>, <strong>Husi</strong>, <strong>Karing/Hiddify</strong>. 
              Выберите нужный формат в настройках конфигурации.
            </AlertDescription>
            
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowNewFormatsAlert(false)}
            >
              Скрыть уведомление
            </Button>
          </Alert>
        )}

        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <Image src="/logo.svg" alt="Логотип" width={300} height={300}/>
          
          {/* Расширенный генератор с поддержкой множественных форматов */}
          <EnhancedWarpGenerator/>

          <Button 
            data-rybbit-event="ads_click_stbot"
            asChild
            className="w-full bg-purple-700 hover:bg-purple-800 text-white"
          >
            <a
              href="https://t.me/SkyTunnel_robot?start=limon-site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <img
                src="https://skytunnel.lol/SkyTunnel%20VPN_files/Logo.png"
                alt="SkyTunnel"
                className="h-6 w-6 relative top-[2px]"
              />

              <span>Обход белых списков</span>
            </a>
          </Button>

          <Button 
            asChild 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            <a href="https://t.me/findllimonix/63" target="_blank" rel="noopener noreferrer">
              <RxLightningBolt />
              Ультимативный конфиг
            </a>
          </Button>
          
          <Button asChild variant="secondary" className="w-full">
            <a href="https://t.me/warp_generator_bot" target="_blank" rel="noopener noreferrer">
              <RiRobot2Line />
              Warp Generator Bot
            </a>
          </Button>
          
          <Button asChild variant="secondary" className="w-full">
            <a href="https://t.me/+fDYczngHDFplZDli" target="_blank" rel="noopener noreferrer">
              <RiTelegram2Line />
              Telegram канал
            </a>
          </Button>

          <Button asChild variant="secondary" className="w-full">
            <a href="https://t.me/warp_generator_bot?start=donate" target="_blank" rel="noopener noreferrer">
              <RiMoneyDollarCircleLine />
              Поддержать проект
            </a>
          </Button>
          
          <GitHubStarsBadge 
            repository="nellimonix/warp-config-generator-vercel" 
            href="https://github.com/nellimonix/warp-config-generator-vercel"
          >
            GitHub репозиторий
          </GitHubStarsBadge>
          
          <p className="text-sm text-muted-foreground text-center">
            Пожалуйста, поддержите меня на GitHub, поставив звезду.
          </p>
        </div>
      </main>
    </>
  )
}