<template>
  <UContainer class="py-12 max-w-4xl mx-auto">
    <!-- Hero / CTA -->
    <div class="mb-14 text-center">
      <h1 class="text-4xl font-bold tracking-tight mb-4">Find your relocation pathway</h1>
      <p class="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
        Answer a few questions and get matched to visa pathways that fit your profile — with
        verified requirements and step-by-step guidance.
      </p>
      <UButton icon="i-heroicons-magnifying-glass" size="xl" to="/pathway-finder" trailing>
        Find my pathway
      </UButton>
    </div>

    <!-- Destination countries -->
    <div v-if="destinations.length" class="mb-10">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
        Destination countries
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <CountryCard
          v-for="country in destinations"
          :key="country.id"
          :country="country"
          type="destination"
        />
      </div>
    </div>

    <!-- Origin countries -->
    <div v-if="origins.length">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
        Leaving from
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <CountryCard
          v-for="country in origins"
          :key="country.id"
          :country="country"
          type="origin"
        />
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const store = useCountriesStore()
await store.fetchCountries()

const destinations = computed(() => store.countries.filter((c) => c.hasDestinationProfile))
const origins = computed(() => store.countries.filter((c) => c.hasOriginProfile))
</script>
