import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { readSavedItems, writeSavedItems } from '../utils/storage.js'
import { addSavedOpportunity, removeSavedOpportunity } from '../utils/savedItems.js'

const SavedItemsContext = createContext(null)

export function SavedItemsProvider({ children }) {
  const [savedItems, setSavedItems] = useState(readSavedItems)
  const savedItemsRef = useRef(savedItems)

  const saveOpportunity = useCallback((opportunity) => {
    const updatedItems = addSavedOpportunity(savedItemsRef.current, opportunity)
    if (updatedItems === savedItemsRef.current) return false

    savedItemsRef.current = updatedItems
    setSavedItems(updatedItems)
    writeSavedItems(updatedItems)
    return true
  }, [])

  const removeOpportunity = useCallback((opportunityOrId) => {
    const opportunityId = typeof opportunityOrId === 'string'
      ? opportunityOrId
      : opportunityOrId?.id
    const updatedItems = removeSavedOpportunity(savedItemsRef.current, opportunityId)
    if (updatedItems === savedItemsRef.current) return false

    savedItemsRef.current = updatedItems
    setSavedItems(updatedItems)
    writeSavedItems(updatedItems)
    return true
  }, [])

  const isSaved = useCallback(
    (opportunityId) => savedItems.some((item) => item.id === opportunityId),
    [savedItems],
  )

  const value = useMemo(
    () => ({ savedItems, saveOpportunity, removeOpportunity, isSaved }),
    [savedItems, saveOpportunity, removeOpportunity, isSaved],
  )

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext)

  if (!context) {
    throw new Error('useSavedItems must be used inside a SavedItemsProvider.')
  }

  return context
}
