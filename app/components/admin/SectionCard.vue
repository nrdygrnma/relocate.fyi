<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <div v-if="icon" class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon :name="icon" class="text-primary text-sm" />
        </div>
        <div>
          <h2 class="font-semibold text-sm">{{ title }}</h2>
          <p v-if="description" class="text-xs text-gray-400 mt-0.5">{{ description }}</p>
        </div>
      </div>
    </template>
    <div class="space-y-4">
      <slot />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>
