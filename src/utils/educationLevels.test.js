import { describe, expect, it } from 'vitest'
import { matchesEducationLevel, EDUCATION_LEVEL_OPTIONS } from './educationLevels.js'
import schemes from '../data/schemes.json'

describe('education-level catalogue filters', () => {
  it('supports every level in the expansion scope', () => {
    expect(EDUCATION_LEVEL_OPTIONS.map(({ value }) => value)).toEqual([
      'all', 'school', 'diploma', 'undergraduate', 'postgraduate', 'research', 'unclassified',
    ])
  })

  it('matches only explicitly listed opportunity levels', () => {
    const csss = schemes.find((item) => item.id === 'pm-usp-csss')
    expect(matchesEducationLevel(csss, 'undergraduate')).toBe(true)
    expect(matchesEducationLevel(csss, 'postgraduate')).toBe(false)
    expect(matchesEducationLevel(csss, 'all')).toBe(true)
  })

  it('keeps unclassified sample records separate from specific education levels', () => {
    const placeholder = schemes.find((item) => item.id === 'example-scholarship-1')
    expect(matchesEducationLevel(placeholder, 'school')).toBe(false)
    expect(matchesEducationLevel(placeholder, 'unclassified')).toBe(true)
  })
})
