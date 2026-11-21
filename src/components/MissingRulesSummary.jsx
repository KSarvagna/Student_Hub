import { aggregateMissingRules } from '../utils/missingRules.js'

export default function MissingRulesSummary({ opportunities = [] }) {
  const frequentRules = aggregateMissingRules(opportunities)

  return (
    <section className="rounded-xl border border-teal-100 bg-teal-50/60 p-5 sm:p-6" aria-labelledby="missing-rules-title">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Eligibility patterns</p>
        <h2 id="missing-rules-title" className="mt-1 text-xl font-bold text-slate-950">What am I missing?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          These are requirements that did not pass across the opportunities checked against your profile.
        </p>
      </div>

      {frequentRules.length > 0 ? (
        <ol className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {frequentRules.map((rule) => (
            <li key={rule.key} className="min-w-0 rounded-xl border border-teal-100 bg-brand-card p-4">
              <p className="text-sm font-semibold text-slate-950">
                {rule.count} {rule.count === 1 ? 'opportunity' : 'opportunities'} affected
              </p>
              <div className="mt-2 space-y-3">
                {rule.explanations.map((explanation, index) => (
                  <div key={`${rule.key}-explanation-${index}`}>
                    <p className="text-sm font-medium leading-5 text-slate-800">
                      {explanation.label || 'Requirement details unavailable.'}
                    </p>
                    {explanation.missing_hint && (
                      <p className="mt-1 text-sm leading-5 text-slate-600">{explanation.missing_hint}</p>
                    )}
                  </div>
                ))}
              </div>
              {rule.opportunityNames.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Affected opportunities</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm leading-5 text-slate-700">
                    {rule.opportunityNames.map((name, index) => <li key={`${rule.key}-opportunity-${index}`}>{name}</li>)}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 rounded-xl border border-teal-100 bg-brand-card p-4 text-sm leading-6 text-slate-700" role="status">
          No failed requirements were found for the opportunities checked against your profile.
        </p>
      )}
    </section>
  )
}
