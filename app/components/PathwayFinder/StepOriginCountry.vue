<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold mb-1">Where are you currently living?</h2>
      <p class="text-sm text-gray-500">Your current country of residence.</p>
    </div>
    <UFormField label="Current country">
      <USelect
        v-model="store.userProfile.originCountry"
        :items="countryOptions"
        class="w-full"
        placeholder="Select your country..."
        searchable
      />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

interface CountryOption {
  label: string
  value: string
}

const countryOptions = ref<CountryOption[]>([])

onMounted(async () => {
  const data = await $fetch<{ isoCode: string; name: string }[]>('/api/reference/countries')
  countryOptions.value = data.map((c) => ({ label: c.name, value: c.isoCode }))
})
</script>
