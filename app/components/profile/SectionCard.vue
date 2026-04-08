<template>
  <UCard>
    <template #header>
      <button
        v-if="collapsible"
        class="flex items-center justify-between w-full text-left gap-3"
        @click="open = !open"
      >
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <h2 class="font-semibold text-base">{{ title }}</h2>
          <UBadge
            v-if="status && status !== 'reviewed'"
            :color="status === 'ai_generated' ? 'warning' : 'neutral'"
            size="xs"
            variant="subtle"
          >
            {{ status === 'ai_generated' ? 'AI draft' : 'Draft' }}
          </UBadge>
        </div>
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
            @click.stop
          >
            Source
          </UButton>
          <UBadge v-if="verifiedAt" color="success" variant="subtle">
            Verified {{ verifiedAt }}
          </UBadge>
          <UIcon
            :class="['text-gray-400 transition-transform', open ? 'rotate-180' : '']"
            name="i-heroicons-chevron-down"
          />
        </div>
      </button>

      <div v-else class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <h2 class="font-semibold text-base">{{ title }}</h2>
          <UBadge
            v-if="status && status !== 'reviewed'"
            :color="status === 'ai_generated' ? 'warning' : 'neutral'"
            size="xs"
            variant="subtle"
          >
            {{ status === 'ai_generated' ? 'AI draft' : 'Draft' }}
          </UBadge>
        </div>
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

    <div v-show="!collapsible || open" class="space-y-4">
      <slot />
      <p v-if="notes" class="text-sm text-gray-500 leading-relaxed">{{ notes }}</p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  verifiedAt?: string | null
  sourceUrl?: string | null
  notes?: string | null
  collapsible?: boolean
  defaultOpen?: boolean
  status?: string | null
}>()

const open = ref(props.defaultOpen !== false)
</script>
