import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeSelector() {
  const { preference, setPreference } = useTheme()

  return (
    <div className="w-full sm:w-36">
      <label htmlFor="theme-preference" className="mb-1.5 block text-sm font-semibold text-slate-800">Appearance</label>
      <select
        id="theme-preference"
        value={preference}
        onChange={(event) => setPreference(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-brand-card px-3 py-2 text-sm text-slate-900 outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/30"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  )
}
