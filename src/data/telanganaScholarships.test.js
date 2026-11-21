import { describe, expect, it } from 'vitest'
import schemes from './schemes.json'
import { evaluateScheme } from '../engine/eligibility.js'
import { matchesEducationLevel } from '../utils/educationLevels.js'
import { matchesApplicationStatus, matchesGovernmentLevel } from '../utils/opportunityFilters.js'

const ids = [
  'telangana-pre-matric-scholarships',
  'telangana-post-matric-scholarships',
  'ambedkar-overseas-vidya-nidhi-telangana',
  'mahatma-jyothiba-phule-overseas-vidya-nidhi-telangana',
  'telangana-skill-upgradation-assistance',
]
const records = ids.map((id) => schemes.find((item) => item.id === id))
const get = (id) => schemes.find((item) => item.id === id)

const profiles = {
  preMatric: {
    state: 'Telangana', category: 'sc', course_level: 'school', school_class: 8,
    school_type: 'government', receives_other_scholarship: false, annual_family_income: 120000,
  },
  postMatric: {
    state: 'Telangana', category: 'bc_b', course_level: 'intermediate', regular_course: true,
    receives_other_scholarship: false, annual_family_income: 120000,
  },
  ambedkar: {
    state: 'Telangana', category: 'sc', annual_family_income: 400000, course_level: 'postgraduate',
    graduation_percentage: 68, overseas_country_eligible: true, overseas_tests_criteria_met: true,
    overseas_admission_and_visa: true, only_child_in_family: true,
  },
  jyothiba: {
    state: 'Telangana', category: 'bc_b', annual_family_income: 400000, course_level: 'postgraduate',
    graduation_percentage: 68, overseas_country_eligible: true, overseas_tests_criteria_met: true,
    overseas_admission_and_visa: true, only_child_in_family: true,
  },
  skill: {
    state: 'Telangana', category: 'st', annual_family_income: 120000,
    course_level: 'undergraduate', graduation_percentage: 65,
    graduated_or_final_year_qualifying_course: true,
  },
}

describe('Telangana Government scholarship records', () => {
  it('adds five unique, state-scoped Telangana opportunities without changing existing IDs', () => {
    expect(records.every(Boolean)).toBe(true)
    expect(new Set(records.map(({ id }) => id)).size).toBe(5)
    expect(records.map(({ government_level, jurisdiction_scope, state_code }) => [government_level, jurisdiction_scope, state_code]))
      .toEqual(Array.from({ length: 5 }, () => ['state', 'state', 'IN-TG']))
    expect(schemes.filter((item) => item.government_level === 'state').every((item) => item.state_code === 'IN-TG')).toBe(true)
    expect(schemes.some((item) => item.id === 'pm-usp-csss')).toBe(true)
    expect(records.every((item) => item.verified === false && item.verification_status === 'partially_verified' && item.simplified)).toBe(true)
    expect(records.every((item) => item.source_url.startsWith('https://telanganaepass.cgg.gov.in/'))).toBe(true)
    expect(records.every((item) => item.apply_url.startsWith('https://telanganaepass.cgg.gov.in/'))).toBe(true)
  })

  it('classifies each opportunity at its supported education levels', () => {
    expect(matchesEducationLevel(get(ids[0]), 'school')).toBe(true)
    expect(matchesEducationLevel(get(ids[1]), 'school')).toBe(true)
    expect(matchesEducationLevel(get(ids[1]), 'diploma')).toBe(true)
    expect(matchesEducationLevel(get(ids[1]), 'undergraduate')).toBe(true)
    expect(matchesEducationLevel(get(ids[1]), 'postgraduate')).toBe(true)
    expect(matchesEducationLevel(get(ids[1]), 'research')).toBe(true)
    expect(matchesEducationLevel(get(ids[2]), 'postgraduate')).toBe(true)
    expect(matchesEducationLevel(get(ids[3]), 'postgraduate')).toBe(true)
    expect(matchesEducationLevel(get(ids[4]), 'undergraduate')).toBe(true)
    expect(matchesEducationLevel(get(ids[4]), 'postgraduate')).toBe(true)
    expect(matchesEducationLevel(schemes.find((item) => item.id === 'example-scholarship-1'), 'school')).toBe(false)
  })

  it.each([
    ['telangana-pre-matric-scholarships', profiles.preMatric],
    ['telangana-post-matric-scholarships', profiles.postMatric],
    ['ambedkar-overseas-vidya-nidhi-telangana', profiles.ambedkar],
    ['mahatma-jyothiba-phule-overseas-vidya-nidhi-telangana', profiles.jyothiba],
    ['telangana-skill-upgradation-assistance', profiles.skill],
  ])('evaluates sufficient profile for %s as eligible', (id, profile) => {
    expect(evaluateScheme(get(id), profile)).toMatchObject({ status: 'eligible', failed: [], unknown: [] })
  })

  it('returns needs_info for unanswered scheme-specific profile information', () => {
    const profile = { ...profiles.ambedkar }
    delete profile.overseas_tests_criteria_met
    expect(evaluateScheme(get(ids[2]), profile).status).toBe('needs_info')
  })

  it('rejects profiles that fail a represented condition', () => {
    expect(evaluateScheme(get(ids[0]), { ...profiles.preMatric, school_class: 4, school_type: 'other' }).status).toBe('not_eligible')
    expect(evaluateScheme(get(ids[2]), { ...profiles.ambedkar, category: 'general', annual_family_income: 500000 }).status).toBe('not_eligible')
    expect(evaluateScheme(get(ids[4]), { ...profiles.skill, category: 'general', graduation_percentage: 60 }).status).toBe('not_eligible')
  })

  it('filters central and Telangana Government records and application statuses independently', () => {
    expect(matchesGovernmentLevel(get(ids[0]), 'state')).toBe(true)
    expect(matchesGovernmentLevel(get(ids[0]), 'central')).toBe(false)
    expect(matchesGovernmentLevel(get('pm-usp-csss'), 'central')).toBe(true)
    expect(matchesGovernmentLevel(get('example-scholarship-1'), 'unclassified')).toBe(true)
    expect(matchesApplicationStatus(get(ids[1]), 'open')).toBe(true)
    expect(matchesApplicationStatus(get(ids[2]), 'unknown')).toBe(true)
    expect(matchesApplicationStatus(get(ids[0]), 'closed')).toBe(false)
  })
})
