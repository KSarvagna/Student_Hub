export default function EmptyState({
  title = 'Nothing to show yet',
  message,
  nextStep,
  actionLabel,
  onAction,
}) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-brand-card px-5 py-8 text-center sm:px-8" aria-labelledby="empty-state-title">
      <h2 id="empty-state-title" className="text-lg font-semibold text-slate-900">{title}</h2>
      {message && <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{message}</p>}
      {nextStep && <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-700">{nextStep}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-5 min-h-11 rounded-lg bg-brand-cobalt px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
          {actionLabel}
        </button>
      )}
    </section>
  )
}
