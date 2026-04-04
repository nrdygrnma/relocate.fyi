<template>
  <div
    class="sticky top-14 z-40 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur"
  >
    <UContainer>
      <div class="flex items-center justify-between h-12">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <NuxtLink class="hover:text-gray-600 dark:hover:text-gray-300" to="/admin">
              Admin
            </NuxtLink>
            <UIcon class="text-xs" name="i-heroicons-chevron-right" />
            <NuxtLink class="hover:text-gray-600 dark:hover:text-gray-300" to="/admin/countries">
              Countries
            </NuxtLink>
            <UIcon class="text-xs" name="i-heroicons-chevron-right" />
            <span class="text-gray-600 dark:text-gray-300">{{ title }}</span>
          </div>
          <UBadge v-if="dirty" color="warning" size="xs" variant="subtle"> Unsaved changes </UBadge>
        </div>
        <UButton :loading="loading" icon="i-heroicons-check" size="sm" @click="emit('save')">
          Save changes
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  dirty: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  save: []
}>()
</script>
