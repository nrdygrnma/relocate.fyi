<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">Do you have dependents?</h2>
      <p class="text-sm text-gray-500">Spouse, children, or parents you plan to bring with you.</p>
    </div>

    <UFormField label="Number of dependents">
      <div class="flex items-center gap-4">
        <UButton
          :disabled="store.userProfile.dependentsCount === 0"
          icon="i-heroicons-minus"
          size="sm"
          variant="outline"
          @click="store.userProfile.dependentsCount--"
        />
        <span class="text-2xl font-semibold w-8 text-center">
          {{ store.userProfile.dependentsCount }}
        </span>
        <UButton
          icon="i-heroicons-plus"
          size="sm"
          variant="outline"
          @click="store.userProfile.dependentsCount++"
        />
      </div>
    </UFormField>

    <div
      v-if="store.userProfile.dependentsCount > 0"
      class="p-4 bg-info/5 border border-info/20 rounded-lg"
    >
      <p class="text-sm text-info-700 dark:text-info-300">
        Some permits require a higher minimum income when dependents are included. We will factor
        this into your results.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()
</script>
