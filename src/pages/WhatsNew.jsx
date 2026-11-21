import AnnouncementCard from '../components/AnnouncementCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import announcements from '../data/announcements.json'

const newestFirst = [...announcements].sort((left, right) => right.date.localeCompare(left.date))

export default function WhatsNew() {
  return (
    <section className="min-w-0 w-full max-w-full space-y-6" aria-labelledby="whats-new-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Student updates</p>
          <h1 id="whats-new-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">What's New</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Recent announcements in plain language, with links to their listed sources.
          </p>
        </div>
        {newestFirst.length > 0 && (
          <p className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-900">
            {newestFirst.length} {newestFirst.length === 1 ? 'announcement' : 'announcements'}
          </p>
        )}
      </div>

      {newestFirst.length > 0 ? (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          {newestFirst.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No announcements yet"
          message="There are no student announcements to show right now."
          nextStep="Check back when new updates are added."
        />
      )}
    </section>
  )
}
