import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { WarpGenerator } from "@/components/warp-generator"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <>
      <Analytics/>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
        <Alert className="alert mb-6 break-words" style={{ display: "none" }}>
          <AlertTitle>Mirrors</AlertTitle>
          <AlertDescription className="break-words">
            Сделал сайт с зеркалами этого сайта на случай, если он перестанет работать:{" "}
            <a href="https://warp-mirrors.vercel.app" className="font-medium">
              warp-mirrors.vercel.app
            </a>
          </AlertDescription>
        </Alert>
        <Alert className="alert mb-6 break-words">
          <AlertTitle>Новый способ починить WARP на мобильном интернете с помощью AWG 1.5!</AlertTitle>
          <AlertDescription className="break-words">
            Добавлен новый параметр AmneziaWG 1.5, который работает только в приложении и работает на мобильных устройствах:{" "}
            <a href="https://t.me/findllimonix/55" className="font-medium">
              инструкция по настройке
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
            <a href="https://t.me/+fDYczngHDFplZDli">Telegram канал</a>
          </Button>
          <Button asChild className="w-full">
            <a href="https://github.com/nellimonix/warp-config-generator-vercel">GitHub репозиторий</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Пожалуйста, поддержите меня на GitHub, поставив звезду.
          </p>
        </div>
      </main>
    </>
  )
}
