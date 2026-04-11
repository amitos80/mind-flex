import globalConfig from '@extension/tailwindcss-config';
import type { Config } from 'tailwindcss';

export default {
  content: ['lib/**/*.tsx'],
  presets: [globalConfig],
  theme: {
    extend: {
      colors: {
        // Senior theme tokens (default / high-contrast)
        'mf-primary': 'var(--mf-primary, #1D4ED8)',
        'mf-primary-light': 'var(--mf-primary-light, #DBEAFE)',
        'mf-primary-dark': 'var(--mf-primary-dark, #1E3A8A)',
        'mf-accent': 'var(--mf-accent, #1D4ED8)',
        'mf-surface': 'var(--mf-surface, #FFFFFF)',
        'mf-surface-alt': 'var(--mf-surface-alt, #F8FAFC)',
        'mf-text': 'var(--mf-text, #0F172A)',
        'mf-text-muted': 'var(--mf-text-muted, #334155)',
      },
      borderRadius: {
        'mf-md': 'var(--mf-radius-md, 0.5rem)',
        'mf-lg': 'var(--mf-radius-lg, 0.75rem)',
      },
      minHeight: {
        'mf-touch': 'var(--mf-touch-target, 3rem)',
      },
    },
  },
} satisfies Config;
