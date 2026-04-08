import { expect, test } from '../../../baseFixtures'
import * as allure from 'allure-js-commons'
import type { EligibilityRule } from '../../../../app/types'
import { evaluateRule } from '../../../../app/composables/useEligibilityEvaluator'

const baseRule: EligibilityRule = {
  id: 'test-rule',
  pathwayId: 'test-pathway',
  ruleType: 'age_min',
  operator: 'gte',
  valueInt: null,
  valueString: null,
  valueList: null,
  perDependent: false,
  dependentIncrementUsd: null,
  hardRequirement: true,
  displayLabel: 'Test rule',
  notes: null,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01'
}

const baseProfile = {
  nationality: 'AT',
  age: 52,
  monthlyIncomeUsd: 2000,
  employmentStatus: 'retired',
  dependentsCount: 0,
  hasHealthInsurance: true,
  hasCriminalRecord: false
}

test.describe('Age requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Age requirements')
  })

  test('passes when age meets the minimum requirement', () => {
    const rule = { ...baseRule, ruleType: 'age_min', operator: 'gte', valueInt: 50 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('passes when age exactly equals the minimum', () => {
    const rule = { ...baseRule, ruleType: 'age_min', operator: 'gte', valueInt: 52 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('fails when age is below the minimum', () => {
    const rule = { ...baseRule, ruleType: 'age_min', operator: 'gte', valueInt: 50 }
    expect(evaluateRule(rule, { ...baseProfile, age: 45 })).toBe(false)
  })

  test('fails when age is not provided', () => {
    const rule = { ...baseRule, ruleType: 'age_min', operator: 'gte', valueInt: 50 }
    expect(evaluateRule(rule, { ...baseProfile, age: null })).toBe(false)
  })

  test('returns true when operator is not gte', () => {
    const rule = { ...baseRule, ruleType: 'age_min', operator: 'lte' as any, valueInt: 50 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })
})

test.describe('Age max requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Age max requirements')
  })

  test('passes when age meets the maximum requirement', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'lte', valueInt: 60 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('passes when age exactly equals the maximum', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'lte', valueInt: 52 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('fails when age is above the maximum', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'lte', valueInt: 50 }
    expect(evaluateRule(rule, baseProfile)).toBe(false)
  })

  test('fails when age is not provided', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'lte', valueInt: 60 }
    expect(evaluateRule(rule, { ...baseProfile, age: null })).toBe(false)
  })

  test('returns true when operator is not lte', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'gte' as any, valueInt: 60 }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('uses default valueInt when not provided', () => {
    const rule = { ...baseRule, ruleType: 'age_max', operator: 'lte', valueInt: null }
    expect(evaluateRule(rule, { ...baseProfile, age: 1000 })).toBe(false)
    expect(evaluateRule(rule, { ...baseProfile, age: 999 })).toBe(true)
  })
})

test.describe('Income requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Income requirements')
  })

  test('passes when annual income meets the threshold', () => {
    const rule = { ...baseRule, ruleType: 'income_min', operator: 'gte', valueInt: 18000 }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: 1500 })).toBe(true)
  })

  test('fails when annual income is below the threshold', () => {
    const rule = { ...baseRule, ruleType: 'income_min', operator: 'gte', valueInt: 18000 }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: 1000 })).toBe(false)
  })

  test('fails when income is not provided', () => {
    const rule = { ...baseRule, ruleType: 'income_min', operator: 'gte', valueInt: 18000 }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: null })).toBe(false)
  })

  test('adds the dependent income increment to the threshold', () => {
    const rule = {
      ...baseRule,
      ruleType: 'income_min',
      operator: 'gte',
      valueInt: 18000,
      perDependent: true,
      dependentIncrementUsd: 6000
    }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: 2000, dependentsCount: 1 })).toBe(
      true
    )
  })

  test('fails when income does not cover the dependent increment', () => {
    const rule = {
      ...baseRule,
      ruleType: 'income_min',
      operator: 'gte',
      valueInt: 18000,
      perDependent: true,
      dependentIncrementUsd: 6000
    }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: 1500, dependentsCount: 1 })).toBe(
      false
    )
  })

  test('uses default valueInt and no increment when not perDependent', () => {
    const rule = {
      ...baseRule,
      ruleType: 'income_min',
      operator: 'gte',
      valueInt: null,
      perDependent: false,
      dependentIncrementUsd: 6000
    }
    expect(evaluateRule(rule, { ...baseProfile, monthlyIncomeUsd: 1, dependentsCount: 1 })).toBe(
      true
    )
  })
})

test.describe('Nationality requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Nationality requirements')
  })

  test('passes when nationality is in the allowed list', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_allowed',
      operator: 'in',
      valueList: '["AT","DE","GB"]'
    }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('fails when nationality is not in the allowed list', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_allowed',
      operator: 'in',
      valueList: '["DE","GB"]'
    }
    expect(evaluateRule(rule, baseProfile)).toBe(false)
  })

  test('passes when valueList is not provided for allowed', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_allowed',
      operator: 'in',
      valueList: null
    }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })
})

test.describe('Nationality requirements (excluded)', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Nationality requirements (excluded)')
  })

  test('passes when nationality is not in the excluded list', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_excluded',
      operator: 'not_in',
      valueList: '["IR","KP","SY"]'
    }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })

  test('fails when nationality is in the excluded list', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_excluded',
      operator: 'not_in',
      valueList: '["AT","IR"]'
    }
    expect(evaluateRule(rule, baseProfile)).toBe(false)
  })

  test('passes when valueList is not provided for excluded', () => {
    const rule = {
      ...baseRule,
      ruleType: 'nationality_excluded',
      operator: 'not_in',
      valueList: null
    }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })
})

test.describe('Health insurance requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Health insurance requirements')
  })

  test('passes when the user has valid health insurance', () => {
    const rule = { ...baseRule, ruleType: 'health_insurance', operator: 'exists' }
    expect(evaluateRule(rule, { ...baseProfile, hasHealthInsurance: true })).toBe(true)
  })

  test('fails when the user does not have health insurance', () => {
    const rule = { ...baseRule, ruleType: 'health_insurance', operator: 'exists' }
    expect(evaluateRule(rule, { ...baseProfile, hasHealthInsurance: false })).toBe(false)
  })
})

test.describe('Criminal record requirements', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('Frontend')
    await allure.suite('Eligibility engine')
    await allure.subSuite('Criminal record requirements')
  })

  test('passes when the user has a clean criminal record', () => {
    const rule = {
      ...baseRule,
      ruleType: 'other',
      operator: 'exists',
      valueString: 'clean_criminal_record'
    }
    expect(evaluateRule(rule, { ...baseProfile, hasCriminalRecord: false })).toBe(true)
  })

  test('fails when the user has a criminal record', () => {
    const rule = {
      ...baseRule,
      ruleType: 'other',
      operator: 'exists',
      valueString: 'clean_criminal_record'
    }
    expect(evaluateRule(rule, { ...baseProfile, hasCriminalRecord: true })).toBe(false)
  })

  test('passes when other valueString is not recognized', () => {
    const rule = {
      ...baseRule,
      ruleType: 'other',
      operator: 'exists',
      valueString: 'something_else'
    }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })
})

test.describe('Default requirements', () => {
  test('passes when ruleType is unknown', () => {
    const rule = { ...baseRule, ruleType: 'unknown' as any }
    expect(evaluateRule(rule, baseProfile)).toBe(true)
  })
})
