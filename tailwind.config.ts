import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        amber: {
          50: '#FEF8F0',
          100: '#FAEEDA',
          300: '#FAC775',
          500: '#EF9F27',
          700: '#854F0B',
          900: '#412402',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
