import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const TOKENS = {
  colors: {
    primary: '#00D4FF',
    primaryHover: '#33DCFF',
    secondary: '#7C3AED',
    secondaryHover: '#9055F6',
    success: '#39E58C',
    warning: '#F59E0B',
    danger: '#EF4444',
    bg: '#0B0F19',
    surface: '#131A2B',
    surfaceLight: '#1B243B',
    surfaceBorder: '#23304E',
    text: '#E8EEF8',
    textDim: '#8B9BB8',
    textMuted: '#5F708F',
  },
  shadows: {
    glowCyan: '0 0 45px rgba(0, 212, 255, 0.22)',
    glowCyanSubtle: '0 0 25px rgba(0, 212, 255, 0.12)',
    glowViolet: '0 0 45px rgba(124, 58, 237, 0.25)',
    glowSuccess: '0 0 35px rgba(57, 229, 140, 0.2)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
} as const;
