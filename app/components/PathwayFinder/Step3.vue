<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold mb-1">What is your monthly income?</h2>
      <p class="text-sm text-gray-500">
        Include all sources — pension, investments, remote work, rental income. Enter the amount in
        USD.
      </p>
    </div>
    <UFormField label="Monthly income (USD)">
      <UInput
        v-model="monthlyIncome"
        class="w-full"
        min="0"
        placeholder="e.g. 2500"
        type="number"
      />
    </UFormField>
    <div v-if="store.userProfile.monthlyIncomeUsd" class="text-sm text-gray-400">
      Approx. USD {{ (store.userProfile.monthlyIncomeUsd * 12).toLocaleString() }} per year
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

const monthlyIncome = computed({
  get: () => store.userProfile.monthlyIncomeUsd ?? undefined,
  set: (val: number | undefined) => {
    store.userProfile.monthlyIncomeUsd = val ?? null
  }
})
</script>
