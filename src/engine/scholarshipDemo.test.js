import { describe, expect, it } from 'vitest'
import schemes from '../data/schemes.json'
import { createScholarshipDemoAnswer } from './scholarshipDemo.js'

describe('local scholarship demo answers', () => {
  it('uses the matching catalogue entry and labels unavailable documents honestly', () => {
    const answer = createScholarshipDemoAnswer('What benefits and documents are listed for PM-USP CSSS?', schemes)

    expect(answer).toContain('PM-USP Central Sector Scheme of Scholarship')
    expect(answer).toContain('₹12,000 per year')
    expect(answer).toContain('No document list is provided in this catalogue entry.')
    expect(answer).not.toContain('example.com')
  })

  it('does not return placeholder scholarship records as facts', () => {
    const answer = createScholarshipDemoAnswer('What scholarships are available?', schemes)

    expect(answer).not.toContain('placeholder')
    expect(answer).not.toContain('Example Student Scholarship')
  })
})
