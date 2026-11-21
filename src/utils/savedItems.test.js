import { describe, expect, it } from 'vitest'
import {
  addSavedOpportunity,
  removeSavedOpportunity,
  sortSavedOpportunities,
} from './savedItems.js'

const first = { id: 'first', deadline: '2027-02-01' }
const sooner = { id: 'sooner', deadline: '2026-12-01' }
const open = { id: 'open', deadline: null }

describe('saved opportunity helpers', () => {
  it('adds opportunities and prevents duplicate ids', () => {
    const saved = addSavedOpportunity([], first)
    expect(saved).toEqual([first])
    expect(addSavedOpportunity(saved, { ...first, name: 'duplicate' })).toBe(saved)
  })

  it('removes an opportunity by id', () => {
    expect(removeSavedOpportunity([first, sooner], first.id)).toEqual([sooner])
    expect(removeSavedOpportunity([first], 'missing')).toEqual([first])
  })

  it('sorts by earliest deadline and puts undated items last without mutation', () => {
    const saved = [first, open, sooner]
    expect(sortSavedOpportunities(saved)).toEqual([sooner, first, open])
    expect(saved).toEqual([first, open, sooner])
  })
})
