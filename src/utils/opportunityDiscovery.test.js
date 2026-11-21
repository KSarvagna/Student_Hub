import { describe, expect, it } from 'vitest'
import schemes from '../data/schemes.json'
import { discoverOpportunities } from './opportunityDiscovery.js'

describe('opportunity discovery', () => {
  it('searches names, providers, descriptions, benefits and searchable metadata', () => {
    expect(discoverOpportunities(schemes, { query: 'Ambedkar' }).map((item) => item.id))
      .toEqual(['ambedkar-overseas-vidya-nidhi-telangana'])
    expect(discoverOpportunities(schemes, { query: 'Backward Classes Welfare' }).map((item) => item.id))
      .toEqual(['mahatma-jyothiba-phule-overseas-vidya-nidhi-telangana'])
    expect(discoverOpportunities(schemes, { query: 'maintenance fee' }).map((item) => item.id))
      .toEqual(['telangana-post-matric-scholarships'])
    expect(discoverOpportunities(schemes, { query: 'tg' }).map((item) => item.government_level))
      .toContain('state')
  })

  it('sorts by earliest confirmed deadline and leaves missing deadlines last', () => {
    const items = [
      { id: 'no-date', name: 'No date' },
      { id: 'later', name: 'Later', deadline: '2027-02-01' },
      { id: 'earlier', name: 'Earlier', deadline: '2026-11-30' },
    ]
    expect(discoverOpportunities(items, { sortBy: 'deadline' }).map(({ id }) => id))
      .toEqual(['earlier', 'later', 'no-date'])
  })

  it('preserves the supplied recommendation order when no deadline sort is selected', () => {
    const items = [{ id: 'second' }, { id: 'first' }]
    expect(discoverOpportunities(items).map(({ id }) => id)).toEqual(['second', 'first'])
  })
})
