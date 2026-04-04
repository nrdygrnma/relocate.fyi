<template>
  <UContainer class="py-12">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Find your pathway</h1>
        <p class="text-gray-500">Answer a few questions and we'll match you to the right permit.</p>
      </div>

      <div v-if="store.step <= store.totalSteps">
        <div class="mb-8">
          <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Step {{ store.step }} of {{ store.totalSteps }}</span>
            <span>{{ Math.round((store.step / store.totalSteps) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              :style="{ width: `${(store.step / store.totalSteps) * 100}%` }"
              class="bg-primary h-1.5 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <UCard class="mb-6">
          <PathwayFinderStep1 v-if="store.step === 1" />
          <PathwayFinderStep2 v-else-if="store.step === 2" />
          <PathwayFinderStep3 v-else-if="store.step === 3" />
          <PathwayFinderStep4 v-else-if="store.step === 4" />
          <PathwayFinderStep5 v-else-if="store.step === 5" />
          <PathwayFinderStep6 v-else-if="store.step === 6" />
        </UCard>

        <div class="flex items-center justify-between">
          <UButton
            v-if="store.step > 1"
            icon="i-heroicons-arrow-left"
            variant="outline"
            @click="store.prevStep()"
          >
            Back
          </UButton>
          <div v-else />

          <div class="flex items-center gap-3">
            <UButton
              v-if="store.step < store.totalSteps"
              :disabled="!canProceed"
              icon="i-heroicons-arrow-right"
              trailing
              @click="store.nextStep()"
            >
              Continue
            </UButton>
            <UButton
              v-else
              :loading="store.loading"
              icon="i-heroicons-magnifying-glass"
              trailing
              @click="findPathways"
            >
              Find pathways
            </UButton>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">
            {{ store.results.length }} pathway{{ store.results.length === 1 ? '' : 's' }} found
          </h2>
          <UButton icon="i-heroicons-arrow-path" size="sm" variant="outline" @click="store.reset()">
            Start over
          </UButton>
        </div>

        <div class="space-y-4">
          <PathwayFinderResult
            v-for="result in store.results"
            :key="result.pathway.id"
            :result="result"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

await store.fetchPathways()

const canProceed = computed(() => {
  const p = store.userProfile
  switch (store.step) {
    case 1:
      return p.nationality !== ''
    case 2:
      return p.age !== null && p.age > 0
    case 3:
      return p.monthlyIncomeUsd !== null && p.monthlyIncomeUsd >= 0
    case 4:
      return p.employmentStatus !== ''
    case 5:
      return true
    case 6:
      return true
    default:
      return false
  }
})

async function findPathways() {
  store.computeResults()
  store.step = store.totalSteps + 1
}
</script>
