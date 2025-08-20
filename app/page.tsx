import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Rss,
  FolderOpen,
  Info,
} from "lucide-react"
import { RiTelegram2Line, RiGithubLine, RiRobot2Line } from "react-icons/ri";
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <>
      <Analytics/>
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
          <Button asChild variant="secondary" className="w-full">
            <a href="https://github.com/nellimonix/warp-config-generator-vercel" target="_blank"><RiGithubLine />GitHub репозиторий</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, поддержите меня на GitHub, поставив звезду.
          </p>
        </div>
      </main>
    </>
  )
}
