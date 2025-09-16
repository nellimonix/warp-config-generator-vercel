"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Info,
} from "lucide-react"
import { RiTelegram2Line, RiGithubLine, RiRobot2Line } from "react-icons/ri";
import { EnhancedWarpGenerator } from "@/components/warp-generator"
import { GitHubStarsBadge } from "@/components/github-stars-badge"
import { Badge } from "@/components/ui/badge"

export default function EnhancedHome() {
  const [showNewFormatsAlert, setShowNewFormatsAlert] = useState(true);

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