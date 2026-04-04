<template>
  <UContainer class="py-12">
    <div class="mb-12">
      <h1 class="text-4xl font-bold tracking-tight mb-3">Find your relocation pathway</h1>
      <p class="text-gray-500 text-lg max-w-2xl">
        Verified, structured information for people seriously planning an international move.
      </p>
    </div>

    <div class="mb-10">
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

    <div>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
        Origin countries
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
