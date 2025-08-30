declare global {
  interface Window {
    ym: (counterId: number, eventName: string, ...args: any[]) => void
    rybbit?: {
      event: (eventName: string, eventData?: Record<string, any>) => void
    }
  }
}

export function yandexEvent(counterId: number, eventName: string, ...args: any[]) {
  if (typeof window !== "undefined" && window.ym) {
    window.ym.apply(null, [counterId, eventName, ...args])
  } else {
    console.warn("Yandex Metrika not initialized")
  }
}

export function rybbitEvent(eventName: string, title?: string) {
  if (typeof window !== 'undefined' && window.rybbit && typeof window.rybbit.event === 'function') {
    window.rybbit.event(eventName, title ? { buttonTitle: title } : undefined)
  } else {
    console.warn('Rybbit tracking not available.')
  }
}