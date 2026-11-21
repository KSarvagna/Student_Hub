/** Filter and optionally sort a copied opportunity list for catalogue discovery. */
export function discoverOpportunities(opportunities, { query = '', sortBy = 'recommended' } = {}) {
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = opportunities.filter((item) => {
    if (!normalizedQuery) return true
    const searchableText = [
      item.name,
      item.provider,
      item.summary_plain,
      item.benefit_text,
      item.government_level,
      item.state_code,
      ...(item.education_levels ?? []),
    ].filter(Boolean).join(' ').toLowerCase()
    return searchableText.includes(normalizedQuery)
  })

  if (sortBy !== 'deadline') return filtered

  return filtered
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftDeadline = left.item.deadline ?? null
      const rightDeadline = right.item.deadline ?? null
      if (leftDeadline === null && rightDeadline !== null) return 1
      if (leftDeadline !== null && rightDeadline === null) return -1
      if (leftDeadline !== rightDeadline) return leftDeadline < rightDeadline ? -1 : 1
      return left.index - right.index
    })
    .map(({ item }) => item)
}
