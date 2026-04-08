<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <h2 class="font-semibold text-base">{{ title }}</h2>
        <div class="flex items-center gap-2 shrink-0">
          <UButton
            v-if="sourceUrl"
            :to="sourceUrl"
            color="neutral"
            icon="i-heroicons-arrow-top-right-on-square"
            size="xs"
            target="_blank"
            trailing
            variant="ghost"
          >
            Source
          </UButton>
          <UBadge v-if="verifiedAt" color="success" variant="subtle">
            Verified {{ verifiedAt }}
          </UBadge>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <slot />
      <p v-if="notes" class="text-sm text-gray-500 leading-relaxed">{{ notes }}</p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  verifiedAt?: string | null
  sourceUrl?: string | null
  notes?: string | null
}>()
</script>
