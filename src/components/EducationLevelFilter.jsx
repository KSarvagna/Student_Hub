import { EDUCATION_LEVEL_OPTIONS } from '../utils/educationLevels.js'

export default function EducationLevelFilter({ value, onChange }) {
  return (
    <div className="max-w-sm">
      <label htmlFor="education-level-filter" className="mb-1.5 block text-sm font-medium text-slate-800">
        Filter by education level
      </label>
      <select
        id="education-level-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-base text-slate-900 shadow-sm outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
      >
        {EDUCATION_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
