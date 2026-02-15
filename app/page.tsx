"use client"

import Image from "next/image"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Info,
} from "lucide-react"
import { RiTelegram2Line, RiRobot2Line, RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaGlobe, FaRocket } from "react-icons/fa";
import { RxLightningBolt } from "react-icons/rx";
import { EnhancedWarpGenerator } from "@/components/warp-generator"
import { GitHubStarsBadge } from "@/components/github-stars-badge"
import { Badge } from "@/components/ui/badge"

export default function EnhancedHome() {
  const [showNewFormatsAlert, setShowNewFormatsAlert] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 w-full">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Рекламный баннер */}
          <div className="mb-8 relative group">
            <a 
              href="https://t.me/ContinentalVPN_bot?start=Baner" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative"
              data-rybbit-event="ads_click_continentalbot"
            >
              {/* SVG с бегущей пунктирной линией */}
              <svg 
                className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none"
                style={{ left: '-8px', top: '-8px' }}
              >
                <rect
                  x="2"
                  y="2"
                  width="calc(100% - 4px)"
                  height="calc(100% - 4px)"
                  rx="8"
                  fill="none"
                  stroke="#fae966"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  className="marching-ants"
                />
              </svg>
              
              {/* Badge "КЛИКАБЕЛЬНО" */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <div className="px-3 py-1 shadow-lg text-sm font-bold flex items-center gap-2"
                    style={{
                      backgroundColor: '#fae966',
                      color: '#000000',
                      borderRadius: '9999px'
                    }}>
                  <FaRocket /> КЛИКАБЕЛЬНО
                </div>
              </div>
              
              <Image 
                src="/ads.png" 
                alt="Рекламный баннер" 
                width={400} 
                height={100}
                className="rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] relative"
              />
            </a>
          </div>

          {showNewFormatsAlert && (
            <Alert className="alert mb-6 break-words max-w-[400px]">
              <AlertTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                ...
                <Badge variant="secondary" className="ml-2">Новое</Badge>
              </AlertTitle>

              <AlertDescription className="break-words mt-3">
                ...
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
            <Image src="/logo.svg" alt="Логотип" hidden width={300} height={300}/>
            
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
              data-rybbit-event="ads_click_tbbot"
              asChild
              className="hidden w-full bg-[#006fe0] hover:bg-[#0067D0] text-white"
            >
              <a
                href="https://t.me/TriBukvyRoBot?start=warp_site"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaGlobe />
                <span>Обход белых списков</span>
              </a>
            </Button>

            <Button 
              asChild 
              className="w-full bg-[#006fe0] hover:bg-[#0067D0] text-white"
            >
              <a 
                href="https://t.me/findllimonix/68" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <RxLightningBolt />
                Ускорить Telegram медиа
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
        </div>

        <footer className="pb-6 text-center text-sm text-muted-foreground">
          <p>© 2026 • <a href="mailto:llimonix@protonmail.com" className="hover:text-foreground transition-colors">llimonix@protonmail.com</a></p>
        </footer>
      </main>
    </>
  )
}