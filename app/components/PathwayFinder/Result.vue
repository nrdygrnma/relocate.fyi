<template>
  <UCard :class="result.hardFail ? 'opacity-60' : ''">
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold">{{ result.pathway.name }}</h3>
            <UBadge class="capitalize" color="info" variant="subtle">
              {{ result.pathway.pathwayType.replace('_', ' ') }}
            </UBadge>
          </div>
          <p class="text-xs text-gray-400">
            {{ result.pathway.destinationProfile?.country?.name }}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UBadge v-if="result.hardFail" color="error" variant="subtle"> Not eligible </UBadge>
          <UBadge v-else-if="result.score === 100" color="success" variant="subtle">
            Full match
          </UBadge>
          <UBadge v-else color="warning" variant="subtle"> {{ result.score }}% match </UBadge>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <p v-if="result.pathway.summary" class="text-sm text-gray-500 leading-relaxed">
        {{ result.pathway.summary }}
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Duration</div>
          <div class="font-medium text-sm">{{ result.pathway.durationYears ?? '—' }} years</div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Processing</div>
          <div class="font-medium text-sm">
            {{ result.pathway.processingWeeksMin }}–{{ result.pathway.processingWeeksMax }} weeks
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Gov. fee</div>
          <div class="font-medium text-sm">USD {{ result.pathway.governmentFeeUsd ?? '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Work allowed</div>
          <div class="font-medium text-sm capitalize">
            {{ result.pathway.workAllowed?.replace(/_/g, ' ') }}
          </div>
        </div>
      </div>

      <USeparator />

      <div v-if="result.passedRules.length" class="space-y-1.5">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          You qualify
        </div>
        <div
          v-for="rule in result.passedRules"
          :key="rule.id"
          class="flex items-center gap-2 text-sm"
        >
          <UIcon class="text-success shrink-0" name="i-heroicons-check-circle" />
          {{ rule.displayLabel }}
        </div>
      </div>

      <div v-if="result.failedRules.length" class="space-y-1.5">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Requirements not met
        </div>
        <div
          v-for="rule in result.failedRules"
          :key="rule.id"
          class="flex items-center gap-2 text-sm"
        >
          <UIcon
            :class="rule.hardRequirement ? 'text-error' : 'text-warning'"
            :name="rule.hardRequirement ? 'i-heroicons-x-circle' : 'i-heroicons-exclamation-circle'"
            class="shrink-0"
          />
          {{ rule.displayLabel }}
        </div>
      </div>

      <div v-if="!result.hardFail" class="flex justify-end">
        <UButton
          :to="`/destination/${result.pathway.destinationProfile?.slug}`"
          icon="i-heroicons-arrow-right"
          size="sm"
          trailing
          variant="outline"
        >
          View full profile
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { PathwayMatch } from '~/stores/pathwayFinder'

defineProps<{
  result: PathwayMatch
}>()
</script>
