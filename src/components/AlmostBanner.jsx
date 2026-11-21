export default function AlmostBanner({ failed = [] }) {
  const missingHint = failed[0]?.missing_hint

  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" aria-label="Almost eligible explanation">
      <p className="font-semibold">Almost eligible</p>
      <p className="mt-1">{missingHint || 'One requirement is not met.'}</p>
    </aside>
  )
}
