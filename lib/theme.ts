// Central color palette for both themes. Every page will eventually pull
// its colors from here (via useTheme()) instead of hardcoding hex values,
// so switching theme = swapping this object, not editing every file.
export type ThemeColors = {
  bg: string
  cardBg: string
  cardBorder: string
  cardShadow: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accent: string
  accentDark: string
  inputBg: string
}

export const themes: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    bg: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    cardShadow: 'rgba(0,0,0,0.35)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#f59e0b',
    accentDark: '#d97706',
    inputBg: '#0f172a',
  },
  light: {
    bg: '#eef2f7',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    cardShadow: 'rgba(15,23,42,0.08)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#f59e0b',
    accentDark: '#d97706',
    inputBg: '#f1f5f9',
  },
}

export type ThemeName = keyof typeof themes