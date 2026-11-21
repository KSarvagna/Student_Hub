import { useState } from 'react'
import { useProfile } from '../context/ProfileContext.jsx'
import ProfileForm from './ProfileForm.jsx'

const LABELS = {
  course_level: 'Course level',
  school_class: 'Current school class',
  school_type: 'School type',
  stream: 'Stream',
  year_of_study: 'Year of study',
  state: 'State or union territory',
  category: 'Category',
  gender: 'Gender',
  annual_family_income: 'Annual family income',
  last_exam_percentage: 'Last exam percentage',
  graduation_percentage: 'Graduation or qualifying degree percentage',
  residential_area: 'Residential area',
  class12_above_80th_percentile: 'Above Class 12 board 80th percentile cutoff',
  class12_completed_last_academic_year: 'Completed Class 12 in the last academic year',
  regular_course: 'Enrolled in a regular course',
  receives_other_scholarship: 'Receives another scholarship or fee reimbursement',
  gap_after_class12: 'Took a gap after Class 12',
  institution_recognized: 'Institution meets recognition requirements',
  special_occupation_eligibility: 'Parent or guardian occupation meets pre-matric scheme category',
  nmmss_selection_test_passed: 'Passed NMMSS selection tests',
  technical_course: 'Technical programme',
  institution_aicte_approved: 'Institution is AICTE-approved',
  centralized_admission: 'Centralized government admission process',
  institution_notified_for_top_class: 'Institution is on the notified Top Class SC list',
  net_or_csir_net_jrf_qualified: 'Qualified UGC-NET-JRF or Joint CSIR-UGC NET-JRF',
  graduated_or_final_year_qualifying_course: 'Graduated or in final year of a qualifying course',
  overseas_country_eligible: 'Overseas destination is on the eligible-country list',
  overseas_tests_criteria_met: 'Meets required overseas test criteria',
  overseas_admission_and_visa: 'Has required overseas admission document and visa',
  only_child_in_family: 'No other child in family has claimed the scheme',
}

const CHOICE_LABELS = {
  diploma: 'Diploma',
  school: 'School (Class 1–12)',
  intermediate: 'Intermediate (Classes 11–12)',
  undergraduate: 'Undergraduate',
  postgraduate: 'Postgraduate',
  phd: 'PhD',
  research: 'Other research programme',
  government: 'Government',
  government_aided: 'Government-aided',
  local_body: 'Local body',
  engineering: 'Engineering',
  medical: 'Medical',
  arts: 'Arts',
  science: 'Science',
  commerce: 'Commerce',
  law: 'Law',
  other: 'Other',
  general: 'General',
  obc: 'OBC',
  sc: 'SC',
  st: 'ST',
  ews: 'EWS',
  bc_a: 'BC-A',
  bc_b: 'BC-B',
  bc_c: 'BC-C',
  bc_d: 'BC-D',
  bc_e: 'BC-E',
  ebc: 'EBC',
  minority: 'Minority community',
  disabled: 'Person with disability (ePASS category)',
  rural: 'Rural',
  urban: 'Urban',
  female: 'Female',
  male: 'Male',
  prefer_not_to_say: 'Prefer not to say',
}

function formatValue(field, value) {
  if (['class12_above_80th_percentile', 'class12_completed_last_academic_year', 'regular_course', 'receives_other_scholarship', 'gap_after_class12', 'institution_recognized', 'special_occupation_eligibility', 'nmmss_selection_test_passed', 'technical_course', 'institution_aicte_approved', 'centralized_admission', 'institution_notified_for_top_class', 'net_or_csir_net_jrf_qualified', 'graduated_or_final_year_qualifying_course', 'overseas_country_eligible', 'overseas_tests_criteria_met', 'overseas_admission_and_visa', 'only_child_in_family'].includes(field)) {
    return value ? 'Yes' : 'No'
  }
  if (field === 'annual_family_income') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (field === 'last_exam_percentage') return `${value}%`
  if (field === 'graduation_percentage') return `${value}%`
  if (field === 'year_of_study') return `Year ${value}`
  return CHOICE_LABELS[value] ?? value
}

export default function ProfileSummary() {
  const { profile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (!profile) return null
  if (isEditing) return <ProfileForm onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />

  const details = Object.entries(LABELS).filter(([field]) => {
    const value = profile[field]
    return value !== undefined && value !== null && value !== ''
  })

  return (
    <section className="rounded-xl border border-slate-200 bg-brand-card p-5 sm:p-7" aria-labelledby="profile-summary-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Your profile</p>
          <h2 id="profile-summary-title" className="mt-1 text-2xl font-bold text-slate-950">{profile.name || 'Student'}</h2>
        </div>
        <button type="button" onClick={() => setIsEditing(true)} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
          Edit profile
        </button>
      </div>

      {details.length > 0 ? (
        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          {details.map(([field]) => (
            <div key={field}>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{LABELS[field]}</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatValue(field, profile[field])}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No profile details added yet.</p>
      )}
    </section>
  )
}
