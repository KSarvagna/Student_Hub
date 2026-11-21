import { useEffect, useState } from 'react'
import { useProfile } from '../context/ProfileContext.jsx'

const SELECT_FIELDS = {
  boolean: [
    ['true', 'Yes'],
    ['false', 'No'],
  ],
  school_type: [
    ['government', 'Government'],
    ['government_aided', 'Government-aided'],
    ['local_body', 'Local body'],
    ['other', 'Other'],
  ],
  course_level: [
    ['school', 'School (Class 1–12)'],
    ['intermediate', 'Intermediate (Classes 11–12)'],
    ['diploma', 'Diploma'],
    ['undergraduate', 'Undergraduate'],
    ['postgraduate', 'Postgraduate'],
    ['phd', 'PhD'],
    ['research', 'Other research programme'],
  ],
  stream: [
    ['engineering', 'Engineering'],
    ['medical', 'Medical'],
    ['arts', 'Arts'],
    ['science', 'Science'],
    ['commerce', 'Commerce'],
    ['law', 'Law'],
    ['other', 'Other'],
  ],
  category: [
    ['general', 'General'],
    ['obc', 'OBC'],
    ['sc', 'SC'],
    ['st', 'ST'],
    ['ews', 'EWS'],
    ['bc_a', 'BC-A'],
    ['bc_b', 'BC-B'],
    ['bc_c', 'BC-C'],
    ['bc_d', 'BC-D'],
    ['bc_e', 'BC-E'],
    ['ebc', 'EBC'],
    ['minority', 'Minority community'],
    ['disabled', 'Person with disability (ePASS category)'],
  ],
  residential_area: [
    ['rural', 'Rural'],
    ['urban', 'Urban'],
  ],
  gender: [
    ['female', 'Female'],
    ['male', 'Male'],
    ['other', 'Other'],
    ['prefer_not_to_say', 'Prefer not to say'],
  ],
}

const FORM_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autocomplete: 'name' },
  { name: 'course_level', label: 'Course level', options: SELECT_FIELDS.course_level },
  { name: 'school_class', label: 'Current school class (if applicable)', type: 'number', min: 1, max: 12, step: 1 },
  { name: 'school_type', label: 'School type', options: SELECT_FIELDS.school_type },
  { name: 'stream', label: 'Stream', options: SELECT_FIELDS.stream },
  { name: 'year_of_study', label: 'Year of study', type: 'number', min: 1, max: 6, step: 1 },
  { name: 'state', label: 'State or union territory', type: 'text', autocomplete: 'address-level1' },
  { name: 'category', label: 'Category', options: SELECT_FIELDS.category },
  { name: 'residential_area', label: 'Residential area (for applicable ePASS income criteria)', options: SELECT_FIELDS.residential_area },
  { name: 'gender', label: 'Gender', options: SELECT_FIELDS.gender },
  { name: 'annual_family_income', label: 'Annual family income (\u20B9)', type: 'number', min: 0, step: 'any' },
  { name: 'last_exam_percentage', label: 'Last exam percentage', type: 'number', min: 0, max: 100, step: 'any' },
  { name: 'graduation_percentage', label: 'Graduation or qualifying degree percentage', type: 'number', min: 0, max: 100, step: 'any' },
  { name: 'class12_above_80th_percentile', label: 'Class 12 result is above the board’s 80th percentile cutoff', options: SELECT_FIELDS.boolean },
  { name: 'class12_completed_last_academic_year', label: 'Completed Class 12 in the last academic year', options: SELECT_FIELDS.boolean },
  { name: 'regular_course', label: 'Enrolled in a regular course', options: SELECT_FIELDS.boolean },
  { name: 'receives_other_scholarship', label: 'Receives another scholarship or fee reimbursement', options: SELECT_FIELDS.boolean },
  { name: 'gap_after_class12', label: 'Took a gap after Class 12', options: SELECT_FIELDS.boolean },
  { name: 'institution_recognized', label: 'Institution meets the scheme recognition requirements', options: SELECT_FIELDS.boolean },
  { name: 'special_occupation_eligibility', label: 'Parent or guardian works in an occupation covered by the pre-matric scheme', options: SELECT_FIELDS.boolean },
  { name: 'nmmss_selection_test_passed', label: 'Passed the required NMMSS selection tests', options: SELECT_FIELDS.boolean },
  { name: 'technical_course', label: 'Course is a technical programme', options: SELECT_FIELDS.boolean },
  { name: 'institution_aicte_approved', label: 'Institution is AICTE-approved', options: SELECT_FIELDS.boolean },
  { name: 'centralized_admission', label: 'Admission was through the centralized government process', options: SELECT_FIELDS.boolean },
  { name: 'institution_notified_for_top_class', label: 'Institution is on the current Top Class SC notified list', options: SELECT_FIELDS.boolean },
  { name: 'net_or_csir_net_jrf_qualified', label: 'Qualified UGC-NET-JRF or Joint CSIR-UGC NET-JRF', options: SELECT_FIELDS.boolean },
  { name: 'graduated_or_final_year_qualifying_course', label: 'Graduated or studying in the final year of a qualifying course', options: SELECT_FIELDS.boolean },
  { name: 'overseas_country_eligible', label: 'Overseas study destination is on the scheme’s eligible-country list', options: SELECT_FIELDS.boolean },
  { name: 'overseas_tests_criteria_met', label: 'Meets the scheme’s required GRE/GMAT and English proficiency test criteria', options: SELECT_FIELDS.boolean },
  { name: 'overseas_admission_and_visa', label: 'Has the required foreign university admission document and visa', options: SELECT_FIELDS.boolean },
  { name: 'only_child_in_family', label: 'No other child in the family has claimed this scheme', options: SELECT_FIELDS.boolean },
]

export function toFormValues(profile) {
  return Object.fromEntries(FORM_FIELDS.map(({ name }) => [
    name,
    typeof profile?.[name] === 'boolean' ? String(profile[name]) : profile?.[name] ?? '',
  ]))
}

function validate(values) {
  const errors = {}
  const year = values.year_of_study.trim()
  const schoolClass = values.school_class.trim()
  const income = values.annual_family_income.trim()
  const percentage = values.last_exam_percentage.trim()
  const graduationPercentage = values.graduation_percentage.trim()

  if (year !== '') {
    const number = Number(year)
    if (!Number.isInteger(number) || number < 1 || number > 6) {
      errors.year_of_study = 'Enter a whole number from 1 to 6.'
    }
  }

  if (schoolClass !== '') {
    const number = Number(schoolClass)
    if (!Number.isInteger(number) || number < 1 || number > 12) {
      errors.school_class = 'Enter a whole number from 1 to 12.'
    }
  }

  if (income !== '') {
    const number = Number(income)
    if (!Number.isFinite(number) || number < 0) {
      errors.annual_family_income = 'Enter a number that is zero or greater.'
    }
  }

  if (percentage !== '') {
    const number = Number(percentage)
    if (!Number.isFinite(number) || number < 0 || number > 100) {
      errors.last_exam_percentage = 'Enter a percentage from 0 to 100.'
    }
  }

  if (graduationPercentage !== '') {
    const number = Number(graduationPercentage)
    if (!Number.isFinite(number) || number < 0 || number > 100) {
      errors.graduation_percentage = 'Enter a percentage from 0 to 100.'
    }
  }

  return errors
}

export function toProfile(values) {
  const profile = {}

  for (const { name } of FORM_FIELDS) {
    const value = values[name].trim()
    if (value === '') continue

    if (BOOLEAN_PROFILE_FIELDS.includes(name)) {
      profile[name] = value === 'true'
    } else {
      profile[name] = ['year_of_study', 'school_class', 'annual_family_income', 'last_exam_percentage', 'graduation_percentage'].includes(name)
        ? Number(value)
        : value
    }
  }

  return profile
}

const BOOLEAN_PROFILE_FIELDS = [
  'class12_above_80th_percentile', 'class12_completed_last_academic_year', 'regular_course',
  'receives_other_scholarship', 'gap_after_class12', 'institution_recognized',
  'special_occupation_eligibility', 'nmmss_selection_test_passed', 'technical_course',
  'institution_aicte_approved', 'centralized_admission', 'institution_notified_for_top_class',
  'net_or_csir_net_jrf_qualified',
  'graduated_or_final_year_qualifying_course', 'overseas_country_eligible',
  'overseas_tests_criteria_met', 'overseas_admission_and_visa', 'only_child_in_family',
]

const inputClassName = 'min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25'

export default function ProfileForm({ onCancel, onSave }) {
  const { profile, createProfile, updateProfile } = useProfile()
  const [values, setValues] = useState(() => toFormValues(profile))
  const [errors, setErrors] = useState({})
  const [saveNotice, setSaveNotice] = useState('')

  useEffect(() => {
    setValues(toFormValues(profile))
  }, [profile])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSaveNotice('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const nextProfile = toProfile(values)
    const wasSaved = profile ? updateProfile(nextProfile) : createProfile(nextProfile)
    setSaveNotice(
      wasSaved
        ? 'Your profile is saved in this browser.'
        : 'Browser storage is unavailable. Your profile is available for this session only.',
    )
    onSave?.(nextProfile)
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-brand-card p-5 sm:p-7" aria-labelledby="profile-form-title">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Your profile</p>
        <h2 id="profile-form-title" className="mt-1 text-2xl font-bold text-slate-950">
          {profile ? 'Update your details' : 'Tell us about yourself'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Every field is optional. Your details stay in this browser.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          {FORM_FIELDS.map((field) => {
            const error = errors[field.name]
            const inputId = `profile-${field.name}`
            const helpId = `${inputId}-help`
            const errorId = `${inputId}-error`

            return (
              <div key={field.name}>
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-800">
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    id={inputId}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    className={inputClassName}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : helpId}
                  >
                    <option value="">{field.options === SELECT_FIELDS.boolean ? 'Not answered' : 'Select an option'}</option>
                    {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                ) : (
                  <input
                    id={inputId}
                    name={field.name}
                    type={field.type}
                    value={values[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    autoComplete={field.autocomplete}
                    className={inputClassName}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : helpId}
                  />
                )}
                <p id={helpId} className="sr-only">Optional field: {field.label}.</p>
                {error && <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">{error}</p>}
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="min-h-11 rounded-lg bg-brand-cobalt px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
            {profile ? 'Save changes' : 'Save profile'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="min-h-11 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
              Cancel
            </button>
          )}
          {saveNotice && <p className="text-sm text-slate-700" role="status">{saveNotice}</p>}
        </div>
      </form>
    </section>
  )
}
