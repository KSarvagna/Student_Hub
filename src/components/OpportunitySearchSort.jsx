const inputClassName = 'min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-base text-slate-900 shadow-sm outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25'

export default function OpportunitySearchSort({ query, sortBy, onQueryChange, onSortChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_16rem]">
      <div>
        <label htmlFor="opportunity-search" className="mb-1.5 block text-sm font-medium text-slate-800">
          Search by scholarship, provider or keyword
        </label>
        <input
          id="opportunity-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try ‘overseas’, ‘ePASS’ or a provider"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="opportunity-sort" className="mb-1.5 block text-sm font-medium text-slate-800">
          Sort opportunities
        </label>
        <select id="opportunity-sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)} className={inputClassName}>
          <option value="recommended">Recommended order</option>
          <option value="deadline">Earliest deadline first</option>
        </select>
      </div>
    </div>
  )
}
