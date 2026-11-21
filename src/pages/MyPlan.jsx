import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DocumentChecklist from '../components/DocumentChecklist.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ItemCard from '../components/ItemCard.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useSavedItems } from '../context/SavedItemsContext.jsx'
import { evaluateScheme } from '../engine/eligibility.js'
import { readChecklistProgress, writeChecklistProgress } from '../utils/storage.js'
import { sortSavedOpportunities } from '../utils/savedItems.js'
import { createCalendarContent } from '../utils/calendarExport.js'
import './MyPlan.css'

export default function MyPlan() {
  const { profile } = useProfile()
  const { savedItems, removeOpportunity } = useSavedItems()
  const [checklistProgress, setChecklistProgress] = useState(readChecklistProgress)
  const checklistRef = useRef(checklistProgress)
  const sortedItems = sortSavedOpportunities(savedItems)
  const today = new Date()
  const [calendarMessage, setCalendarMessage] = useState('')

  function exportDeadlines() {
    const content = createCalendarContent(savedItems)
    if (!content) {
      setCalendarMessage('There are no saved opportunities with valid deadlines to export.')
      return
    }

    const file = new Blob([content], { type: 'text/calendar' })
    const downloadUrl = window.URL.createObjectURL(file)
    const downloadLink = document.createElement('a')
    downloadLink.href = downloadUrl
    downloadLink.download = 'student-hub-deadlines.ics'
    downloadLink.style.display = 'none'
    document.body.append(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000)
    setCalendarMessage('Calendar download started. Each date is marked as sample and unverified.')
  }

  function updateChecklist(opportunityId, documentKey, checked) {
    const updatedProgress = {
      ...checklistRef.current,
      [opportunityId]: {
        ...(checklistRef.current[opportunityId] ?? {}),
        [documentKey]: checked,
      },
    }

    checklistRef.current = updatedProgress
    setChecklistProgress(updatedProgress)
    writeChecklistProgress(updatedProgress)
  }

  return (
    <section className="my-plan-print min-w-0 space-y-6" aria-labelledby="my-plan-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Saved opportunities</p>
          <h1 id="my-plan-title" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">My Plan</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your saved items and the documents listed for each one.
          </p>
        </div>
        <div className="print-hidden flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportDeadlines}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-800 px-4 py-2 text-sm font-semibold text-teal-900 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Export deadlines to calendar
          </button>
          {sortedItems.length > 0 && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-cobalt px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Print / Save as PDF
            </button>
          )}
        </div>
      </div>
      {calendarMessage && <p className="print-hidden text-sm text-slate-700" role="status" aria-live="polite">{calendarMessage}</p>}

      {sortedItems.length > 0 ? (
        <div className="space-y-5">
          {sortedItems.map((item) => {
            const evaluation = evaluateScheme(item, profile ?? {})
            const checkedDocuments = checklistProgress[item.id] ?? {}
            const documents = item.documents ?? []
            const checkedCount = documents.filter((document, index) => {
              const key = document.id ?? document.name ?? String(index)
              return Boolean(checkedDocuments[key])
            }).length

            return (
              <div key={item.id} className="plan-opportunity grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,1fr)]">
                <ItemCard
                  item={item}
                  evaluation={evaluation}
                  onUnsave={removeOpportunity}
                  isSaved
                  today={today}
                />
                <section className="plan-documents min-w-0 rounded-xl border border-slate-200 bg-brand-card p-5 sm:p-6" aria-labelledby={`documents-${item.id}`}>
                  <h2 id={`documents-${item.id}`} className="text-base font-bold text-slate-950">Document checklist</h2>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {documents.length > 0 ? `${checkedCount} of ${documents.length} documents checked` : 'No verified document list is available for this item.'}
                  </p>
                  {documents.length > 0 && (
                    <progress className="mt-3 h-2 w-full accent-teal-800" value={checkedCount} max={documents.length} aria-label={`${checkedCount} of ${documents.length} documents checked`} />
                  )}
                  <div className="mt-4">
                    <DocumentChecklist
                      documents={documents}
                      checkedDocuments={checkedDocuments}
                      onToggle={(documentKey, checked) => updateChecklist(item.id, documentKey, checked)}
                      idPrefix={`plan-${item.id}`}
                    />
                  </div>
                </section>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <EmptyState
            title="Your plan is empty"
            message="Save opportunities that you want to keep track of, and they will appear here."
            nextStep="Start with the opportunities matched to your profile."
          />
          <Link to="/for-you" className="print-hidden inline-flex min-h-11 items-center rounded-lg border border-teal-800 px-4 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
            Browse For You
          </Link>
        </div>
      )}
    </section>
  )
}
