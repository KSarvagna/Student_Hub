function normalizeValue(value) {
  if (typeof value === 'string') return ['string', value.toLowerCase()]

  if (Array.isArray(value)) {
    const normalizedItems = [...new Set(value.map((item) => JSON.stringify(normalizeValue(item))))].sort()
    return ['array', normalizedItems]
  }

  if (value === undefined) return ['undefined']
  if (value === null) return ['null']
  return [typeof value, value]
}

function criterionKey(rule) {
  return JSON.stringify([
    rule.field ?? null,
    rule.op ?? null,
    normalizeValue(rule.value),
  ])
}

function optionalText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/** Group failed rule criteria by how many distinct opportunities fail them. */
export function aggregateMissingRules(opportunities) {
  if (!Array.isArray(opportunities) || opportunities.length === 0) return []

  const groups = new Map()

  opportunities.forEach((opportunity, index) => {
    const rules = Array.isArray(opportunity?.failed) ? opportunity.failed : []
    const opportunityId = opportunity?.id == null
      ? `index:${index}`
      : `id:${String(opportunity.id)}`

    for (const rule of rules) {
      if (!rule || typeof rule !== 'object') continue

      const key = criterionKey(rule)
      let group = groups.get(key)

      if (!group) {
        group = {
          key,
          field: rule.field,
          op: rule.op,
          value: rule.value,
          count: 0,
          opportunityIds: new Set(),
          opportunityNames: [],
          explanations: [],
          explanationKeys: new Set(),
          firstSeen: groups.size,
        }
        groups.set(key, group)
      }

      const label = optionalText(rule.label)
      const missingHint = optionalText(rule.missing_hint)
      const explanationKey = JSON.stringify([label, missingHint])
      if (!group.explanationKeys.has(explanationKey)) {
        group.explanationKeys.add(explanationKey)
        group.explanations.push({ label, missing_hint: missingHint })
      }

      if (!group.opportunityIds.has(opportunityId)) {
        group.opportunityIds.add(opportunityId)
        group.count += 1
        const name = optionalText(opportunity?.name)
        if (name) group.opportunityNames.push(name)
      }
    }
  })

  return [...groups.values()]
    .sort((left, right) => right.count - left.count || left.firstSeen - right.firstSeen)
    .map(({ opportunityIds, explanationKeys, firstSeen, ...group }) => group)
}
