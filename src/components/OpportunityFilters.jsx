import { APPLICATION_STATUS_OPTIONS, GOVERNMENT_LEVEL_OPTIONS } from '../utils/opportunityFilters.js'

const selectClassName = 'min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-base text-slate-900 shadow-sm outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25'

export default function OpportunityFilters({ governmentLevel, applicationStatus, onGovernmentLevelChange, onApplicationStatusChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Catalogue filters">
      <div className="max-w-sm">
        <label htmlFor="government-level-filter" className="mb-1.5 block text-sm font-medium text-slate-800">
          Filter by government level
        </label>
        <select id="government-level-filter" value={governmentLevel} onChange={(event) => onGovernmentLevelChange(event.target.value)} className={selectClassName}>
          {GOVERNMENT_LEVEL_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="max-w-sm">
        <label htmlFor="application-status-filter" className="mb-1.5 block text-sm font-medium text-slate-800">
          Filter by application status
        </label>
        <select id="application-status-filter" value={applicationStatus} onChange={(event) => onApplicationStatusChange(event.target.value)} className={selectClassName}>
          {APPLICATION_STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
    </div>
  )
}
