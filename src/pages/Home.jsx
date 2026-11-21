import { Link } from 'react-router-dom'
import announcements from '../data/announcements.json'
import schemes from '../data/schemes.json'
import AnnouncementCard from '../components/AnnouncementCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import ProfileSummary from '../components/ProfileSummary.jsx'
import { useProfile } from '../context/ProfileContext.jsx'

const SECTIONS = [
  { title: 'Home', to: '/', description: 'Your personalized starting point.' },
  { title: 'For You', to: '/for-you', description: 'Opportunities ranked for your profile.' },
  { title: 'Scholarships & Schemes', to: '/scholarships', description: 'Explore student support and funding.' },
  { title: 'Internships', to: '/internships', description: 'Explore relevant internship listings.' },
  { title: "What's New", to: '/whats-new', description: 'Read recent student announcements.' },
  { title: 'My Plan', to: '/my-plan', description: 'Keep track of opportunities you want to follow.' },
]

export default function Home() {
  const { profile } = useProfile()
  const recentAnnouncements = [...announcements]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 2)
  const catalogueStats = [
    { label: 'Catalogue records', value: schemes.length, detail: 'Across scholarships, schemes and internships' },
    { label: 'Central Government', value: schemes.filter((item) => item.government_level === 'central').length, detail: 'Available across India' },
    { label: 'Telangana Government', value: schemes.filter((item) => item.government_level === 'state').length, detail: 'State-specific opportunities' },
    { label: 'Legacy sample items', value: schemes.filter((item) => !item.government_level).length, detail: 'Kept separate as unclassified examples' },
  ]

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-brand-navy px-5 py-7 text-white sm:px-8 sm:py-9">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-pale">Student Hub</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Hi{profile?.name ? `, ${profile.name}` : ' there'}, what are you looking for today?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-pale sm:text-base">
          Explore Central Government scholarships across India and Telangana Government support, with clear eligibility results and reasons.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/for-you" className="inline-flex min-h-11 items-center rounded-lg bg-brand-cobalt px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy">See opportunities for me</Link>
          <Link to="/scholarships" className="inline-flex min-h-11 items-center rounded-lg border border-brand-pale/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy">Browse scholarships</Link>
        </div>
      </section>

      <section aria-label="Catalogue overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {catalogueStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-brand-card p-4 sm:p-5">
            <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-teal-950">{stat.value}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{stat.detail}</p>
          </div>
        ))}
      </section>

      {profile ? (
        <ProfileSummary />
      ) : (
        <section className="space-y-3" aria-labelledby="get-started-title">
          <div>
            <h2 id="get-started-title" className="text-xl font-bold text-slate-950">Start with your student profile</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Add what you know. Every field is optional, and you can update it later.</p>
          </div>
          <ProfileForm />
          <p className="text-sm font-medium text-teal-900">Next step: save your profile to see which opportunities may fit.</p>
        </section>
      )}

      <section aria-labelledby="sections-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Explore</p>
            <h2 id="sections-title" className="mt-1 text-xl font-bold text-slate-950">Your student hub</h2>
          </div>
          <p className="text-sm text-slate-600">Choose a section to continue.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((section, index) => (
            <Link
              key={section.to}
              to={section.to}
              className="group flex min-h-28 items-start gap-4 rounded-xl border border-slate-200 bg-brand-card p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-bold text-teal-900" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block font-semibold text-slate-950 group-hover:text-teal-900">{section.title}</span>
                <span className="mt-1 block text-sm leading-5 text-slate-600">{section.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-announcements-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Recent updates</p>
            <h2 id="recent-announcements-title" className="mt-1 text-xl font-bold text-slate-950">What's new</h2>
          </div>
          <Link to="/whats-new" className="min-h-11 inline-flex items-center text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700">
            View announcements
          </Link>
        </div>
        {recentAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {recentAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} compact />
            ))}
          </div>
        ) : (
          <EmptyState title="No announcements yet" message="Recent updates will appear here when available." />
        )}
      </section>
    </div>
  )
}
