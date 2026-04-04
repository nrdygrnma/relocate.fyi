<template>
  <div class="space-y-4">
    <div v-for="step in steps" :key="step.id" class="flex gap-4">
      <div
        class="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5"
      >
        {{ step.orderIndex }}
      </div>
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <span class="font-medium text-sm">{{ step.title }}</span>
          <UBadge v-if="step.originSide" color="warning" size="xs" variant="subtle">
            Origin country
          </UBadge>
          <UBadge v-if="step.costUsd" color="neutral" size="xs" variant="subtle">
            USD {{ step.costUsd.toLocaleString() }}
          </UBadge>
          <UBadge v-if="step.typicalDurationDays" color="neutral" size="xs" variant="outline">
            ~{{ step.typicalDurationDays }} days
          </UBadge>
        </div>
        <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>
        <a
          v-if="step.officialUrl"
          :href="step.officialUrl"
          class="text-xs text-primary hover:underline mt-1 inline-block"
          target="_blank"
        >
          Official source
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Step } from '~/types'

defineProps<{
  steps: Step[]
}>()
</script>
