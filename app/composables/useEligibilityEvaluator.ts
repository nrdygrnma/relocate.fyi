import type { EligibilityRule } from '~/types'
import type { UserProfile } from '~/stores/pathwayFinder'

export function evaluateRule(rule: EligibilityRule, profile: UserProfile): boolean {
  switch (rule.ruleType) {
    case 'age_min':
      if (profile.age === null) return false
      return rule.operator === 'gte' ? profile.age >= (rule.valueInt ?? 0) : true

    case 'age_max':
      if (profile.age === null) return false
      return rule.operator === 'lte' ? profile.age <= (rule.valueInt ?? 999) : true

    case 'income_min': {
      if (profile.monthlyIncomeUsd === null) return false
      const annualIncome = profile.monthlyIncomeUsd * 12
      const threshold =
        (rule.valueInt ?? 0) +
        (rule.perDependent ? (rule.dependentIncrementUsd ?? 0) * profile.dependentsCount : 0)
      return annualIncome >= threshold
    }

    case 'nationality_allowed': {
      if (!rule.valueList) return true
      const allowed = JSON.parse(rule.valueList) as string[]
      return allowed.includes(profile.nationality)
    }

    case 'nationality_excluded': {
      if (!rule.valueList) return true
      const excluded = JSON.parse(rule.valueList) as string[]
      return !excluded.includes(profile.nationality)
    }

    case 'health_insurance':
      return profile.hasHealthInsurance

    case 'other':
      if (rule.valueString === 'clean_criminal_record') {
        return !profile.hasCriminalRecord
      }
      return true

    default:
      return true
  }
}
