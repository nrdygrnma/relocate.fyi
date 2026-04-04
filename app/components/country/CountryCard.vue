<template>
  <UCard
    class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
    @click="navigateTo(to)"
  >
    <div class="flex items-center justify-between">
      <div>
        <div class="font-semibold text-base">{{ country.name }}</div>
        <div class="text-sm text-gray-400 capitalize mt-1">{{ country.region }}</div>
      </div>
      <UBadge
        :color="type === 'destination' ? 'info' : 'neutral'"
        class="capitalize"
        variant="subtle"
      >
        {{ type }}
      </UBadge>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Country } from '~/types'

const props = defineProps<{
  country: Country
  type: 'destination' | 'origin'
}>()

const to = computed(() =>
  props.type === 'destination'
    ? `/destination/${props.country.destinationProfile?.slug}`
    : `/origin/${props.country.originProfile?.slug}`
)
</script>
