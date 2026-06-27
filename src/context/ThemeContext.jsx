import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'freg'
  })
  const [fading, setFading] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Switch themes behind a brief full-screen crossfade: cover the screen,
  // swap the layout while it's hidden, then reveal the new styling.
  const selectTheme = useCallback((name) => {
    if (name === theme) return
    setFading(true)
    timers.current.push(setTimeout(() => {
      setTheme(name)
      timers.current.push(setTimeout(() => setFading(false), 90))
    }, 300))
  }, [theme])

  const toggleTheme = useCallback(() => {
    selectTheme(theme === 'freg' ? 'grid' : 'freg')
  }, [theme, selectTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, selectTheme }}>
      {children}
      <div className={`theme-fade${fading ? ' theme-fade--on' : ''}`} aria-hidden="true" />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
