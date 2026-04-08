<template>
  <div class="space-y-5">
    <!-- Origin-side steps -->
    <div v-if="originSteps.length">
      <div class="flex items-center gap-2 mb-2">
        <UBadge color="warning" size="xs" variant="subtle">Before you leave</UBadge>
        <span class="text-xs text-gray-400">{{ originCountryName }}</span>
      </div>
      <div class="space-y-2">
        <div
          v-for="(step, i) in originSteps"
          :key="step.id"
          class="flex gap-3 text-sm"
        >
          <span
            class="w-5 h-5 rounded-full bg-warning/15 text-warning flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
          >{{ i + 1 }}</span>
          <div class="flex-1">
            <div class="font-medium">{{ step.title }}</div>
            <div v-if="step.typicalDurationDays || step.costUsd" class="flex gap-3 text-xs text-gray-400 mt-0.5">
              <span v-if="step.typicalDurationDays">~{{ step.typicalDurationDays }} days</span>
              <span v-if="step.costUsd">USD {{ step.costUsd.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Destination-side steps -->
    <div v-if="destinationSteps.length">
      <div class="flex items-center gap-2 mb-2">
        <UBadge color="primary" size="xs" variant="subtle">After you arrive</UBadge>
        <span class="text-xs text-gray-400">{{ destinationCountryName }}</span>
      </div>
      <div class="space-y-2">
        <div
          v-for="(step, i) in destinationSteps"
          :key="step.id"
          class="flex gap-3 text-sm"
        >
          <span
            class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
          >{{ i + 1 }}</span>
          <div class="flex-1">
            <div class="font-medium">{{ step.title }}</div>
            <div v-if="step.typicalDurationDays || step.costUsd" class="flex gap-3 text-xs text-gray-400 mt-0.5">
              <span v-if="step.typicalDurationDays">~{{ step.typicalDurationDays }} days</span>
              <span v-if="step.costUsd">USD {{ step.costUsd.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!originSteps.length && !destinationSteps.length" class="text-sm text-gray-400">
      No steps defined yet for this pathway.
    </div>

    <!-- Total cost estimate -->
    <div v-if="totalCostUsd" class="pt-1 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
      <span>Estimated application cost</span>
      <span class="font-semibold text-gray-700 dark:text-gray-300">~USD {{ totalCostUsd.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Pathway } from '~/types'

const props = defineProps<{
  pathway: Pathway
  originCountryName?: string
}>()

const sortedSteps = computed(() =>
  [...(props.pathway.steps ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
)

const originSteps = computed(() => sortedSteps.value.filter((s) => s.originSide))
const destinationSteps = computed(() => sortedSteps.value.filter((s) => !s.originSide))

const destinationCountryName = computed(
  () => props.pathway.destinationProfile?.country?.name ?? 'destination'
)

const totalCostUsd = computed(() => {
  const sum = sortedSteps.value.reduce((acc, s) => acc + (s.costUsd ?? 0), 0)
  const fee = props.pathway.governmentFeeUsd ?? 0
  const total = sum + fee
  return total > 0 ? total : null
})
</script>
