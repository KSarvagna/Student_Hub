export const THEME_STORAGE_KEY = 'studentHub.theme'
export const THEME_PREFERENCES = ['light', 'dark', 'system']

export function normalizeThemePreference(value) {
  return THEME_PREFERENCES.includes(value) ? value : 'system'
}

export function resolveTheme(preference, systemPrefersDark) {
  const normalized = normalizeThemePreference(preference)
  return normalized === 'system' ? (systemPrefersDark ? 'dark' : 'light') : normalized
}
