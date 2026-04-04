'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';
import { HCAPTCHA_SITE_KEY } from '@/config/site';

interface CaptchaProps {
  visible: boolean;
  onVerify: (token: string) => void;
}

export function Captcha({ visible, onVerify }: CaptchaProps) {
  const ref = useRef<HCaptcha>(null);

  if (!visible || !HCAPTCHA_SITE_KEY) return null;

  return (
    <div className="mt-3 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
      <HCaptcha
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={onVerify}
        ref={ref}
        theme="dark"
      />
    </div>
  );
}
