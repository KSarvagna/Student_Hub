import { describe, expect, it } from 'vitest'
import schemes from './schemes.json'
import demoProfiles from './demoProfiles.json'
import { evaluateScheme } from '../engine/eligibility.js'

const scholarship = schemes.find((item) => item.id === 'pm-usp-csss')

const completeProfile = {
  annual_family_income: 450000,
  class12_above_80th_percentile: true,
  regular_course: true,
  receives_other_scholarship: false,
  institution_recognized: true,
  gap_after_class12: false,
  class12_completed_last_academic_year: true,
  year_of_study: 1,
  course_level: 'undergraduate',
}

describe('PM-USP CSSS opportunity eligibility', () => {
  it('marks a complete profile eligible when every listed condition passes', () => {
    expect(evaluateScheme(scholarship, completeProfile)).toMatchObject({
      status: 'eligible',
      failed: [],
      unknown: [],
    })
  })

  it('provides a built-in fictional demo profile that qualifies for CSSS', () => {
    const profile = demoProfiles.find((item) => item.name === 'Fictional CSSS Demo Student')

    expect(profile).toBeDefined()
    expect(evaluateScheme(scholarship, profile)).toMatchObject({
      status: 'eligible',
      failed: [],
      unknown: [],
    })
  })

  it('keeps the six-opportunity Central Government foundation tagged by actual education level', () => {
    const centralScholarships = schemes.filter((item) => item.government_level === 'central')
    expect(centralScholarships.map((item) => item.id)).toEqual([
      'pm-usp-csss',
      'pre-matric-hazardous-occupations',
      'national-means-cum-merit-scholarship',
      'aicte-pragati',
      'top-class-education-sc',
      'national-fellowship-sc',
    ])
    expect(centralScholarships.map((item) => item.education_levels)).toEqual([
      ['undergraduate'], ['school'], ['school'], ['diploma', 'undergraduate'],
      ['undergraduate', 'postgraduate'], ['research'],
    ])
  })

  it('returns needs_info when applicable profile answers are missing', () => {
    const profile = { ...completeProfile }
    delete profile.class12_completed_last_academic_year
    delete profile.institution_recognized

    const result = evaluateScheme(scholarship, profile)
    expect(result.status).toBe('needs_info')
    expect(result.unknown.map((rule) => rule.field)).toEqual([
      'institution_recognized',
      'class12_completed_last_academic_year',
    ])
  })

  it('fails the relevant conditions when profile answers do not meet them', () => {
    const result = evaluateScheme(scholarship, {
      ...completeProfile,
      annual_family_income: 450001,
      regular_course: false,
      course_level: 'diploma',
    })

    expect(result.status).toBe('not_eligible')
    expect(result.failed.map((rule) => rule.field)).toEqual([
      'annual_family_income',
      'regular_course',
      'course_level',
    ])
  })
})
