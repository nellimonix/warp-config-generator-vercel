'use client';

import { useEffect, useRef, useState } from 'react';
import type { AltchaWidgetElement } from 'altcha';
import type {} from 'altcha/types/react';

interface CaptchaProps {
  onVerify: (token: string) => void;
}

interface AltchaEventDetail {
  payload?: string;
  state?: string;
}

export function Captcha({ onVerify }: CaptchaProps) {
  const ref = useRef<AltchaWidgetElement>(null);
  const submitted = useRef(false);
  const [challenge, setChallenge] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      import('altcha'),
      import('altcha/i18n/ru'),
      fetch('/api/captcha/challenge', { method: 'POST', cache: 'no-store' }),
    ])
      .then(async ([, , response]) => {
        if (!active) return;
        if (response.status === 204) {
          submitted.current = true;
          onVerify('');
          return;
        }
        if (!response.ok) throw new Error('Challenge request failed');
        setChallenge(JSON.stringify(await response.json()));
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить проверку. Попробуйте ещё раз.');
      });

    return () => {
      active = false;
    };
  }, [onVerify]);

  useEffect(() => {
    const widget = ref.current;
    if (!widget || !challenge) return;

    const handleVerified = (event: Event) => {
      const payload = (event as CustomEvent<AltchaEventDetail>).detail?.payload;
      if (!submitted.current && payload) {
        submitted.current = true;
        onVerify(payload);
      }
    };
    const handleStateChange = (event: Event) => {
      const state = (event as CustomEvent<AltchaEventDetail>).detail?.state;
      if (state === 'error' || state === 'expired') {
        setError('Проверка не выполнена. Попробуйте ещё раз.');
      }
    };

    widget.addEventListener('verified', handleVerified);
    widget.addEventListener('statechange', handleStateChange);
    return () => {
      widget.removeEventListener('verified', handleVerified);
      widget.removeEventListener('statechange', handleStateChange);
    };
  }, [challenge, onVerify]);

  if (error) {
    return <p className="max-w-[280px] text-center text-[13px] text-[var(--error)]">{error}</p>;
  }

  if (!challenge) {
    return (
      <div className="flex h-[74px] w-[280px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-2)] text-[13px] text-[var(--text-muted)]">
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[var(--text-dim)] border-b-transparent" />
        Загрузка проверки...
      </div>
    );
  }

  return (
    <altcha-widget
      ref={ref}
      challenge={challenge}
      language="ru"
      theme="dark"
      type="checkbox"
      workers={4}
      configuration={JSON.stringify({ minDuration: 500, timeout: 30_000 })}
      suppressHydrationWarning
      style={{
        '--altcha-color-base': 'var(--surface-2)',
        '--altcha-color-base-content': 'var(--text)',
        '--altcha-border-color': 'var(--gray-600)',
        '--altcha-color-neutral': 'var(--surface-3)',
        '--altcha-color-neutral-content': 'var(--text-muted)',
        '--altcha-color-primary': 'var(--amber-700)',
        '--altcha-color-primary-content': 'var(--amber-300)',
        '--altcha-color-success': 'var(--success)',
        '--altcha-border-radius': 'var(--radius-md)',
        '--altcha-max-width': '280px',
      }}
    />
  );
}
