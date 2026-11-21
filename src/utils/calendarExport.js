const SAMPLE_DEADLINE_WARNING = 'SAMPLE — UNVERIFIED DEADLINE'

function getCalendarDate(value) {
  if (typeof value !== 'string') return null

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month - 1, day)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return `${yearText}${monthText}${dayText}`
}

function escapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function foldLine(line) {
  const encoder = new TextEncoder()
  const folded = []
  let current = ''
  let byteLength = 0

  for (const character of line) {
    const characterBytes = encoder.encode(character).length
    if (byteLength + characterBytes > 75) {
      folded.push(current)
      current = ` ${character}`
      byteLength = 1 + characterBytes
    } else {
      current += character
      byteLength += characterBytes
    }
  }

  folded.push(current)
  return folded.join('\r\n')
}

function formatTimestamp(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Calendar timestamp must be a valid date.')
  }

  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function makeUid(opportunity, index) {
  const source = String(opportunity.id ?? `saved-opportunity-${index}`)
  const bytes = new TextEncoder().encode(source)
  const encodedId = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${encodedId}@student-hub.invalid`
}

/** Build a date-only iCalendar file for saved opportunities with valid dates. */
export function createCalendarContent(opportunities, now = new Date()) {
  const savedOpportunities = Array.isArray(opportunities) ? opportunities : []
  const datedOpportunities = savedOpportunities
    .map((opportunity, index) => ({ opportunity, index, date: getCalendarDate(opportunity?.deadline) }))
    .filter(({ date }) => date !== null)

  if (datedOpportunities.length === 0) return ''

  const timestamp = formatTimestamp(now)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Student Hub//Calendar Export//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Student Hub Deadlines',
  ]

  for (const { opportunity, index, date } of datedOpportunities) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${makeUid(opportunity, index)}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${date}`,
      `SUMMARY:${escapeText(`Application deadline: ${opportunity.name || 'Saved opportunity'}`)}`,
      `DESCRIPTION:${escapeText(`${SAMPLE_DEADLINE_WARNING}\nConfirm this date on the official source before applying.`)}`,
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return `${lines.map(foldLine).join('\r\n')}\r\n`
}
