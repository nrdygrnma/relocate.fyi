import { defineStore } from 'pinia'
import type { Pathway, EligibilityRule } from '~/types'

export interface UserProfile {
  nationality: string
  age: number | null
  monthlyIncomeUsd: number | null
  employmentStatus: string
  dependentsCount: number
  hasHealthInsurance: boolean
  hasCriminalRecord: boolean
}

export interface PathwayMatch {
  pathway: Pathway
  score: number
  hardFail: boolean
  failedRules: EligibilityRule[]
  passedRules: EligibilityRule[]
}

const defaultProfile: UserProfile = {
  nationality: '',
  age: null,
  monthlyIncomeUsd: null,
  employmentStatus: '',
  dependentsCount: 0,
  hasHealthInsurance: false,
  hasCriminalRecord: false
}

export const usePathwayFinderStore = defineStore('pathwayFinder', () => {
  const allPathways = ref<Pathway[]>([])
  const userProfile = ref<UserProfile>({ ...defaultProfile })
  const results = ref<PathwayMatch[]>([])
  const loading = ref(false)
  const step = ref(1)
  const totalSteps = 6

  async function fetchPathways() {
    loading.value = true
    try {
      allPathways.value = await $fetch<Pathway[]>('/api/pathways')
    } finally {
      loading.value = false
    }
  }

  function nextStep() {
    if (step.value < totalSteps) step.value++
  }

  function prevStep() {
    if (step.value > 1) step.value--
  }

  function goToStep(n: number) {
    step.value = n
  }

  function reset() {
    userProfile.value = { ...defaultProfile }
    results.value = []
    step.value = 1
  }

  function evaluateRule(rule: EligibilityRule, profile: UserProfile): boolean {
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

  function computeResults() {
    const profile = userProfile.value
    const matches: PathwayMatch[] = []

    for (const pathway of allPathways.value) {
      const failedRules: EligibilityRule[] = []
      const passedRules: EligibilityRule[] = []
      let hardFail = false

      for (const rule of pathway.eligibilityRules) {
        const passes = evaluateRule(rule, profile)
        if (passes) {
          passedRules.push(rule)
        } else {
          failedRules.push(rule)
          if (rule.hardRequirement) hardFail = true
        }
      }

      const total = pathway.eligibilityRules.length
      const score = total > 0 ? Math.round((passedRules.length / total) * 100) : 100

      matches.push({ pathway, score, hardFail, failedRules, passedRules })
    }

    results.value = matches.sort((a, b) => {
      if (a.hardFail && !b.hardFail) return 1
      if (!a.hardFail && b.hardFail) return -1
      return b.score - a.score
    })
  }

  return {
    allPathways,
    userProfile,
    results,
    loading,
    step,
    totalSteps,
    fetchPathways,
    nextStep,
    prevStep,
    goToStep,
    reset,
    computeResults
  }
})
