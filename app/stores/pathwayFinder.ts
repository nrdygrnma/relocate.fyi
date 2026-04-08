import { defineStore } from 'pinia'
import type { EligibilityRule, Pathway } from '~/types'
import { evaluateRule } from '~/composables/useEligibilityEvaluator'

export interface UserProfile {
  originCountry: string
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
  originCountry: '',
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
  const totalSteps = 7

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
