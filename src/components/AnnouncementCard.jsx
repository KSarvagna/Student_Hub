import DeadlineChip from './DeadlineChip.jsx'

function formatDate(date) {
  if (!date) return 'Date not provided'
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export default function AnnouncementCard({ announcement, today, compact = false }) {
  return (
    <article className={`flex h-full w-full min-w-0 max-w-full flex-col rounded-xl border border-slate-200 bg-brand-card ${compact ? 'gap-3 p-4' : 'gap-4 p-5 sm:p-6'}`}>
      <div className="min-w-0 max-w-full">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <time dateTime={announcement.date} className="text-sm font-medium text-slate-600">
            {formatDate(announcement.date)}
          </time>
          {announcement.verified === false && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-950">
              Sample data, not verified
            </span>
          )}
        </div>
        <h2 className={`font-semibold leading-6 text-slate-950 [overflow-wrap:anywhere] ${compact ? 'text-base' : 'text-lg'}`}>{announcement.title}</h2>
      </div>

      {compact ? (
        <div className="min-w-0 max-w-full space-y-2 text-sm leading-5 text-slate-700 [overflow-wrap:anywhere]">
          <p>{announcement.summary_plain}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">Deadline:</span>
            <DeadlineChip deadline={announcement.deadline} today={today} />
          </div>
        </div>
      ) : (
        <div className="min-w-0 max-w-full space-y-3 text-sm leading-6 text-slate-700 [overflow-wrap:anywhere]">
          <p><span className="font-semibold text-slate-900">Who it is for: </span>{announcement.who_for}</p>
          <p>{announcement.summary_plain}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">Deadline:</span>
            <DeadlineChip deadline={announcement.deadline} today={today} />
          </div>
          {announcement.next_step && (
            <p><span className="font-semibold text-slate-900">Next step: </span>{announcement.next_step}</p>
          )}
        </div>
      )}

      <div className={`mt-auto min-w-0 max-w-full border-t border-slate-100 text-xs text-slate-600 ${compact ? 'pt-3' : 'pt-4'}`}>
        <a className="inline-flex min-h-11 min-w-0 max-w-full items-center whitespace-normal font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700 [overflow-wrap:anywhere]" href={announcement.source_url} target="_blank" rel="noreferrer">
          {announcement.source_name || 'Official source'}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="mt-1">Last verified: {formatDate(announcement.last_verified)}</p>
      </div>
    </article>
  )
}
