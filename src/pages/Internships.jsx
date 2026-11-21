import { useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import ItemCard from '../components/ItemCard.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useSavedItems } from '../context/SavedItemsContext.jsx'
import { evaluateScheme, rankItems } from '../engine/eligibility.js'
import schemes from '../data/schemes.json'

export default function Internships() {
  const { profile } = useProfile()
  const { saveOpportunity, removeOpportunity, isSaved } = useSavedItems()
  const [locationFilter, setLocationFilter] = useState('')
  const internships = schemes.filter((item) => item.type === 'internship')
  const hasLocationData = internships.some((item) => Boolean(item.location?.trim()))

  if (!profile) {
    return (
      <section className="space-y-4" aria-labelledby="internships-title">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Work experience</p>
          <h1 id="internships-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Internships</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Add a profile to check internship rules against your details.</p>
        </div>
        <ProfileForm />
      </section>
    )
  }

  const rankedItems = rankItems(
    internships.map((item) => ({ ...item, ...evaluateScheme(item, profile) })),
  )
  const query = locationFilter.trim().toLocaleLowerCase()
  const visibleItems = rankedItems.filter((item) =>
    !query || (item.location ?? '').toLocaleLowerCase().includes(query),
  )

  return (
    <section className="space-y-6" aria-labelledby="internships-title">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Work experience</p>
        <h1 id="internships-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Internships</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Internship eligibility is checked against {profile.name ? `${profile.name}'s` : 'your'} current profile.</p>
      </div>

      {hasLocationData && (
        <div className="max-w-md">
          <label htmlFor="internship-location" className="mb-1.5 block text-sm font-medium text-slate-800">Filter by location</label>
          <input
            id="internship-location"
            type="search"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            placeholder="Type a location"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-base text-slate-900 shadow-sm outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
          />
        </div>
      )}

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              evaluation={item}
              onSave={saveOpportunity}
              onUnsave={removeOpportunity}
              isSaved={isSaved(item.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={query ? 'No internships match that location' : 'No internships available'}
          message={query ? 'Try a different location or clear the filter.' : 'Internship items will appear here when available.'}
          nextStep={query ? 'Location details are provided with each listing.' : undefined}
        />
      )}
    </section>
  )
}
