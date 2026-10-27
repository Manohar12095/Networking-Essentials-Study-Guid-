import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        paper: 'var(--paper, #F6F8FB)',
        surface: 'var(--surface, #FFFFFF)',
        ink: 'var(--ink, #14213D)',
        muted: 'var(--muted, #5B6B86)',
        packet: 'var(--packet, #1D6FE0)',
        signal: 'var(--signal, #0F9D8A)',
        mark: 'var(--mark, #FFD84D)',
        alert: 'var(--alert, #E4572E)',
        rule: 'var(--rule, #D8E0EC)',
      },
      fontSize: {
        xs: '14px',
        sm: '16px',
        base: '18px',
        lg: '22px',
        xl: '28px',
        '2xl': '36px',
      },
      screens: {
        sm: '360px',
        md: '640px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '10px',
        full: '999px',
      },
      spacing: {
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
      },
      gap: {
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
      },
      fontFamily: {
        serif: ['Source Serif 4', 'serif'],
        sans: ['Bricolage Grotesque', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      gridTemplateColumns: {
        '32': 'repeat(32, minmax(0, 1fr))',
      },
      lineHeight: {
        tight: '1.4',
        normal: '1.65',
        relaxed: '1.8',
      },
    },
  },
  plugins: [],
}

export default config
