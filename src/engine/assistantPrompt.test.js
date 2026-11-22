import { describe, expect, it } from 'vitest'
import schemes from '../data/schemes.json'
import { buildAssistantInstruction } from './assistantPrompt.js'

describe('scholarship assistant instructions', () => {
  it.each(['English', 'Telugu', 'Hindi'])('selects %s as the response language', (language) => {
    expect(buildAssistantInstruction(language, schemes)).toContain(`Respond in ${language}.`)
  })

  it('includes scholarship context and handles missing or unverified facts honestly', () => {
    const prompt = buildAssistantInstruction('English', schemes)
    expect(prompt).toContain('PM-USP Central Sector Scheme of Scholarship')
    expect(prompt).toContain('If a field is empty, unavailable, contradictory')
    expect(prompt).toContain('never guess')
    expect(prompt).toContain('"documents":[]')
  })
})
