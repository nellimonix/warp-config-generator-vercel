
import WarpGenerator from "@/components/warp-generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-telegram-bg flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-telegram overflow-hidden">
            <div className="bg-telegram-blue px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-white text-lg font-medium">WARP Generator</h1>
                  <p className="text-white/80 text-sm">Генератор конфигураций</p>
                </div>
              </div>
            </div>
            <div className="p-0">
              <WarpGenerator />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
