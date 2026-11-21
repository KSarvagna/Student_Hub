/** Add an opportunity once, using its stable id to prevent duplicates. */
export function addSavedOpportunity(items, opportunity) {
  if (items.some((item) => item.id === opportunity.id)) return items
  return [...items, opportunity]
}

/** Remove a saved opportunity by id. */
export function removeSavedOpportunity(items, opportunityId) {
  const remaining = items.filter((item) => item.id !== opportunityId)
  return remaining.length === items.length ? items : remaining
}

/** Sort by earliest ISO deadline, preserving order for ties and undated items. */
export function sortSavedOpportunities(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftDeadline = left.item.deadline || null
      const rightDeadline = right.item.deadline || null

      if (leftDeadline === null && rightDeadline !== null) return 1
      if (leftDeadline !== null && rightDeadline === null) return -1
      if (leftDeadline !== rightDeadline) return leftDeadline < rightDeadline ? -1 : 1
      return left.index - right.index
    })
    .map(({ item }) => item)
}
