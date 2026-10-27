/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '375px',
      },
      spacing: {
        18: '4.5rem',
      },
      colors: {
        primary: {
          DEFAULT: '#00D4FF',
          hover: '#33DCFF',
          dark: '#0099BA',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          hover: '#9055F6',
          dark: '#5B21B6',
        },
        success: '#39E58C',
        surface: {
          DEFAULT: '#131A2B',
          light: '#1B243B',
          dark: '#0B0F19',
          border: '#23304E',
        },
        text: {
          DEFAULT: '#E8EEF8',
          dim: '#8B9BB8',
          muted: '#5F708F',
        },
      },
      boxShadow: {
        glowCyan: '0 0 60px rgba(0, 212, 255, 0.22)',
        glowViolet: '0 0 60px rgba(124, 58, 237, 0.25)',
        glowDual: '0 0 70px rgba(0,212,255,0.18), 0 0 70px rgba(124,58,237,0.2)',
      },
      borderRadius: {
        xl2: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
