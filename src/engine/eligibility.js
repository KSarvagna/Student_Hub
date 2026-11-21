const STATUS_ORDER = {
  eligible: 0,
  almost: 1,
  needs_info: 2,
  not_eligible: 3,
}

function isMissing(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  )
}

function equalValues(left, right) {
  if (typeof left === 'string' && typeof right === 'string') {
    return left.toLowerCase() === right.toLowerCase()
  }

  return left === right
}

function compareValues(left, right, operator) {
  if (typeof left === 'string' && typeof right === 'string') {
    left = left.toLowerCase()
    right = right.toLowerCase()
  }

  switch (operator) {
    case '==':
      return equalValues(left, right)
    case '!=':
      return !equalValues(left, right)
    case '<':
      return left < right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '>=':
      return left >= right
    default:
      throw new Error(`Unsupported comparison operator: ${operator}`)
  }
}

/** Evaluate one rule against a profile. */
export function evaluateRule(rule, profile) {
  const profileValue = profile?.[rule.field]

  if (isMissing(profileValue)) {
    return 'unknown'
  }

  if (rule.op === 'in' || rule.op === 'not_in') {
    if (!Array.isArray(rule.value)) {
      throw new TypeError(`The ${rule.op} operator requires an array value.`)
    }

    const found = rule.value.some((item) => equalValues(profileValue, item))
    const passes = rule.op === 'in' ? found : !found
    return passes ? 'pass' : 'fail'
  }

  return compareValues(profileValue, rule.value, rule.op) ? 'pass' : 'fail'
}

/** Evaluate every rule for an opportunity and summarize its eligibility. */
export function evaluateScheme(scheme, profile) {
  const passed = []
  const failed = []
  const unknown = []

  for (const rule of scheme.rules ?? []) {
    const result = evaluateRule(rule, profile)

    if (result === 'pass') passed.push(rule)
    if (result === 'fail') failed.push(rule)
    if (result === 'unknown') unknown.push(rule)
  }

  let status
  if (unknown.length > 0 && failed.length === 0) {
    status = 'needs_info'
  } else if (failed.length === 0 && unknown.length === 0) {
    status = 'eligible'
  } else if (failed.length === 1) {
    status = 'almost'
  } else {
    status = 'not_eligible'
  }

  return { status, passed, failed, unknown }
}

function dayNumber(value, argumentName) {
  let year
  let month
  let day

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError(`${argumentName} must be a valid date.`)
    }

    // Use the Date's local calendar date, then do the math in UTC.
    year = value.getFullYear()
    month = value.getMonth() + 1
    day = value.getDate()
  } else if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) {
      throw new RangeError(`${argumentName} must be an ISO date (YYYY-MM-DD).`)
    }

    year = Number(match[1])
    month = Number(match[2])
    day = Number(match[3])
  } else {
    throw new RangeError(`${argumentName} must be a Date or ISO date string.`)
  }

  const utcDate = new Date(0)
  utcDate.setUTCHours(0, 0, 0, 0)
  utcDate.setUTCFullYear(year, month - 1, day)

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    throw new RangeError(`${argumentName} must be a valid calendar date.`)
  }

  return utcDate.getTime() / 86_400_000
}

/** Return whole calendar days from today until a deadline. */
export function daysLeft(deadline, today) {
  if (deadline === null || deadline === undefined || deadline === '') {
    return null
  }

  return dayNumber(deadline, 'deadline') - dayNumber(today, 'today')
}

/** Group a deadline by how soon it is due. */
export function deadlineBucket(days) {
  if (days === null) return 'open'
  if (days < 0) return 'closed'
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'open'
}

/** Sort copied results by eligibility, then by earliest deadline. */
export function rankItems(results) {
  return results
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftStatus = STATUS_ORDER[left.item.status] ?? Number.MAX_SAFE_INTEGER
      const rightStatus = STATUS_ORDER[right.item.status] ?? Number.MAX_SAFE_INTEGER

      if (leftStatus !== rightStatus) return leftStatus - rightStatus

      const leftDeadline = left.item.deadline ?? null
      const rightDeadline = right.item.deadline ?? null

      if (leftDeadline === null && rightDeadline !== null) return 1
      if (leftDeadline !== null && rightDeadline === null) return -1
      if (leftDeadline !== rightDeadline) {
        return leftDeadline < rightDeadline ? -1 : 1
      }

      return left.index - right.index
    })
    .map(({ item }) => item)
}
