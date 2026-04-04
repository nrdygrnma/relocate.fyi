<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold mb-1">What is your nationality?</h2>
      <p class="text-sm text-gray-500">Select your passport country.</p>
    </div>
    <UFormField label="Nationality">
      <USelect
        v-model="store.userProfile.nationality"
        :items="countryOptions"
        class="w-full"
        placeholder="Select your country..."
      />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

const countryOptions = [
  { label: 'Austria', value: 'AT' },
  { label: 'Germany', value: 'DE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'France', value: 'FR' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Norway', value: 'NO' },
  { label: 'Denmark', value: 'DK' },
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'India', value: 'IN' },
  { label: 'Singapore', value: 'SG' }
]
</script>
