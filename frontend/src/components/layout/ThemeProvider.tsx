'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Read from localStorage or system preference
    const stored = localStorage.getItem('blogcraft-theme') as Theme | null
    if (stored) {
      setTimeout(() => setTheme(stored), 0)
      document.documentElement.setAttribute('data-theme', stored)
    } else {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTimeout(() => setTheme(system), 0)
      document.documentElement.setAttribute('data-theme', system)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('blogcraft-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
