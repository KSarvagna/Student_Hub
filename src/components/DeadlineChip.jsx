import { deadlineBucket, daysLeft } from '../engine/eligibility.js'

const BUCKET_STYLES = {
  open: 'border-slate-200 bg-slate-50 text-slate-800',
  soon: 'border-sky-200 bg-sky-50 text-sky-950',
  urgent: 'border-amber-200 bg-amber-50 text-amber-950',
  closed: 'border-rose-200 bg-rose-50 text-rose-900',
}

function deadlineText(days) {
  if (days === null) return 'Open deadline'
  if (days < 0) {
    const elapsed = Math.abs(days)
    return `Deadline passed ${elapsed} ${elapsed === 1 ? 'day' : 'days'} ago`
  }
  if (days === 0) return 'Due today'
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}

export default function DeadlineChip({ deadline, today = new Date(), className = '' }) {
  const remainingDays = daysLeft(deadline, today)
  const bucket = deadlineBucket(remainingDays)

  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${BUCKET_STYLES[bucket]} ${className}`}>
      {deadlineText(remainingDays)}
    </span>
  )
}
