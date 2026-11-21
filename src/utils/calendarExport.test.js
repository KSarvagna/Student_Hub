import { describe, expect, it } from 'vitest'
import { createCalendarContent } from './calendarExport.js'

const timestamp = new Date('2026-11-20T12:34:56.000Z')

function eventCount(content) {
  return (content.match(/BEGIN:VEVENT/g) ?? []).length
}

describe('createCalendarContent', () => {
  it('returns no calendar when the saved list is empty', () => {
    expect(createCalendarContent([], timestamp)).toBe('')
  })

  it('returns no calendar when there are no usable deadlines', () => {
    expect(createCalendarContent([
      { id: 'missing', name: 'Missing date' },
      { id: 'open', name: 'Open date', deadline: null },
      { id: 'invalid', name: 'Invalid date', deadline: '2026-02-30' },
    ], timestamp)).toBe('')
  })

  it('exports valid dated entries and skips missing and undated entries', () => {
    const content = createCalendarContent([
      { id: 'dated', name: 'Dated opportunity', deadline: '2027-03-04' },
      { id: 'open', name: 'Open opportunity', deadline: null },
      { id: 'missing', name: 'Missing date' },
    ], timestamp)

    expect(eventCount(content)).toBe(1)
    expect(content).toContain('SUMMARY:Application deadline: Dated opportunity')
    expect(content).not.toContain('Open opportunity')
    expect(content).not.toContain('Missing date')
  })

  it('includes expired deadlines without shifting their calendar date', () => {
    const content = createCalendarContent([
      { id: 'expired', name: 'Expired opportunity', deadline: '2020-01-02' },
    ], timestamp)

    expect(eventCount(content)).toBe(1)
    expect(content).toContain('DTSTART;VALUE=DATE:20200102')
  })

  it('formats an all-day event using date-only values and valid boundaries', () => {
    const content = createCalendarContent([
      { id: 'future', name: 'Future opportunity', deadline: '2027-03-04' },
    ], timestamp)

    expect(content).toContain('BEGIN:VCALENDAR\r\n')
    expect(content).toContain('VERSION:2.0\r\n')
    expect(content).toContain('PRODID:-//Student Hub//Calendar Export//EN\r\n')
    expect(content).toContain('BEGIN:VEVENT\r\n')
    expect(content).toContain('DTSTAMP:20261120T123456Z\r\n')
    expect(content).toContain('DTSTART;VALUE=DATE:20270304\r\n')
    expect(content).toContain('END:VEVENT\r\nEND:VCALENDAR\r\n')
    expect(content).not.toContain('DTSTART:')
  })

  it('escapes commas, semicolons, backslashes, and newlines in event text', () => {
    const content = createCalendarContent([
      {
        id: 'special',
        name: 'Grant, phase; one\\two\ncontinued',
        deadline: '2027-03-04',
      },
    ], timestamp)

    expect(content).toContain('SUMMARY:Application deadline: Grant\\, phase\\; one\\\\two\\ncontinued\r\n')
  })

  it('marks every event description as sample and unverified', () => {
    const content = createCalendarContent([
      { id: 'one', name: 'One', deadline: '2027-03-04' },
      { id: 'two', name: 'Two', deadline: '2027-03-05' },
    ], timestamp)

    expect(content.match(/SAMPLE — UNVERIFIED DEADLINE/g)).toHaveLength(2)
    expect(content.match(/DESCRIPTION:/g)).toHaveLength(2)
  })

  it('uses CRLF line endings and folds long UTF-8 lines within 75 octets', () => {
    const content = createCalendarContent([
      { id: 'long', name: 'વિદ્યાર્થી '.repeat(20), deadline: '2027-03-04' },
    ], timestamp)
    const lines = content.split('\r\n')

    expect(content.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/)
    expect(lines.every((line) => new TextEncoder().encode(line).length <= 75)).toBe(true)
    expect(lines.some((line) => line.startsWith(' '))).toBe(true)
  })

  it('does not mutate saved opportunity snapshots or unrelated checklist data', () => {
    const saved = Object.freeze([
      Object.freeze({
        id: 'saved',
        name: 'Saved opportunity',
        deadline: '2027-03-04',
        documents: Object.freeze([Object.freeze({ name: 'Income proof' })]),
      }),
    ])
    const checklist = Object.freeze({ saved: Object.freeze({ 'Income proof': true }) })
    const savedBefore = JSON.stringify(saved)
    const checklistBefore = JSON.stringify(checklist)

    createCalendarContent(saved, timestamp)

    expect(JSON.stringify(saved)).toBe(savedBefore)
    expect(JSON.stringify(checklist)).toBe(checklistBefore)
  })
})
