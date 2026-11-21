import { afterEach, describe, expect, it } from 'vitest'
import demoProfiles from '../data/demoProfiles.json'
import {
  getSelectedDemoProfileIndex,
  selectDemoProfile,
} from './demoProfiles.js'
import {
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
}

describe('demo profile selector synchronization', () => {
  it.each(demoProfiles.map((profile, index) => [String(index), profile]))(
    'selects demo option %s when the current profile matches',
    (index, profile) => {
      expect(getSelectedDemoProfileIndex(profile, demoProfiles)).toBe(index)
    },
  )

  it('clears the selected option when no demo profile matches', () => {
    expect(getSelectedDemoProfileIndex(null, demoProfiles)).toBe('')
    expect(getSelectedDemoProfileIndex({ ...demoProfiles[0], name: 'Edited student' }, demoProfiles)).toBe('')
    expect(getSelectedDemoProfileIndex({ ...demoProfiles[0], extra: true }, demoProfiles)).toBe('')
  })

  it.each(demoProfiles.map((profile, index) => [String(index), profile]))(
    'loads demo profile %s through the profile update callback',
    (index, profile) => {
      let updatedProfile
      expect(selectDemoProfile(index, demoProfiles, (nextProfile) => { updatedProfile = nextProfile })).toBe(true)
      expect(updatedProfile).toEqual(profile)
      expect(getSelectedDemoProfileIndex(updatedProfile, demoProfiles)).toBe(index)
    },
  )

  it('switches and persists the profile while leaving saved items and checklists unchanged', () => {
    useMemoryStorage()
    const savedItems = [{ id: 'sample-opportunity', name: 'Sample opportunity', deadline: null }]
    const checklist = { 'sample-opportunity': { 'Example document': true } }
    writeSavedItems(savedItems)
    writeChecklistProgress(checklist)

    const updates = []
    expect(selectDemoProfile('2', demoProfiles, (profile) => {
      updates.push(profile)
      writeProfile(profile)
    })).toBe(true)

    expect(updates).toEqual([demoProfiles[2]])
    expect(readProfile()).toEqual(demoProfiles[2])
    expect(getSelectedDemoProfileIndex(readProfile(), demoProfiles)).toBe('2')
    expect(readSavedItems()).toEqual(savedItems)
    expect(readChecklistProgress()).toEqual(checklist)
  })

  it('does not update the profile for an empty or invalid selection', () => {
    const updateProfile = () => { throw new Error('Profile should not change') }
    expect(selectDemoProfile('', demoProfiles, updateProfile)).toBe(false)
    expect(selectDemoProfile('8', demoProfiles, updateProfile)).toBe(false)
  })
})
