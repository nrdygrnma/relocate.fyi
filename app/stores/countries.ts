import { defineStore } from 'pinia'
import type { Country, DestinationProfile, OriginProfile, ProfileResponse } from '~/types'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const currentProfile = ref<ProfileResponse | null>(null)
  const adminProfile = ref<DestinationProfile | OriginProfile | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

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

  return {
    countries,
    currentProfile,
    adminProfile,
    loading,
    saving,
    error,
    fetchCountries,
    fetchProfile,
    fetchAdminProfile,
    saveDestinationProfile,
    saveOriginProfile
  }
})
