<template>
  <div class="space-y-2">
    <div v-for="rule in rules" :key="rule.id" class="flex items-start gap-2">
      <UIcon class="text-success mt-0.5 shrink-0" name="i-heroicons-check-circle" />
      <div>
        <span class="text-sm">{{ rule.displayLabel }}</span>
        <p v-if="rule.notes" class="text-xs text-gray-400 mt-0.5">{{ rule.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EligibilityRule } from '~/types'

defineProps<{
  rules: EligibilityRule[]
}>()
</script>
