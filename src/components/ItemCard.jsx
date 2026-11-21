import AlmostBanner from './AlmostBanner.jsx'
import DeadlineChip from './DeadlineChip.jsx'
import ReasonList from './ReasonList.jsx'
import StatusBadge from './StatusBadge.jsx'

const TYPE_LABELS = {
  scholarship: 'Scholarship',
  scheme: 'Scheme',
  internship: 'Internship',
}

const GOVERNMENT_LABELS = { central: 'Central Government', state: 'Telangana Government' }
const APPLICATION_STATUS_LABELS = { open: 'Open', upcoming: 'Upcoming', closed: 'Closed', unknown: 'Status unknown' }
const APPLICATION_STATUS_STYLES = {
  open: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  upcoming: 'border-sky-200 bg-sky-50 text-sky-950',
  closed: 'border-rose-200 bg-rose-50 text-rose-900',
  unknown: 'border-slate-200 bg-slate-50 text-slate-700',
}

function formatDate(date) {
  if (!date) return 'Not provided'
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export default function ItemCard({ item, evaluation, onSave, onUnsave, isSaved = false, today }) {
  const result = evaluation ?? { status: 'needs_info', passed: [], failed: [], unknown: [] }

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-brand-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {TYPE_LABELS[item.type] ?? item.type}
            </span>
            {item.government_level && (
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                {GOVERNMENT_LABELS[item.government_level] ?? item.government_level}
              </span>
            )}
            {item.verification_status === 'partially_verified' || item.verification_note?.toLowerCase().startsWith('partially verified') ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-950">Partially verified</span>
            ) : item.verified === false ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-950">
                {item.government_level ? 'Unverified listing' : 'Sample data, not verified'}
              </span>
            ) : null}
            {item.simplified && <span className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">Simplified screening</span>}
          </div>
          <h2 className="text-lg font-semibold leading-6 text-slate-950">{item.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{item.provider}</p>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <p className="text-sm leading-6 text-slate-700">{item.summary_plain}</p>
      {item.benefit_text && (
        <p className="rounded-lg border-l-4 border-teal-700 bg-teal-50/70 px-3 py-2 text-sm leading-6 text-slate-800">
          <span className="font-semibold text-slate-950">Benefit: </span>{item.benefit_text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <DeadlineChip deadline={item.deadline} today={today} />
        <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${APPLICATION_STATUS_STYLES[item.application_status ?? 'unknown']}`}>
          Application: {APPLICATION_STATUS_LABELS[item.application_status ?? 'unknown'] ?? item.application_status}
        </span>
      </div>

      {item.verification_note && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-950">{item.verification_note}</p>}

      {result.status === 'almost' && <AlmostBanner failed={result.failed} />}

      <section className="border-t border-slate-100 pt-4" aria-labelledby={`why-${item.id}`}>
        <h3 id={`why-${item.id}`} className="mb-2 text-sm font-semibold text-slate-900">Why this result?</h3>
        <ReasonList passed={result.passed} failed={result.failed} unknown={result.unknown} />
      </section>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="space-y-1 text-xs text-slate-600">
          {item.source_url && (
            <a className="inline-flex min-h-11 items-center font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700" href={item.source_url} target="_blank" rel="noreferrer">
              Official source
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {item.apply_url && (
            <a className="ml-3 inline-flex min-h-11 items-center font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700" href={item.apply_url} target="_blank" rel="noreferrer">
              Official application
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <p>Last verified: {formatDate(item.last_verified)}</p>
        </div>
        {((isSaved && onUnsave) || (!isSaved && onSave)) && (
          <button
            type="button"
            onClick={() => (isSaved ? onUnsave(item) : onSave(item))}
            aria-label={isSaved ? `Remove ${item.name} from My Plan` : `Save ${item.name}`}
            className="min-h-11 rounded-lg border border-teal-800 px-4 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-default disabled:border-slate-300 disabled:text-slate-500 disabled:hover:bg-transparent"
          >
            {isSaved ? 'Remove' : 'Save'}
          </button>
        )}
      </div>
    </article>
  )
}
