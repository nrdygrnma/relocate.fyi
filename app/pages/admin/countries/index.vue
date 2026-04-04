<template>
  <UContainer class="py-12">
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <NuxtLink class="hover:text-gray-600" to="/admin">Admin</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>Countries</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Countries</h1>
      </div>
    </div>

    <div class="space-y-3">
      <UCard
        v-for="country in store.countries"
        :key="country.id"
        class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
        @click="navigateTo(editUrl(country))"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <div class="font-semibold">{{ country.name }}</div>
              <div class="text-sm text-gray-400 capitalize">
                {{ country.region }} · {{ country.isoCode }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="country.hasDestinationProfile" color="info" variant="subtle">
              Destination
            </UBadge>
            <UBadge v-if="country.hasOriginProfile" color="neutral" variant="subtle">
              Origin
            </UBadge>
            <UBadge :color="country.published ? 'success' : 'error'" variant="subtle">
              {{ country.published ? 'Published' : 'Draft' }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Country } from '~/types'

const store = useCountriesStore()
await store.fetchCountries()

function editUrl(country: Country): string {
  if (country.hasDestinationProfile && country.destinationProfile?.slug) {
    return `/admin/countries/${country.destinationProfile.slug}?type=destination`
  }
  if (country.hasOriginProfile && country.originProfile?.slug) {
    return `/admin/countries/${country.originProfile.slug}?type=origin`
  }
  return '/admin/countries'
}
</script>
