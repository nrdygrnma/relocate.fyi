<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">A few final questions</h2>
      <p class="text-sm text-gray-500">These affect eligibility for most permits.</p>
    </div>

    <div
      :class="
        store.userProfile.hasHealthInsurance
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 dark:border-gray-700'
      "
      class="flex items-start justify-between gap-4 p-4 rounded-lg border cursor-pointer transition-all"
      @click="store.userProfile.hasHealthInsurance = !store.userProfile.hasHealthInsurance"
    >
      <div>
        <div class="font-medium text-sm">I have private health insurance</div>
        <div class="text-xs text-gray-400 mt-0.5">
          Or I am willing to obtain coverage before applying
        </div>
      </div>
      <UIcon
        :class="store.userProfile.hasHealthInsurance ? 'text-primary' : 'text-gray-300'"
        :name="
          store.userProfile.hasHealthInsurance ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
        "
        class="text-xl shrink-0 mt-0.5"
      />
    </div>

    <div
      :class="
        store.userProfile.hasCriminalRecord
          ? 'border-error bg-error/5'
          : 'border-gray-200 dark:border-gray-700'
      "
      class="flex items-start justify-between gap-4 p-4 rounded-lg border cursor-pointer transition-all"
      @click="store.userProfile.hasCriminalRecord = !store.userProfile.hasCriminalRecord"
    >
      <div>
        <div class="font-medium text-sm">I have a criminal record</div>
        <div class="text-xs text-gray-400 mt-0.5">
          A conviction that would appear on a police clearance certificate
        </div>
      </div>
      <UIcon
        :class="store.userProfile.hasCriminalRecord ? 'text-error' : 'text-gray-300'"
        :name="
          store.userProfile.hasCriminalRecord ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
        "
        class="text-xl shrink-0 mt-0.5"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()
</script>
