/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        surface: '#FAFAFA',
        'surface-raised': '#F4F4F5',
        ink: '#0A0A0B',
        'ink-muted': '#52525B',
        'ink-faint': '#A1A1AA',
        border: {
          DEFAULT: '#E4E4E7',
          strong: '#D4D4D8',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          subtle: '#EEF2FF',
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
