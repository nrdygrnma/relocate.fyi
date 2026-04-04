<template>
  <div class="flex flex-col gap-1">
    <span class="text-xs text-gray-400 uppercase tracking-wide">{{ label }}</span>
    <slot>
      <span class="font-medium">{{ value }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  value?: string | number | null
}>()
</script>
