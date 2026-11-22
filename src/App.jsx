import { Link, NavLink, Route, Routes } from 'react-router-dom'
import DemoProfileMenu from './components/DemoProfileMenu.jsx'
import ThemeSelector from './components/ThemeSelector.jsx'
import Disclaimer from './components/Disclaimer.jsx'
import EmptyState from './components/EmptyState.jsx'
import ForYou from './pages/ForYou.jsx'
import Home from './pages/Home.jsx'
import Internships from './pages/Internships.jsx'
import MyPlan from './pages/MyPlan.jsx'
import Scholarships from './pages/Scholarships.jsx'
import WhatsNew from './pages/WhatsNew.jsx'
import ScholarshipAssistant from './pages/ScholarshipAssistant.jsx'

const NAV_ITEMS = [
  { label: 'Home', to: '/', mobileLabel: 'Home' },
  { label: 'For You', to: '/for-you', mobileLabel: 'For You' },
  { label: 'Scholarships', to: '/scholarships', mobileLabel: 'Scholar-\nships' },
  { label: 'Internships', to: '/internships', mobileLabel: 'Intern-\nships' },
  { label: "What's New", to: '/whats-new', mobileLabel: "What's\nNew" },
  { label: 'My Plan', to: '/my-plan', mobileLabel: 'My Plan' },
  { label: 'AI Assistant', to: '/assistant', mobileLabel: 'AI\nHelp' },
]

function navigationClassName({ isActive }) {
  return `min-h-11 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${isActive ? 'bg-brand-cobalt text-white' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950'}`
}

function ComingSoon({ section }) {
  return (
    <EmptyState
      title={`${section} is coming in a later phase`}
      message="This section is not part of the current implementation phase."
      nextStep="Use Home, For You, Scholarships, or Internships to explore the available sections."
    />
  )
}

export default function App() {
  return (
    <div className="app-shell min-h-screen bg-brand-warm">
      <header className="app-navigation sticky top-0 z-30 border-b border-slate-200 bg-brand-navigation">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-navy text-sm font-bold text-white" aria-hidden="true">SH</span>
              <span>
                <span className="block text-base font-bold leading-5 text-slate-950">Student Hub</span>
                <span className="block text-xs text-slate-600">Student opportunities, made clearer</span>
              </span>
            </Link>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
              <DemoProfileMenu className="w-full max-w-xs sm:w-64" />
              <ThemeSelector />
            </div>
          </div>

          <nav aria-label="Main navigation" className="mt-3 hidden flex-wrap gap-1 border-t border-slate-200 pt-3 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navigationClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="app-main mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-12 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/assistant" element={<ScholarshipAssistant />} />
          <Route path="*" element={<EmptyState title="Page not found" message="This section could not be found." nextStep="Return to Home to continue." actionLabel="Go to Home" onAction={() => window.location.assign('/')} />} />
        </Routes>
      </main>

      <div className="app-disclaimer mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-6 lg:px-8">
        <Disclaimer />
      </div>

      <nav aria-label="Mobile navigation" className="app-mobile-navigation fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-brand-navigation px-1 pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="mx-auto grid max-w-xl grid-cols-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="min-w-0">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                aria-label={item.label}
                className={({ isActive }) => `flex min-h-14 w-full min-w-0 items-center justify-center rounded-md px-0.5 text-center text-[11px] font-semibold leading-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700 ${isActive ? 'bg-brand-cobalt text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="max-w-full whitespace-pre-line">{item.mobileLabel}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
