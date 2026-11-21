import { useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import EducationLevelFilter from '../components/EducationLevelFilter.jsx'
import OpportunityFilters from '../components/OpportunityFilters.jsx'
import OpportunitySearchSort from '../components/OpportunitySearchSort.jsx'
import ItemCard from '../components/ItemCard.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useSavedItems } from '../context/SavedItemsContext.jsx'
import { evaluateScheme, rankItems } from '../engine/eligibility.js'
import schemes from '../data/schemes.json'
import { matchesEducationLevel } from '../utils/educationLevels.js'
import { matchesApplicationStatus, matchesGovernmentLevel } from '../utils/opportunityFilters.js'
import { discoverOpportunities } from '../utils/opportunityDiscovery.js'

export default function Scholarships() {
  const { profile } = useProfile()
  const { saveOpportunity, removeOpportunity, isSaved } = useSavedItems()
  const [educationLevel, setEducationLevel] = useState('all')
  const [governmentLevel, setGovernmentLevel] = useState('all')
  const [applicationStatus, setApplicationStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recommended')

  if (!profile) {
    return (
      <section className="space-y-4" aria-labelledby="scholarships-title">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Student support</p>
          <h1 id="scholarships-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Scholarships &amp; Schemes</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Add a profile to see how each item's rules compare with your details.</p>
        </div>
        <ProfileForm />
      </section>
    )
  }

  const rankedItems = rankItems(
    schemes
      .filter((item) => (item.type === 'scholarship' || item.type === 'scheme') &&
        matchesEducationLevel(item, educationLevel) && matchesGovernmentLevel(item, governmentLevel) &&
        matchesApplicationStatus(item, applicationStatus))
      .map((item) => ({ ...item, ...evaluateScheme(item, profile) })),
  )
  const items = discoverOpportunities(rankedItems, { query: searchQuery, sortBy })

  return (
    <section className="space-y-6" aria-labelledby="scholarships-title">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Student support</p>
        <h1 id="scholarships-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Scholarships &amp; Schemes</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Eligibility results are based on {profile.name ? `${profile.name}'s` : 'your'} current profile.</p>
      </div>

      <EducationLevelFilter value={educationLevel} onChange={setEducationLevel} />
      <OpportunityFilters
        governmentLevel={governmentLevel}
        applicationStatus={applicationStatus}
        onGovernmentLevelChange={setGovernmentLevel}
        onApplicationStatusChange={setApplicationStatus}
      />
      <OpportunitySearchSort query={searchQuery} sortBy={sortBy} onQueryChange={setSearchQuery} onSortChange={setSortBy} />
      <p className="text-sm text-slate-600" role="status" aria-live="polite">Showing {items.length} of {rankedItems.length} scholarships and schemes</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {items.map((item) => (
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
        <EmptyState title="No opportunities match these filters" message="Try another keyword, education level, government level, or application status." />
      )}
    </section>
  )
}
