<template>
  <div
    :class="[
      'rounded-lg border transition-colors cursor-pointer',
      result.hardFail
        ? 'border-gray-200 dark:border-gray-800 opacity-50'
        : open
          ? 'border-primary/40 bg-primary/[0.02] dark:bg-primary/5'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
    ]"
    @click="open = !open"
  >
    <!-- Compact row -->
    <div class="flex items-center gap-3 px-4 py-3">
      <!-- Score indicator -->
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
          result.hardFail
            ? 'bg-gray-100 text-gray-400 dark:bg-gray-800'
            : result.score === 100
              ? 'bg-success/15 text-success'
              : result.score >= 60
                ? 'bg-warning/15 text-warning'
                : 'bg-orange-100 text-orange-500 dark:bg-orange-900/20'
        ]"
      >
        {{ result.hardFail ? '✕' : result.score + '%' }}
      </div>

      <!-- Name + country -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-semibold text-sm truncate">{{ result.pathway.name }}</span>
          <UBadge class="capitalize" color="neutral" size="xs" variant="outline">
            {{ result.pathway.pathwayType.replace(/_/g, ' ') }}
          </UBadge>
        </div>
        <div class="text-xs text-gray-400 mt-0.5">
          {{ result.pathway.destinationProfile?.country?.name }}
        </div>
      </div>

      <!-- Inline stats -->
      <div class="hidden sm:flex items-center gap-4 text-xs text-gray-400 shrink-0">
        <span v-if="result.pathway.durationYears">
          <span class="font-medium text-gray-700 dark:text-gray-300"
            >{{ result.pathway.durationYears }}yr</span
          >
        </span>
        <span v-if="result.pathway.processingWeeksMin">
          <span class="font-medium text-gray-700 dark:text-gray-300"
            >{{ result.pathway.processingWeeksMin }}–{{ result.pathway.processingWeeksMax }}wk</span
          >
        </span>
        <span v-if="result.pathway.governmentFeeUsd">
          ~$<span class="font-medium text-gray-700 dark:text-gray-300">{{
            result.pathway.governmentFeeUsd.toLocaleString()
          }}</span>
        </span>
      </div>

      <!-- Expand chevron -->
      <UIcon
        :class="['text-gray-400 shrink-0 transition-transform', open ? 'rotate-180' : '']"
        name="i-heroicons-chevron-down"
      />
    </div>

    <!-- Expanded detail -->
    <div v-if="open" class="px-4 pb-4 space-y-4" @click.stop>
      <!-- Mobile stats -->
      <div class="flex sm:hidden flex-wrap gap-4 text-xs text-gray-500">
        <span v-if="result.pathway.durationYears"
          >Duration: <strong>{{ result.pathway.durationYears }} yr</strong></span
        >
        <span v-if="result.pathway.processingWeeksMin"
          >Processing:
          <strong
            >{{ result.pathway.processingWeeksMin }}–{{
              result.pathway.processingWeeksMax
            }}
            wk</strong
          ></span
        >
        <span v-if="result.pathway.governmentFeeUsd"
          >Fee: <strong>~${{ result.pathway.governmentFeeUsd.toLocaleString() }}</strong></span
        >
        <span v-if="result.pathway.workAllowed"
          >Work: <strong class="capitalize">{{ result.pathway.workAllowed }}</strong></span
        >
      </div>

      <p v-if="result.pathway.summary" class="text-sm text-gray-500 leading-relaxed">
        {{ result.pathway.summary }}
      </p>

      <div class="flex flex-wrap gap-4">
        <!-- Passed rules -->
        <div v-if="result.passedRules.length" class="flex-1 min-w-48 space-y-1">
          <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            You qualify
          </div>
          <div
            v-for="rule in result.passedRules"
            :key="rule.id"
            class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300"
          >
            <UIcon class="text-success shrink-0" name="i-heroicons-check-circle" />
            {{ rule.displayLabel }}
          </div>
        </div>

        <!-- Failed rules -->
        <div v-if="result.failedRules.length" class="flex-1 min-w-48 space-y-1">
          <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Requirements not met
          </div>
          <div
            v-for="rule in result.failedRules"
            :key="rule.id"
            :class="rule.hardRequirement ? 'text-error' : 'text-warning'"
            class="flex items-center gap-1.5 text-xs"
          >
            <UIcon
              :name="
                rule.hardRequirement ? 'i-heroicons-x-circle' : 'i-heroicons-exclamation-circle'
              "
              class="shrink-0"
            />
            {{ rule.displayLabel }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 gap-4">
        <a
          v-if="result.pathway.sourceUrl"
          :href="result.pathway.sourceUrl"
          class="text-xs text-gray-400 hover:text-gray-600 truncate flex items-center gap-1"
          rel="noopener"
          target="_blank"
          @click.stop
        >
          <UIcon class="shrink-0 text-gray-300" name="i-heroicons-link" />
          {{ result.pathway.sourceUrl }}
        </a>
        <span v-else />
        <UButton
          v-if="!result.hardFail"
          :to="`/destination/${result.pathway.destinationProfile?.slug}`"
          icon="i-heroicons-arrow-right"
          size="sm"
          trailing
          variant="outline"
          @click.stop
        >
          View full profile
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PathwayMatch } from '~/stores/pathwayFinder'

defineProps<{ result: PathwayMatch }>()
const open = ref(false)
</script>
