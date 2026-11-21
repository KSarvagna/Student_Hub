export default function DocumentChecklist({
  documents = [],
  checkedDocuments = {},
  onToggle,
  idPrefix = 'document',
}) {
  if (documents.length === 0) {
    return <p className="text-sm text-slate-600">No documents are listed for this item.</p>
  }

  return (
    <ul className="space-y-2">
      {documents.map((document, index) => {
        const key = document.id ?? document.name ?? String(index)
        const inputId = `${idPrefix}-${index}`

        return (
          <li key={key} className="rounded-lg border border-slate-200 px-3 py-2">
            <label htmlFor={inputId} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(checkedDocuments[key])}
                onChange={(event) => onToggle?.(key, event.target.checked, document)}
                disabled={!onToggle}
                className="size-5 shrink-0 rounded border-slate-300 accent-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              />
              <span>{document.name}</span>
            </label>
            {document.where_to_get && <p className="pb-2 pl-8 text-xs leading-5 text-slate-600">Where to get it: {document.where_to_get}</p>}
          </li>
        )
      })}
    </ul>
  )
}
