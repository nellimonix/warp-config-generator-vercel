import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <Alert className="alert mb-6 break-words" style={{display: "none"}}>
          <AlertTitle>Telegram Bot для генерации конфигов WARP</AlertTitle>
          <AlertDescription className="break-words">
            Создал бота для генерации конфигов, если сайт вдруг перестанет работать:{" "}
            <a href="https://t.me/warp_generator_bot" className="font-medium">
              Warp Generator Bot
            </a>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col items-center justify-center gap-6 w-[300px]">
          <Image src="/logo.svg" alt="Логотип" width={300} height={300}/>
          <WarpGenerator/>
          <Button asChild className="w-full">
            <a href="https://t.me/warp_generator_bot">Warp Generator Bot</a>
          </Button>
          <Button asChild className="w-full">
            <a href="https://t.me/findllimonix">Telegram канал</a>
          </Button>
          <Button asChild className="w-full">
            <a href="https://t.me/vuchaev2015">ToporWarp Telegram</a>
          </Button>
          <Button asChild className="w-full">
            <a href="https://github.com/nellimonix/warp-config-generator-vercel">GitHub репозиторий</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, поддержите меня на GitHub, поставив звезду.
          </p>
        </div>
      </main>
  )
}

