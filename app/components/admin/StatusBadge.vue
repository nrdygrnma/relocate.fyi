<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-gray-400">Section status:</span>
    <div class="flex gap-1">
      <button
        v-for="opt in options"
        :key="opt.value"
        :class="[
          'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
          modelValue === opt.value
            ? opt.activeClass
            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300'
        ]"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ modelValue?: string | null }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  {
    value: 'draft',
    label: 'Draft',
    activeClass: 'border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
  },
  {
    value: 'ai_generated',
    label: 'AI Generated',
    activeClass: 'border-warning bg-warning/10 text-warning'
  },
  {
    value: 'reviewed',
    label: 'Reviewed',
    activeClass: 'border-success bg-success/10 text-success'
  }
]
</script>
