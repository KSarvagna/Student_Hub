import demoProfiles from '../data/demoProfiles.json'
import { useProfile } from '../context/ProfileContext.jsx'
import { getSelectedDemoProfileIndex, selectDemoProfile } from '../utils/demoProfiles.js'

export default function DemoProfileMenu({ className = 'w-full max-w-xs' }) {
  const { profile, updateProfile } = useProfile()
  const selectedProfile = getSelectedDemoProfileIndex(profile, demoProfiles)

  function handleChange(event) {
    selectDemoProfile(event.target.value, demoProfiles, updateProfile)
  }

  return (
    <div className={className}>
      <label htmlFor="demo-profile-select" className="mb-1.5 block text-sm font-semibold text-slate-800">
        Demo profiles
      </label>
      <select
        id="demo-profile-select"
        value={selectedProfile}
        onChange={handleChange}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
      >
        <option value="">Choose a sample student</option>
        {demoProfiles.map((profile, index) => (
          <option key={profile.name} value={index}>{profile.name} (demo)</option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-600">Selecting a demo profile replaces the current profile.</p>
    </div>
  )
}
