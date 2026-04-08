import { defineStore } from 'pinia'
import type { Pathway } from '~/types'

export const useAdminPathwaysStore = defineStore('adminPathways', () => {
  const pathways = ref<Pathway[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  async function fetchPathways() {
    loading.value = true
    error.value = null
    try {
      pathways.value = await $fetch<Pathway[]>('/api/admin/pathways')
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to fetch pathways'
    } finally {
      loading.value = false
    }
  }

  async function createPathway(data: Partial<Pathway>) {
    saving.value = true
    error.value = null
    try {
      const pathway = await $fetch<Pathway>('/api/admin/pathways', {
        method: 'POST',
        body: data
      })
      pathways.value.unshift(pathway)
      return pathway
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to create pathway'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updatePathway(id: string, data: Partial<Pathway>) {
    saving.value = true
    error.value = null
    try {
      const updated = await $fetch<Pathway>(`/api/admin/pathways/${id}`, {
        method: 'PATCH',
        body: data
      })
      const index = pathways.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        pathways.value[index] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to update pathway'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deletePathway(id: string) {
    saving.value = true
    error.value = null
    try {
      await $fetch(`/api/admin/pathways/${id}`, {
        method: 'DELETE'
      })
      pathways.value = pathways.value.filter((p) => p.id !== id)
      return true
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to delete pathway'
      return false
    } finally {
      saving.value = false
    }
  }

  async function togglePublish(id: string, published: boolean) {
    return updatePathway(id, { published })
  }

  // Steps
  async function createStep(data: any) {
    saving.value = true
    try {
      return await $fetch('/api/admin/steps', { method: 'POST', body: data })
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to create step'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateStep(id: string, data: any) {
    saving.value = true
    try {
      return await $fetch(`/api/admin/steps/${id}`, { method: 'PATCH', body: data })
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to update step'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deleteStep(id: string) {
    saving.value = true
    try {
      await $fetch(`/api/admin/steps/${id}`, { method: 'DELETE' })
      return true
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to delete step'
      return false
    } finally {
      saving.value = false
    }
  }

  async function updateStepsOrder(pathwayId: string, steps: { id: string; orderIndex: number }[]) {
    saving.value = true
    error.value = null
    try {
      await $fetch(`/api/admin/pathways/${pathwayId}/steps/reorder`, {
        method: 'POST',
        body: { steps }
      })
      return true
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to update steps order'
      return false
    } finally {
      saving.value = false
    }
  }

  async function suggestAIPathways(countryName: string, categories: string[]) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<{ pathways: any[] }>('/api/admin/ai/suggest-pathways', {
        method: 'POST',
        body: { countryName, categories }
      })
      return data.pathways
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'AI suggestion failed'
      return null
    } finally {
      loading.value = false
    }
  }

  async function generateAIRules(countryName: string, pathwayName: string) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<{ rules: any[] }>('/api/admin/ai/generate-eligibility-rules', {
        method: 'POST',
        body: { countryName, pathwayName }
      })
      return data.rules
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'AI generation failed'
      return null
    } finally {
      loading.value = false
    }
  }

  async function generateAISteps(countryName: string, pathwayName: string) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<{ steps: any[] }>('/api/admin/ai/generate-steps', {
        method: 'POST',
        body: { countryName, pathwayName }
      })
      return data.steps
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'AI generation failed'
      return null
    } finally {
      loading.value = false
    }
  }

  // Eligibility Rules
  async function createRule(data: any) {
    saving.value = true
    try {
      return await $fetch('/api/admin/eligibility-rules', { method: 'POST', body: data })
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to create rule'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateRule(id: string, data: any) {
    saving.value = true
    try {
      return await $fetch(`/api/admin/eligibility-rules/${id}`, { method: 'PATCH', body: data })
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to update rule'
      return null
    } finally {
      saving.value = false
    }
  }

  async function deleteRule(id: string) {
    saving.value = true
    try {
      await $fetch(`/api/admin/eligibility-rules/${id}`, { method: 'DELETE' })
      return true
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Failed to delete rule'
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    pathways,
    loading,
    saving,
    error,
    fetchPathways,
    createPathway,
    updatePathway,
    deletePathway,
    togglePublish,
    createStep,
    updateStep,
    deleteStep,
    updateStepsOrder,
    suggestAIPathways,
    generateAIRules,
    generateAISteps,
    createRule,
    updateRule,
    deleteRule
  }
})
