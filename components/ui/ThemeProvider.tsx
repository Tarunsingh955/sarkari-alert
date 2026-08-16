'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { themes, ThemeName, ThemeColors } from '@/lib/theme'

type ThemeContextValue = {
  themeName: ThemeName
  colors: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: 'dark',
  colors: themes.dark,
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sa_theme') as ThemeName | null
    if (saved === 'light' || saved === 'dark') setThemeName(saved)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('sa_theme', themeName)
    document.body.style.background = themes[themeName].bg
    document.body.style.color = themes[themeName].textPrimary
  }, [themeName, mounted])

  function toggleTheme() {
    setThemeName(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ themeName, colors: themes[themeName], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
