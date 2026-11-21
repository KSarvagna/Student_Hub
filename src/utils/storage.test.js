import { afterEach, describe, expect, it } from 'vitest'
import {
  CHECKLIST_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SAVED_ITEMS_STORAGE_KEY,
  readChecklistProgress,
  readProfile,
  readSavedItems,
  writeChecklistProgress,
  writeProfile,
  writeSavedItems,
} from './storage.js'

afterEach(() => {
  delete globalThis.window
})

function useMemoryStorage() {
  const values = new Map()
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  }
  return values
}

describe('saved item and checklist storage', () => {
  it('persists saved opportunities and reads them back after a simulated reload', () => {
    const values = useMemoryStorage()
    const saved = [{ id: 'sample-1', name: 'Sample opportunity', deadline: null }]
    expect(writeSavedItems(saved)).toBe(true)
    expect(values.has(SAVED_ITEMS_STORAGE_KEY)).toBe(true)
    expect(readSavedItems()).toEqual(saved)
  })

  it('safely handles malformed saved item data and duplicate ids', () => {
    const values = useMemoryStorage()
    values.set(SAVED_ITEMS_STORAGE_KEY, '{bad json')
    expect(readSavedItems()).toEqual([])
    values.set(SAVED_ITEMS_STORAGE_KEY, JSON.stringify([
      { id: 'one', name: 'First' },
      { id: 'one', name: 'Duplicate' },
      null,
    ]))
    expect(readSavedItems()).toEqual([{ id: 'one', name: 'First' }])
  })

  it('persists checklist flags separately and grouped by opportunity id', () => {
    const values = useMemoryStorage()
    const progress = {
      'sample-1': { 'Income certificate': true, 'Exam record': false },
      'sample-2': { 'Identity document': true },
    }
    expect(writeChecklistProgress(progress)).toBe(true)
    expect(values.has(CHECKLIST_STORAGE_KEY)).toBe(true)
    expect(values.has(SAVED_ITEMS_STORAGE_KEY)).toBe(false)
    expect(readChecklistProgress()).toEqual(progress)
  })

  it('ignores invalid checklist data and handles unavailable storage', () => {
    const values = useMemoryStorage()
    values.set(CHECKLIST_STORAGE_KEY, JSON.stringify({
      valid: { document: true, other: 'yes' },
      invalid: null,
      '': { document: true },
    }))
    expect(readChecklistProgress()).toEqual({ valid: { document: true } })

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      get() { throw new Error('storage blocked') },
    })
    expect(readSavedItems()).toEqual([])
    expect(readChecklistProgress()).toEqual({})
    expect(writeSavedItems([])).toBe(false)
    expect(writeChecklistProgress({})).toBe(false)
  })
})

describe('profile storage compatibility', () => {
  const booleanFields = [
    'class12_above_80th_percentile',
    'class12_completed_last_academic_year',
    'regular_course',
    'receives_other_scholarship',
    'gap_after_class12',
    'institution_recognized',
    'special_occupation_eligibility',
    'nmmss_selection_test_passed',
    'technical_course',
    'institution_aicte_approved',
    'centralized_admission',
    'institution_notified_for_top_class',
    'net_or_csir_net_jrf_qualified',
    'graduated_or_final_year_qualifying_course',
    'overseas_country_eligible',
    'overseas_tests_criteria_met',
    'overseas_admission_and_visa',
    'only_child_in_family',
  ]

  it('accepts older profiles without the optional boolean fields', () => {
    const values = useMemoryStorage()
    const olderProfile = { name: 'Older profile', course_level: 'undergraduate' }
    values.set(PROFILE_STORAGE_KEY, JSON.stringify(olderProfile))
    expect(readProfile()).toEqual(olderProfile)
  })

  it('accepts the school education level and validates an optional class number', () => {
    useMemoryStorage()
    expect(writeProfile({ course_level: 'school', school_class: 8, school_type: 'government' })).toBe(true)
    expect(writeProfile({ course_level: 'school', school_class: 13 })).toBe(false)
  })

  it('accepts Telangana course, community, residence, and graduation fields while retaining old profiles', () => {
    const values = useMemoryStorage()
    const olderProfile = { name: 'Older profile', course_level: 'undergraduate', category: 'obc' }
    values.set(PROFILE_STORAGE_KEY, JSON.stringify(olderProfile))
    expect(readProfile()).toEqual(olderProfile)

    const expandedProfile = {
      course_level: 'intermediate',
      category: 'bc_b',
      residential_area: 'rural',
      graduation_percentage: 60.5,
      overseas_admission_and_visa: true,
    }
    expect(writeProfile(expandedProfile)).toBe(true)
    expect(readProfile()).toEqual(expandedProfile)
  })

  it('rejects invalid Telangana field values and graduation percentages', () => {
    useMemoryStorage()
    expect(writeProfile({ category: 'bc_f' })).toBe(false)
    expect(writeProfile({ residential_area: 'village' })).toBe(false)
    expect(writeProfile({ course_level: 'intermediate_school' })).toBe(false)
    expect(writeProfile({ graduation_percentage: 101 })).toBe(false)
    expect(writeProfile({ overseas_tests_criteria_met: 'yes' })).toBe(false)
  })

  it.each([true, false])('persists boolean answer %s and preserves other localStorage data', (answer) => {
    const values = useMemoryStorage()
    const profile = Object.fromEntries(booleanFields.map((field) => [field, answer]))
    const savedItems = [{ id: 'saved', name: 'Saved item' }]
    const checklist = { saved: { document: true } }
    writeSavedItems(savedItems)
    writeChecklistProgress(checklist)

    expect(writeProfile(profile)).toBe(true)
    expect(readProfile()).toEqual(profile)
    expect(values.get(SAVED_ITEMS_STORAGE_KEY)).toBe(JSON.stringify(savedItems))
    expect(readSavedItems()).toEqual(savedItems)
    expect(readChecklistProgress()).toEqual(checklist)
  })

  it('rejects non-boolean values for each optional boolean field', () => {
    useMemoryStorage()
    for (const field of booleanFields) {
      expect(writeProfile({ [field]: 'false' })).toBe(false)
    }
  })
})
