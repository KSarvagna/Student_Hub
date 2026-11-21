import { describe, expect, it } from 'vitest'
import {
  deadlineBucket,
  daysLeft,
  evaluateRule,
  evaluateScheme,
  rankItems,
} from './eligibility.js'

describe('evaluateRule', () => {
  it.each([
    ['==', 5, 5, 'pass'],
    ['==', 5, 4, 'fail'],
    ['!=', 5, 4, 'pass'],
    ['!=', 5, 5, 'fail'],
    ['<', 4, 5, 'pass'],
    ['<', 5, 4, 'fail'],
    ['<=', 5, 5, 'pass'],
    ['<=', 6, 5, 'fail'],
    ['>', 6, 5, 'pass'],
    ['>', 5, 6, 'fail'],
    ['>=', 5, 5, 'pass'],
    ['>=', 4, 5, 'fail'],
    ['in', 'sc', ['sc', 'st'], 'pass'],
    ['in', 'general', ['sc', 'st'], 'fail'],
    ['not_in', 'general', ['sc', 'st'], 'pass'],
    ['not_in', 'sc', ['sc', 'st'], 'fail'],
  ])('%s returns %s for the supplied values', (op, profileValue, ruleValue, expected) => {
    expect(
      evaluateRule(
        { field: 'value', op, value: ruleValue },
        { value: profileValue },
      ),
    ).toBe(expected)
  })

  it('compares strings without regard to case, including membership', () => {
    expect(
      evaluateRule({ field: 'state', op: '==', value: 'Karnataka' }, { state: 'kArNaTaKa' }),
    ).toBe('pass')
    expect(
      evaluateRule({ field: 'state', op: 'in', value: ['Tamil Nadu'] }, { state: 'TAMIL NADU' }),
    ).toBe('pass')
    expect(
      evaluateRule({ field: 'state', op: '<', value: 'b' }, { state: 'A' }),
    ).toBe('pass')
  })

  it.each([undefined, null, '', '   '])('returns unknown for a missing or empty profile value: %s', (value) => {
    expect(evaluateRule({ field: 'income', op: '<=', value: 100 }, { income: value })).toBe('unknown')
  })

  it('returns unknown when the profile or field is missing', () => {
    expect(evaluateRule({ field: 'income', op: '<=', value: 100 }, {})).toBe('unknown')
    expect(evaluateRule({ field: 'income', op: '<=', value: 100 }, undefined)).toBe('unknown')
  })
})

describe('evaluateScheme', () => {
  const underLimit = { id: 'income', field: 'income', op: '<=', value: 100 }

  it('returns eligible when all rules pass', () => {
    expect(evaluateScheme({ rules: [underLimit] }, { income: 50 })).toEqual({
      status: 'eligible',
      passed: [underLimit],
      failed: [],
      unknown: [],
    })
  })

  it('returns almost when exactly one rule fails', () => {
    const result = evaluateScheme({ rules: [underLimit] }, { income: 150 })
    expect(result.status).toBe('almost')
    expect(result.failed).toEqual([underLimit])
  })

  it('returns not_eligible when two or more rules fail', () => {
    const categoryRule = { field: 'category', op: '==', value: 'sc' }
    expect(
      evaluateScheme({ rules: [underLimit, categoryRule] }, { income: 150, category: 'general' }).status,
    ).toBe('not_eligible')
  })

  it('returns needs_info when a rule is unknown and none fail', () => {
    const result = evaluateScheme({ rules: [underLimit] }, {})
    expect(result.status).toBe('needs_info')
    expect(result.unknown).toEqual([underLimit])
  })

  it('returns almost for one failed rule even when another rule is unknown', () => {
    const categoryRule = { field: 'category', op: '==', value: 'sc' }
    expect(
      evaluateScheme({ rules: [underLimit, categoryRule] }, { income: 150 }).status,
    ).toBe('almost')
  })

  it('returns eligible for a scheme with no rules', () => {
    expect(evaluateScheme({ rules: [] }, {})).toEqual({
      status: 'eligible',
      passed: [],
      failed: [],
      unknown: [],
    })
    expect(evaluateScheme({}, {})).toMatchObject({ status: 'eligible' })
  })
})

describe('daysLeft', () => {
  it('counts calendar days using ISO dates', () => {
    expect(daysLeft('2026-11-20', '2026-11-20')).toBe(0)
    expect(daysLeft('2026-11-27', '2026-11-20')).toBe(7)
    expect(daysLeft('2026-11-28', '2026-11-20')).toBe(8)
    expect(daysLeft('2026-12-20', '2026-11-20')).toBe(30)
    expect(daysLeft('2026-11-19', '2026-11-20')).toBe(-1)
  })

  it('handles month and year boundaries', () => {
    expect(daysLeft('2027-01-01', '2026-12-31')).toBe(1)
  })

  it('uses the local calendar date for Date inputs', () => {
    const today = new Date(2026, 10, 20, 23, 59)
    expect(daysLeft('2026-11-21', today)).toBe(1)
  })

  it('returns null when there is no deadline', () => {
    expect(daysLeft(null, '2026-11-20')).toBeNull()
    expect(daysLeft('', '2026-11-20')).toBeNull()
  })
})

describe('deadlineBucket', () => {
  it.each([
    [null, 'open'],
    [-1, 'closed'],
    [0, 'urgent'],
    [7, 'urgent'],
    [8, 'soon'],
    [30, 'soon'],
    [31, 'open'],
  ])('maps %s days to %s', (days, expected) => {
    expect(deadlineBucket(days)).toBe(expected)
  })
})

describe('rankItems', () => {
  it('sorts by status, then earliest deadline, putting undated items last', () => {
    const items = [
      { id: 'not-eligible', status: 'not_eligible', deadline: '2026-11-21' },
      { id: 'almost-later', status: 'almost', deadline: '2026-12-01' },
      { id: 'eligible-later', status: 'eligible', deadline: '2026-12-01' },
      { id: 'eligible-sooner', status: 'eligible', deadline: '2026-11-22' },
      { id: 'needs-info', status: 'needs_info', deadline: null },
      { id: 'almost-sooner', status: 'almost', deadline: '2026-11-23' },
      { id: 'eligible-open', status: 'eligible', deadline: null },
    ]

    expect(rankItems(items).map((item) => item.id)).toEqual([
      'eligible-sooner',
      'eligible-later',
      'eligible-open',
      'almost-sooner',
      'almost-later',
      'needs-info',
      'not-eligible',
    ])
    expect(items[0].id).toBe('not-eligible')
  })
})
