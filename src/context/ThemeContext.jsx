import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeThemePreference, resolveTheme, THEME_STORAGE_KEY } from '../utils/theme.js'

const ThemeContext = createContext(null)

function readPreference() {
  try {
    return normalizeThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference)

  const applyTheme = useCallback((value) => {
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
    const theme = resolveTheme(value, systemDark)
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.themePreference = value
    document.documentElement.style.colorScheme = theme
  }, [])

  const changePreference = useCallback((value) => {
    const normalized = normalizeThemePreference(value)
    setPreference(normalized)
    applyTheme(normalized)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalized)
    } catch {
      // The selected theme remains active for this session when storage is unavailable.
    }
  }, [applyTheme])

  useEffect(() => {
    applyTheme(preference)
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return undefined
    const updateForSystem = () => {
      if (preference === 'system') applyTheme('system')
    }
    media.addEventListener?.('change', updateForSystem)
    return () => media.removeEventListener?.('change', updateForSystem)
  }, [applyTheme, preference])

  const value = useMemo(() => ({ preference, setPreference: changePreference }), [preference, changePreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
