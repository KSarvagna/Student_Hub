import { describe, expect, it } from 'vitest'
import { toFormValues, toProfile } from './ProfileForm.jsx'

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

describe('optional profile boolean fields', () => {
  it('converts Yes and No choices to booleans', () => {
    const values = Object.fromEntries(booleanFields.map((field, index) => [
      field,
      index % 2 === 0 ? 'true' : 'false',
    ]))
    const profile = toProfile({ ...toFormValues(null), ...values })

    expect(profile.class12_above_80th_percentile).toBe(true)
    expect(profile.class12_completed_last_academic_year).toBe(false)
    expect(profile.regular_course).toBe(true)
    expect(profile.receives_other_scholarship).toBe(false)
    expect(profile.gap_after_class12).toBe(true)
    expect(profile.institution_recognized).toBe(false)
    expect(profile.overseas_country_eligible).toBe(true)
    expect(profile.only_child_in_family).toBe(false)
  })

  it('omits unanswered fields rather than converting them to false', () => {
    const profile = toProfile({
      ...toFormValues(null),
      ...Object.fromEntries(booleanFields.map((field) => [field, ''])),
    })
    for (const field of booleanFields) {
      expect(Object.hasOwn(profile, field)).toBe(false)
    }
  })

  it('preselects existing boolean values while editing and leaves missing values unanswered', () => {
    const values = toFormValues({ class12_completed_last_academic_year: true, regular_course: true, gap_after_class12: false })
    expect(values.class12_completed_last_academic_year).toBe('true')
    expect(values.regular_course).toBe('true')
    expect(values.gap_after_class12).toBe('false')
    for (const field of booleanFields.filter((field) => !['class12_completed_last_academic_year', 'regular_course', 'gap_after_class12'].includes(field))) {
      expect(values[field]).toBe('')
    }
  })

  it('preserves existing profile fields when saving with new answers', () => {
    const existing = { name: 'Student', course_level: 'undergraduate', regular_course: true }
    const values = toFormValues(existing)
    const nextProfile = toProfile(values)
    expect(nextProfile).toMatchObject(existing)
  })

  it('converts school class input to a number', () => {
    const nextProfile = toProfile({ ...toFormValues(null), course_level: 'school', school_class: '8' })
    expect(nextProfile.course_level).toBe('school')
    expect(nextProfile.school_class).toBe(8)
  })

  it('converts graduation marks to a number and preserves optional area/community choices', () => {
    const profile = toProfile({
      ...toFormValues(null),
      course_level: 'intermediate',
      category: 'bc_b',
      residential_area: 'rural',
      graduation_percentage: '64.5',
    })

    expect(profile).toMatchObject({
      course_level: 'intermediate',
      category: 'bc_b',
      residential_area: 'rural',
      graduation_percentage: 64.5,
    })
  })

  it('leaves unanswered Telangana-specific boolean answers absent', () => {
    const profile = toProfile(toFormValues(null))
    for (const field of booleanFields.slice(-5)) {
      expect(Object.hasOwn(profile, field)).toBe(false)
    }
  })
})
