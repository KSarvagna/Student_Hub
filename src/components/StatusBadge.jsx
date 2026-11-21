const STATUS_STYLES = {
  eligible: {
    label: 'Eligible',
    symbol: '\u2713',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  almost: {
    label: 'Almost eligible',
    symbol: '\u25B3',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  not_eligible: {
    label: 'Not eligible',
    symbol: '\u00D7',
    className: 'border-rose-200 bg-rose-50 text-rose-900',
  },
  needs_info: {
    label: 'Needs more info',
    symbol: '?',
    className: 'border-status-neutral-border bg-status-neutral-bg text-status-neutral-text',
  },
}

export default function StatusBadge({ status }) {
  const details = STATUS_STYLES[status] ?? STATUS_STYLES.needs_info

  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${details.className}`}>
      <span aria-hidden="true" className="text-sm leading-none">{details.symbol}</span>
      {details.label}
    </span>
  )
}
