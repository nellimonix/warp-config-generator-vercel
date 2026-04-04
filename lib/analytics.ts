declare global {
  interface Window {
    rybbit?: {
      event: (name: string, data?: Record<string, any>) => void;
    };
  }
}

export function trackEvent(name: string, title?: string) {
  if (typeof window !== 'undefined' && window.rybbit?.event) {
    window.rybbit.event(name, title ? { buttonTitle: title } : undefined);
  }
}
