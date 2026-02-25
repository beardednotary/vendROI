import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vr: {
          bg: '#02040A',
          surface: '#070C16',
          orange: '#F97316',
          green: '#22C55E',
          risk: '#FB7185',
          indigo: '#6366F1',
          text: '#F9FAFB',
          'text-secondary': '#9CA3AF',
          muted: '#6B7280',
          border: '#111827',
        },
      },
    },
  },
  plugins: [],
};

export default config;
