<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-base">{{ title }}</h2>
        <UBadge v-if="verifiedAt" color="success" variant="subtle">
          Verified {{ verifiedAt }}
        </UBadge>
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
  notes?: string | null
}>()
</script>
