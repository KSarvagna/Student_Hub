const REASON_GROUPS = [
  { key: 'passed', symbol: '\u2713', label: 'Passed', className: 'text-emerald-800' },
  { key: 'failed', symbol: '\u00D7', label: 'Not met', className: 'text-rose-800' },
  { key: 'unknown', symbol: '?', label: 'Needs information', className: 'text-slate-700' },
]

export default function ReasonList({ passed = [], failed = [], unknown = [] }) {
  const groups = [
    { ...REASON_GROUPS[0], rules: passed },
    { ...REASON_GROUPS[1], rules: failed },
    { ...REASON_GROUPS[2], rules: unknown },
  ]
  const hasRules = groups.some((group) => group.rules.length > 0)

  if (!hasRules) {
    return <p className="text-sm text-slate-600">No eligibility rules are listed for this item.</p>
  }

  return (
    <ul className="space-y-2" aria-label="Eligibility reasons">
      {groups.flatMap((group) =>
        group.rules.map((rule, index) => (
          <li key={rule.id ?? `${group.key}-${index}`} className="flex gap-2 text-sm leading-5 text-slate-700">
            <span aria-hidden="true" className={`w-4 shrink-0 text-center font-bold ${group.className}`}>{group.symbol}</span>
            <span>{rule.label || group.label}</span>
          </li>
        )),
      )}
    </ul>
  )
}
