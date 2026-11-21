/** Return the demo option matching the current profile, or an empty value. */
export function getSelectedDemoProfileIndex(profile, demoProfiles) {
  if (!profile || typeof profile !== 'object') return ''

  const profileKeys = Object.keys(profile)
  const matchingIndex = demoProfiles.findIndex((demoProfile) => {
    const demoKeys = Object.keys(demoProfile)
    return (
      profileKeys.length === demoKeys.length &&
      demoKeys.every((key) => Object.hasOwn(profile, key) && profile[key] === demoProfile[key])
    )
  })

  return matchingIndex === -1 ? '' : String(matchingIndex)
}

/** Load a selected demo through the provided profile update callback. */
export function selectDemoProfile(indexValue, demoProfiles, updateProfile) {
  if (indexValue === '') return false

  const index = Number(indexValue)
  if (!Number.isInteger(index) || index < 0 || !demoProfiles[index]) return false

  updateProfile({ ...demoProfiles[index] })
  return true
}
