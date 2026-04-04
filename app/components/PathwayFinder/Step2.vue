<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold mb-1">How old are you?</h2>
      <p class="text-sm text-gray-500">Some permits have minimum or maximum age requirements.</p>
    </div>
    <UFormField label="Age">
      <UInput v-model="age" class="w-full" max="99" min="18" placeholder="e.g. 52" type="number" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

const age = computed({
  get: () => store.userProfile.age ?? undefined,
  set: (val: number | undefined) => {
    store.userProfile.age = val ?? null
  }
})
</script>
