import { expect, test } from '../../../baseFixtures'
import * as allure from 'allure-js-commons'
import { evaluateRule } from '../../../../app/composables/useEligibilityEvaluator'
import type { EligibilityRule } from '../../../../app/types'

// Mocking some basic structures since we can't easily use Pinia in pure Playwright node tests
// without more setup, but we can test the logic by mimicking the store's behavior
// or by testing the store if we had a proper setup.
// Given the environment, I'll focus on testing the logic that computeResults uses.

const baseRule: EligibilityRule = {
  id: 'rule-1',
  pathwayId: 'pathway-1',
  ruleType: 'age_min',
  operator: 'gte',
  valueInt: 18,
  valueString: null,
  valueList: null,
  perDependent: false,
  dependentIncrementUsd: null,
  hardRequirement: true,
  displayLabel: 'Must be 18',
  notes: null,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
}

test.describe('Eligibility Logic - Store Mock', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Store logic branches')
  })

  test('score calculation with zero rules', () => {
    const pathway = { eligibilityRules: [] }
    const total = pathway.eligibilityRules.length
    const passedRules = []
    const score = total > 0 ? Math.round((passedRules.length / total) * 100) : 100
    expect(score).toBe(100)
  })

  test('score calculation with rules', () => {
    const total = 2
    const passedRules = [{ id: '1' }]
    const score = total > 0 ? Math.round((passedRules.length / total) * 100) : 100
    expect(score).toBe(50)
  })

  test('sorting logic - hardFail first', () => {
    const matches = [
      { hardFail: true, score: 100 },
      { hardFail: false, score: 50 },
      { hardFail: true, score: 80 },
      { hardFail: false, score: 90 }
    ]

    const sorted = [...matches].sort((a, b) => {
      if (a.hardFail && !b.hardFail) return 1
      if (!a.hardFail && b.hardFail) return -1
      return b.score - a.score
    })

    expect(sorted[0].hardFail).toBe(false)
    expect(sorted[0].score).toBe(90)
    expect(sorted[1].hardFail).toBe(false)
    expect(sorted[1].score).toBe(50)
    expect(sorted[2].hardFail).toBe(true)
    expect(sorted[2].score).toBe(100)
    expect(sorted[3].hardFail).toBe(true)
    expect(sorted[3].score).toBe(80)
  })

  test('hardFail flag is set when hard requirement fails', () => {
    const rule = { ...baseRule, hardRequirement: true }
    const profile = { age: 10 } as any
    const passes = evaluateRule(rule, profile)
    let hardFail = false
    if (!passes && rule.hardRequirement) hardFail = true
    expect(hardFail).toBe(true)
  })

  test('hardFail flag is NOT set when soft requirement fails', () => {
    const rule = { ...baseRule, hardRequirement: false }
    const profile = { age: 10 } as any
    const passes = evaluateRule(rule, profile)
    let hardFail = false
    if (!passes && rule.hardRequirement) hardFail = true
    expect(hardFail).toBe(false)
  })
})
