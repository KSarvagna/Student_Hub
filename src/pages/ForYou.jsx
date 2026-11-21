import { useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import EducationLevelFilter from '../components/EducationLevelFilter.jsx'
import OpportunityFilters from '../components/OpportunityFilters.jsx'
import OpportunitySearchSort from '../components/OpportunitySearchSort.jsx'
import ItemCard from '../components/ItemCard.jsx'
import MissingRulesSummary from '../components/MissingRulesSummary.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useSavedItems } from '../context/SavedItemsContext.jsx'
import { evaluateScheme, rankItems } from '../engine/eligibility.js'
import schemes from '../data/schemes.json'
import { matchesEducationLevel } from '../utils/educationLevels.js'
import { matchesApplicationStatus, matchesGovernmentLevel } from '../utils/opportunityFilters.js'
import { discoverOpportunities } from '../utils/opportunityDiscovery.js'

const FILTERS = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'eligible', label: 'Eligible', matches: (item) => item.status === 'eligible' },
  { id: 'almost', label: 'Almost', matches: (item) => item.status === 'almost' },
  { id: 'scholarship', label: 'Scholarships', matches: (item) => item.type === 'scholarship' },
  { id: 'scheme', label: 'Schemes', matches: (item) => item.type === 'scheme' },
  { id: 'internship', label: 'Internships', matches: (item) => item.type === 'internship' },
]

export default function ForYou() {
  const { profile } = useProfile()
  const { saveOpportunity, removeOpportunity, isSaved } = useSavedItems()
  const [activeFilter, setActiveFilter] = useState('all')
  const [educationLevel, setEducationLevel] = useState('all')
  const [governmentLevel, setGovernmentLevel] = useState('all')
  const [applicationStatus, setApplicationStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recommended')

  if (!profile) {
    return (
      <section className="space-y-4" aria-labelledby="for-you-title">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Personalized opportunities</p>
          <h1 id="for-you-title" className="mt-1 text-2xl font-bold text-slate-950">For You</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Add a profile to check these opportunities against your details.</p>
        </div>
        <ProfileForm />
      </section>
    )
  }

  const evaluatedItems = rankItems(
    schemes.map((item) => ({ ...item, ...evaluateScheme(item, profile) })),
  )
  const selectedFilter = FILTERS.find((filter) => filter.id === activeFilter) ?? FILTERS[0]
  const visibleItems = evaluatedItems.filter(selectedFilter.matches)
  const filteredItems = visibleItems.filter((item) =>
    matchesEducationLevel(item, educationLevel) && matchesGovernmentLevel(item, governmentLevel) &&
    matchesApplicationStatus(item, applicationStatus),
  )
  const educationFilteredItems = discoverOpportunities(filteredItems, { query: searchQuery, sortBy })

  return (
    <section className="space-y-6" aria-labelledby="for-you-title">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Personalized opportunities</p>
        <h1 id="for-you-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">For You</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These items are checked against {profile.name ? `${profile.name}'s` : 'your'} profile and ranked by result and deadline.
        </p>
      </div>

      <MissingRulesSummary opportunities={evaluatedItems} />

      <EducationLevelFilter value={educationLevel} onChange={setEducationLevel} />
      <OpportunityFilters
        governmentLevel={governmentLevel}
        applicationStatus={applicationStatus}
        onGovernmentLevelChange={setGovernmentLevel}
        onApplicationStatusChange={setApplicationStatus}
      />
      <OpportunitySearchSort query={searchQuery} sortBy={sortBy} onQueryChange={setSearchQuery} onSortChange={setSortBy} />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter opportunities">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={isActive}
              className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${isActive ? 'border-brand-cobalt bg-brand-cobalt text-white' : 'border-slate-200 bg-brand-card text-slate-700 hover:border-brand-cobalt hover:text-brand-text'}`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      <p className="text-sm text-slate-600" role="status" aria-live="polite">Showing {educationFilteredItems.length} of {filteredItems.length} opportunities matching the selected filters</p>

      {educationFilteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {educationFilteredItems.map((item) => (
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
          title="No items match this filter"
          message="There are no opportunities in this group for the current profile."
          nextStep="Try another filter or update your profile details."
        />
      )}
    </section>
  )
}
