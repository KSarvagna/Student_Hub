import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { readProfile, removeProfile, writeProfile } from '../utils/storage.js'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(readProfile)

  const createProfile = useCallback((newProfile) => {
    const saved = writeProfile(newProfile)
    setProfile(newProfile)
    return saved
  }, [])

  const updateProfile = useCallback((updatedProfile) => {
    const saved = writeProfile(updatedProfile)
    setProfile(updatedProfile)
    return saved
  }, [])

  const clearProfile = useCallback(() => {
    const removed = removeProfile()
    setProfile(null)
    return removed
  }, [])

  const value = useMemo(
    () => ({ profile, createProfile, updateProfile, clearProfile }),
    [profile, createProfile, updateProfile, clearProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used inside a ProfileProvider.')
  }

  return context
}
