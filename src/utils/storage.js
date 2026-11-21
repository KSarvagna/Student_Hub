export const PROFILE_STORAGE_KEY = 'studentHub.profile'
export const SAVED_ITEMS_STORAGE_KEY = 'studentHub.savedItems'
export const CHECKLIST_STORAGE_KEY = 'studentHub.checklistProgress'

const COURSE_LEVELS = ['school', 'intermediate', 'diploma', 'undergraduate', 'postgraduate', 'phd', 'research']
const STREAMS = ['engineering', 'medical', 'arts', 'science', 'commerce', 'law', 'other']
const CATEGORIES = ['general', 'obc', 'sc', 'st', 'ews', 'bc_a', 'bc_b', 'bc_c', 'bc_d', 'bc_e', 'ebc', 'minority', 'disabled']
const RESIDENTIAL_AREAS = ['rural', 'urban']
const GENDERS = ['female', 'male', 'other', 'prefer_not_to_say']
const SCHOOL_TYPES = ['government', 'government_aided', 'local_body', 'other']
const BOOLEAN_PROFILE_FIELDS = [
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

function isOptionalString(value) {
  return value === undefined || value === null || typeof value === 'string'
}

function isOptionalChoice(value, choices) {
  return value === undefined || value === null || value === '' || choices.includes(value)
}

function isOptionalNumber(value, isValid) {
  return value === undefined || value === null || (typeof value === 'number' && Number.isFinite(value) && isValid(value))
}

function isValidProfile(profile) {
  if (profile === null || typeof profile !== 'object' || Array.isArray(profile)) return false

  return (
    isOptionalString(profile.name) &&
    isOptionalChoice(profile.course_level, COURSE_LEVELS) &&
    isOptionalNumber(profile.school_class, (value) => Number.isInteger(value) && value >= 1 && value <= 12) &&
    isOptionalChoice(profile.school_type, SCHOOL_TYPES) &&
    isOptionalChoice(profile.stream, STREAMS) &&
    isOptionalNumber(profile.year_of_study, (value) => Number.isInteger(value) && value >= 1 && value <= 6) &&
    isOptionalString(profile.state) &&
    isOptionalChoice(profile.category, CATEGORIES) &&
    isOptionalChoice(profile.residential_area, RESIDENTIAL_AREAS) &&
    isOptionalChoice(profile.gender, GENDERS) &&
    isOptionalNumber(profile.annual_family_income, (value) => value >= 0) &&
    isOptionalNumber(profile.last_exam_percentage, (value) => value >= 0 && value <= 100) &&
    isOptionalNumber(profile.graduation_percentage, (value) => value >= 0 && value <= 100)
    && BOOLEAN_PROFILE_FIELDS.every((field) =>
      profile[field] === undefined || typeof profile[field] === 'boolean',
    )
  )
}

function getStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function readJson(storage, key) {
  try {
    const value = storage?.getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function isOpportunity(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    typeof value.id === 'string' && value.id.trim() !== '' && typeof value.name === 'string'
}

function uniqueOpportunities(items) {
  const seenIds = new Set()
  return items.filter((item) => {
    if (!isOpportunity(item) || seenIds.has(item.id)) return false
    seenIds.add(item.id)
    return true
  })
}

/** Read saved opportunity snapshots, ignoring malformed entries. */
export function readSavedItems() {
  try {
    const savedItems = readJson(getStorage(), SAVED_ITEMS_STORAGE_KEY)
    return Array.isArray(savedItems) ? uniqueOpportunities(savedItems) : []
  } catch {
    return []
  }
}

/** Persist saved opportunity snapshots under their own storage key. */
export function writeSavedItems(items) {
  try {
    const storage = getStorage()
    if (!storage || !Array.isArray(items) || items.some((item) => !isOpportunity(item))) return false
    storage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(uniqueOpportunities(items)))
    return true
  } catch {
    return false
  }
}

function cleanChecklistProgress(progress) {
  if (progress === null || typeof progress !== 'object' || Array.isArray(progress)) return {}

  return Object.fromEntries(
    Object.entries(progress)
      .filter(([opportunityId, documents]) => opportunityId.trim() !== '' && documents !== null &&
        typeof documents === 'object' && !Array.isArray(documents))
      .map(([opportunityId, documents]) => [
        opportunityId,
        Object.fromEntries(Object.entries(documents).filter(([, checked]) => typeof checked === 'boolean')),
      ]),
  )
}

/** Read checklist flags grouped by opportunity id. */
export function readChecklistProgress() {
  try {
    return cleanChecklistProgress(readJson(getStorage(), CHECKLIST_STORAGE_KEY))
  } catch {
    return {}
  }
}

/** Persist checklist flags separately from both the profile and saved items. */
export function writeChecklistProgress(progress) {
  try {
    const storage = getStorage()
    if (!storage || progress === null || typeof progress !== 'object' || Array.isArray(progress)) return false
    storage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(cleanChecklistProgress(progress)))
    return true
  } catch {
    return false
  }
}

/** Read a valid saved profile, or return null if storage is unavailable or invalid. */
export function readProfile() {
  try {
    const storage = getStorage()
    if (!storage) return null

    const savedValue = storage.getItem(PROFILE_STORAGE_KEY)
    if (!savedValue) return null

    const profile = JSON.parse(savedValue)
    return isValidProfile(profile) ? profile : null
  } catch {
    return null
  }
}

/** Save a profile and report whether the browser accepted the write. */
export function writeProfile(profile) {
  try {
    const storage = getStorage()
    if (!storage || !isValidProfile(profile)) return false

    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

/** Remove the saved profile and report whether the browser accepted the removal. */
export function removeProfile() {
  try {
    const storage = getStorage()
    if (!storage) return false

    storage.removeItem(PROFILE_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
