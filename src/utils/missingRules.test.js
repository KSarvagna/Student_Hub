import { describe, expect, it } from 'vitest'
import { aggregateMissingRules } from './missingRules.js'

function failedRule(overrides = {}) {
  return {
    id: 'category-rule',
    field: 'category',
    op: 'in',
    value: ['sc', 'st'],
    label: 'Category matches the listed groups',
    missing_hint: 'Your category does not match the listed groups.',
    ...overrides,
  }
}

describe('aggregateMissingRules', () => {
  it('counts failed criteria across opportunities', () => {
    const result = aggregateMissingRules([
      { id: 'one', name: 'Opportunity One', failed: [failedRule()] },
      { id: 'two', name: 'Opportunity Two', failed: [failedRule()] },
    ])

    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(2)
  })

  it('excludes passed and unknown rules', () => {
    const result = aggregateMissingRules([{
      id: 'one',
      name: 'Opportunity One',
      passed: [failedRule({ field: 'income' })],
      unknown: [failedRule({ field: 'state' })],
      failed: [failedRule()],
    }])

    expect(result).toHaveLength(1)
    expect(result[0].field).toBe('category')
  })

  it('groups identical criteria while ignoring order and case for string membership values', () => {
    const result = aggregateMissingRules([
      { id: 'one', name: 'Opportunity One', failed: [failedRule()] },
      { id: 'two', name: 'Opportunity Two', failed: [failedRule({ value: ['ST', 'SC'] })] },
    ])

    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(2)
  })

  it('keeps different thresholds separate even when they share an id and label', () => {
    const result = aggregateMissingRules([
      { id: 'one', name: 'Opportunity One', failed: [failedRule({ id: 'income-limit', field: 'income', op: '<=', value: 400000, label: 'Income is within the limit' })] },
      { id: 'two', name: 'Opportunity Two', failed: [failedRule({ id: 'income-limit', field: 'income', op: '<=', value: 750000, label: 'Income is within the limit' })] },
    ])

    expect(result).toHaveLength(2)
    expect(result.map((rule) => rule.value)).toEqual([400000, 750000])
  })

  it('includes the names of distinct affected opportunities', () => {
    const result = aggregateMissingRules([
      { id: 'one', name: 'First opportunity', failed: [failedRule()] },
      { id: 'two', name: 'Second opportunity', failed: [failedRule()] },
      { id: 'three', name: 'No failure', failed: [] },
    ])

    expect(result[0].opportunityNames).toEqual(['First opportunity', 'Second opportunity'])
  })

  it('counts an opportunity once and keeps equal-count rules in first-seen order', () => {
    const first = failedRule()
    const second = failedRule({ field: 'state', id: 'state-rule', label: 'State matches' })
    const result = aggregateMissingRules([
      { id: 'one', name: 'Opportunity One', failed: [first, first, second] },
      { id: 'two', name: 'Opportunity Two', failed: [second] },
    ])

    expect(result.map(({ field, count }) => [field, count])).toEqual([
      ['state', 2],
      ['category', 1],
    ])

    const tied = aggregateMissingRules([
      { id: 'one', name: 'Opportunity One', failed: [first, second] },
    ])
    expect(tied.map((rule) => rule.field)).toEqual(['category', 'state'])
    expect(tied.map((rule) => rule.count)).toEqual([1, 1])
  })

  it('handles empty, missing, and non-array rule collections', () => {
    expect(aggregateMissingRules([])).toEqual([])
    expect(aggregateMissingRules(undefined)).toEqual([])
    expect(aggregateMissingRules([
      { id: 'one', name: 'Opportunity One' },
      { id: 'two', name: 'Opportunity Two', failed: null },
    ])).toEqual([])
  })

  it('handles missing labels, hints, and opportunity names safely', () => {
    const result = aggregateMissingRules([
      { id: 'one', failed: [failedRule({ label: undefined, missing_hint: null })] },
    ])

    expect(result[0].explanations).toEqual([{ label: null, missing_hint: null }])
    expect(result[0].opportunityNames).toEqual([])
  })

  it('does not mutate evaluated opportunities or their rules', () => {
    const rule = Object.freeze(failedRule())
    const opportunities = Object.freeze([
      Object.freeze({ id: 'one', name: 'Opportunity One', failed: Object.freeze([rule]), passed: Object.freeze([]), unknown: Object.freeze([]) }),
    ])
    const before = JSON.stringify(opportunities)

    aggregateMissingRules(opportunities)

    expect(JSON.stringify(opportunities)).toBe(before)
  })
})
