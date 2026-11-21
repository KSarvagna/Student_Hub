import { describe, expect, it } from 'vitest'
import { normalizeThemePreference, resolveTheme } from './theme.js'

describe('theme preference', () => {
  it('accepts Light and Dark preferences and falls back to System', () => {
    expect(normalizeThemePreference('light')).toBe('light')
    expect(normalizeThemePreference('dark')).toBe('dark')
    expect(normalizeThemePreference('invalid')).toBe('system')
  })

  it('resolves System to the current operating system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })
})
