import type { Config } from 'tailwindcss';

const seniorTheme = {
  colors: {
    primary: '#1D4ED8',
    'primary-light': '#DBEAFE',
    'primary-dark': '#1E3A8A',
    surface: '#FFFFFF',
    'surface-alt': '#F8FAFC',
    text: '#0F172A',
    'text-muted': '#334155',
  },
  fontSize: {
    base: ['1.125rem', { lineHeight: '1.75rem' }],
    lg: ['1.25rem', { lineHeight: '1.875rem' }],
    xl: ['1.5rem', { lineHeight: '2rem' }],
  },
  borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem' },
  minHeight: { touch: '3rem' },
};

const juniorTheme = {
  colors: {
    primary: '#16A34A',
    'primary-light': '#DCFCE7',
    'primary-dark': '#15803D',
    accent: '#FACC15',
    'accent-dark': '#CA8A04',
    surface: '#FFFFFF',
    'surface-alt': '#F0FDF4',
    text: '#14532D',
    'text-muted': '#166534',
  },
  fontSize: {
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.375rem', { lineHeight: '2rem' }],
  },
  borderRadius: { DEFAULT: '1rem', lg: '1.5rem', full: '9999px' },
  minHeight: { touch: '2.75rem' },
};

export default {
  theme: {
    extend: {
      minHeight: {
        ...seniorTheme.minHeight,
      },
    },
  },
  plugins: [],
  // Theme variants resolved at the UI layer via a `data-theme` attribute.
  // Usage: <html data-theme="senior"> or <html data-theme="junior">
  theme_presets: { senior: seniorTheme, junior: juniorTheme },
} as Omit<Config, 'content'> & { theme_presets: Record<string, unknown> };
