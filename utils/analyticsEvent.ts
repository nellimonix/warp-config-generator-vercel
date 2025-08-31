declare global {
  interface Window {
    rybbit?: {
      event: (eventName: string, eventData?: Record<string, any>) => void
    }
  }
}

export function rybbitEvent(eventName: string, title?: string) {
  if (typeof window !== 'undefined' && window.rybbit && typeof window.rybbit.event === 'function') {
    window.rybbit.event(eventName, title ? { buttonTitle: title } : undefined)
  } else {
    console.warn('Rybbit tracking not available.')
  }
}