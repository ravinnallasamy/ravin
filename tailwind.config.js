/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        surface: '#F3EEE6',
        'surface-raised': '#ECE4D8',
        ink: '#1E2A3A',
        'ink-muted': '#52606D',
        'ink-faint': '#94A0AB',
        border: {
          DEFAULT: '#E2D9CB',
          strong: '#D2C5AF',
        },
        accent: {
          DEFAULT: '#B08968',
          hover: '#96714F',
          subtle: '#F0E6D8',
        },
        success: '#15803D',
        signal: '#B45309',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        h1: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['1.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2-lg': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['1.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h3-lg': ['1.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'mono-label': ['0.8125rem', { lineHeight: '1.6' }],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        glass: '0 8px 32px rgba(30,42,58,0.10)',
        skeu: '0 1px 0 rgba(255,255,255,0.6) inset, 0 -6px 10px rgba(30,42,58,0.08) inset, 0 14px 24px rgba(30,42,58,0.16), 0 2px 4px rgba(30,42,58,0.12)',
        'skeu-sm': '0 1px 0 rgba(255,255,255,0.5) inset, 0 10px 18px rgba(30,42,58,0.14)',
        neu: '8px 8px 18px rgba(180,158,128,0.35), -8px -8px 18px rgba(255,255,255,0.85)',
        'neu-inset': 'inset 5px 5px 10px rgba(180,158,128,0.3), inset -5px -5px 10px rgba(255,255,255,0.7)',
        'neu-sm': '4px 4px 10px rgba(180,158,128,0.3), -4px -4px 10px rgba(255,255,255,0.8)',
      },
      backdropBlur: {
        glass: '16px',
      },
      backgroundImage: {
        'hero-warm': 'linear-gradient(180deg, #FBF8F3 0%, #F3EEE6 55%, #ECE4D8 100%)',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
    },
  },
  plugins: [],
};
