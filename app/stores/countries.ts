import { defineStore } from 'pinia'
import type { Country, DestinationProfile, OriginProfile, ProfileResponse } from '~/types'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const currentProfile = ref<ProfileResponse | null>(null)
  const adminProfile = ref<DestinationProfile | OriginProfile | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const referenceData = ref({
    countries: [] as any[],
    languages: [] as any[],
    currencies: [] as any[]
  })

  async function fetchCountries() {
    loading.value = true
    error.value = null
    try {
      countries.value = await $fetch<Country[]>('/api/countries')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminCountries() {
    loading.value = true
    error.value = null
    try {
      countries.value = await $fetch<Country[]>('/api/admin/countries')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile(slug: string) {
    loading.value = true
    error.value = null
    try {
      currentProfile.value = await $fetch<ProfileResponse>(`/api/countries/${slug}`)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminProfile(slug: string, type: 'destination' | 'origin') {
    loading.value = true
    error.value = null
    try {
      adminProfile.value = await $fetch(
        type === 'destination' ? `/api/admin/destination/${slug}` : `/api/admin/origin/${slug}`
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function saveDestinationProfile(slug: string, data: Partial<DestinationProfile>) {
    saving.value = true
    error.value = null
    try {
      adminProfile.value = await $fetch<DestinationProfile>(`/api/admin/destination/${slug}`, {
        method: 'PUT',
        body: data
      })
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return false
    } finally {
      saving.value = false
    }
  }

  async function saveOriginProfile(slug: string, data: Partial<OriginProfile>) {
    saving.value = true
    error.value = null
    try {
      adminProfile.value = await $fetch<OriginProfile>(`/api/admin/origin/${slug}`, {
        method: 'PUT',
        body: data
      })
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return false
    } finally {
      saving.value = false
    }
  }

  async function createCountry(data: Partial<Country>) {
    saving.value = true
    error.value = null
    try {
      const country = await $fetch<Country>('/api/admin/countries', {
        method: 'POST',
        body: data
      })
      countries.value.push(country)
      return country
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Unknown error'
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateCountry(id: string, data: Partial<Country>) {
    saving.value = true
    error.value = null
    try {
      const updated = await $fetch<Country>(`/api/admin/countries/${id}`, {
        method: 'PATCH',
        body: data
      })
      const index = countries.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        countries.value[index] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Unknown error'
      return null
    } finally {
      saving.value = false
    }
  }

  async function togglePublish(id: string, published: boolean) {
    return updateCountry(id, { published })
  }

  async function deleteCountry(id: string) {
    saving.value = true
    error.value = null
    try {
      await $fetch(`/api/admin/countries/${id}`, {
        method: 'DELETE'
      })
      countries.value = countries.value.filter((c) => c.id !== id)
      return true
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'Unknown error'
      return false
    } finally {
      saving.value = false
    }
  }

  async function fetchReferenceData() {
    try {
      const [countries, languages, currencies] = await Promise.all([
        $fetch<any[]>('/api/admin/reference/countries'),
        $fetch<any[]>('/api/admin/reference/languages'),
        $fetch<any[]>('/api/admin/reference/currencies')
      ])
      referenceData.value = { countries, languages, currencies }
    } catch (e) {
      console.error('Failed to fetch reference data', e)
    }
  }

  async function fetchExternalCountryData(name: string) {
    loading.value = true
    try {
      const data = await $fetch<any>(
        `/api/admin/reference/external-country?name=${encodeURIComponent(name)}`
      )
      return data
    } catch (e) {
      console.error('Failed to fetch external country data', e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function generateAIProfile(countryName: string, type: 'destination' | 'origin') {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<any>('/api/admin/ai/generate-profile', {
        method: 'POST',
        body: { countryName, type }
      })
      return data
    } catch (e: any) {
      error.value = e.data?.statusMessage || e.message || 'AI generation failed'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    currentProfile,
    adminProfile,
    loading,
    saving,
    error,
    referenceData,
    fetchCountries,
    fetchAdminCountries,
    fetchProfile,
    fetchAdminProfile,
    saveDestinationProfile,
    saveOriginProfile,
    createCountry,
    updateCountry,
    togglePublish,
    deleteCountry,
    fetchReferenceData,
    fetchExternalCountryData,
    generateAIProfile
  }
})
