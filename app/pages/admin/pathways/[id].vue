<template>
  <UContainer class="py-12 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <UIcon class="animate-spin text-3xl text-gray-400" name="i-heroicons-arrow-path" />
    </div>

    <template v-else-if="pathway">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <NuxtLink class="hover:text-gray-600" to="/admin">Admin</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <NuxtLink class="hover:text-gray-600" to="/admin/pathways">Pathways</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>{{ pathway.name }}</span>
        </div>
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight">{{ pathway.name }}</h1>
          <div class="flex gap-2">
            <AdminPathwayModal :pathway="pathway" @update="fetchPathway">
              <UButton color="neutral" icon="i-heroicons-pencil" variant="outline">
                Edit Pathway
              </UButton>
            </AdminPathwayModal>
            <UButton
              :color="pathway.published ? 'success' : 'neutral'"
              :label="pathway.published ? 'Published' : 'Draft'"
              variant="subtle"
              @click="togglePublish"
            />
          </div>
        </div>
        <p class="text-gray-500 mt-2">
          {{ (pathway as any).destinationProfile?.country?.name }} · {{ pathway.pathwayType }}
        </p>
      </div>

      <UTabs :items="tabItems" class="w-full">
        <template #steps>
          <div class="py-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Application Steps</h2>
              <div class="flex gap-2">
                <UButton
                  :loading="adminPathwaysStore.loading"
                  color="neutral"
                  icon="i-heroicons-sparkles"
                  size="sm"
                  variant="outline"
                  @click="generateSteps"
                >
                  Suggest Steps
                </UButton>
                <AdminStepModal :pathway-id="pathway.id" @update="fetchPathway">
                  <UButton icon="i-heroicons-plus" size="sm">Add Step</UButton>
                </AdminStepModal>
              </div>
            </div>

            <div v-if="pathway.steps?.length" class="space-y-1">
              <div v-for="(step, index) in sortedSteps" :key="step.id" class="group">
                <!-- Drop indicator above -->
                <div
                  :class="[
                    'h-0.5 rounded-full mx-2 transition-all duration-150',
                    dragOverIndex === index ? 'bg-primary h-1 mb-1' : 'bg-transparent'
                  ]"
                />

                <div
                  :class="[
                    'flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all',
                    draggedStepId === step.id
                      ? 'opacity-40 bg-gray-50 dark:bg-gray-800 border-dashed border-gray-300'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300'
                  ]"
                  @dragleave="dragOverIndex = null"
                  @dragover.prevent="dragOverIndex = index"
                  @drop.prevent="onDrop(index)"
                >
                  <!-- Drag handle -->
                  <div
                    class="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 touch-none"
                    draggable="true"
                    @dragend="onDragEnd"
                    @dragstart="onDragStart(step.id)"
                  >
                    <UIcon class="text-lg" name="i-heroicons-bars-2" />
                  </div>

                  <!-- Step number -->
                  <span
                    class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0"
                  >
                    {{ index + 1 }}
                  </span>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate">{{ step.title }}</div>
                    <div class="text-xs text-gray-400 capitalize flex items-center gap-1.5">
                      <span>{{ step.category.replace(/_/g, ' ') }}</span>
                      <span v-if="step.typicalDurationDays">· {{ step.typicalDurationDays }}d</span>
                      <UBadge v-if="step.originSide" color="neutral" size="xs" variant="subtle"
                        >origin</UBadge
                      >
                    </div>
                  </div>

                  <!-- Actions -->
                  <div
                    class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <AdminStepModal :pathway-id="pathway.id" :step="step" @update="fetchPathway">
                      <UButton
                        color="neutral"
                        icon="i-heroicons-pencil"
                        size="xs"
                        variant="ghost"
                      />
                    </AdminStepModal>
                    <UButton
                      color="error"
                      icon="i-heroicons-trash"
                      size="xs"
                      variant="ghost"
                      @click="handleDeleteStep(step.id)"
                    />
                  </div>
                </div>
              </div>

              <!-- Drop indicator at end -->
              <div
                :class="[
                  'h-0.5 rounded-full mx-2 transition-all duration-150',
                  dragOverIndex === sortedSteps.length ? 'bg-primary h-1 mt-1' : 'bg-transparent'
                ]"
                @dragleave="dragOverIndex = null"
                @dragover.prevent="dragOverIndex = sortedSteps.length"
                @drop.prevent="onDrop(sortedSteps.length)"
              />
            </div>
            <div
              v-else
              class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
            >
              <p class="text-gray-500">No steps defined for this pathway.</p>
            </div>
          </div>
        </template>

        <template #eligibility>
          <div class="py-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Eligibility Rules</h2>
              <div class="flex gap-2">
                <UButton
                  :loading="adminPathwaysStore.loading"
                  color="neutral"
                  icon="i-heroicons-sparkles"
                  size="sm"
                  variant="outline"
                  @click="generateRules"
                >
                  Suggest Rules
                </UButton>
                <AdminEligibilityRuleModal :pathway-id="pathway.id" @update="fetchPathway">
                  <UButton icon="i-heroicons-plus" size="sm">Add Rule</UButton>
                </AdminEligibilityRuleModal>
              </div>
            </div>

            <div v-if="pathway.eligibilityRules?.length" class="space-y-3">
              <UCard v-for="rule in pathway.eligibilityRules" :key="rule.id" class="relative group">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold">{{ rule.displayLabel }}</div>
                    <div class="text-sm text-gray-400">
                      {{ rule.ruleType }} {{ rule.operator }}
                      {{ rule.valueInt || rule.valueString || rule.valueList }}
                      <UBadge
                        v-if="rule.hardRequirement"
                        class="ml-2"
                        color="error"
                        size="xs"
                        variant="subtle"
                        >Hard Requirement</UBadge
                      >
                    </div>
                  </div>
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AdminEligibilityRuleModal
                      :pathway-id="pathway.id"
                      :rule="rule"
                      @update="fetchPathway"
                    >
                      <UButton
                        color="neutral"
                        icon="i-heroicons-pencil"
                        size="xs"
                        variant="ghost"
                      />
                    </AdminEligibilityRuleModal>
                    <UButton
                      color="error"
                      icon="i-heroicons-trash"
                      size="xs"
                      variant="ghost"
                      @click="handleDeleteRule(rule.id)"
                    />
                  </div>
                </div>
              </UCard>
            </div>
            <div
              v-else
              class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
            >
              <p class="text-gray-500">No eligibility rules defined.</p>
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Pathway } from '~/types'
import AdminStepModal from '~/components/admin/pathway/AdminStepModal.vue'
import AdminEligibilityRuleModal from '~/components/admin/pathway/AdminEligibilityRuleModal.vue'

const route = useRoute()
const adminPathwaysStore = useAdminPathwaysStore()
const toast = useToast()

const pathwayId = route.params.id as string
const pathway = ref<Pathway | null>(null)
const loading = ref(true)

const sortedSteps = computed(() => {
  if (!pathway.value?.steps) return []
  return [...pathway.value.steps].sort((a, b) => a.orderIndex - b.orderIndex)
})

const draggedStepId = ref<string | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(stepId: string) {
  draggedStepId.value = stepId
}

function onDragEnd() {
  draggedStepId.value = null
  dragOverIndex.value = null
}

async function onDrop(targetIndex: number) {
  if (!draggedStepId.value || !pathway.value) return

  const steps = [...sortedSteps.value]
  const fromIndex = steps.findIndex((s) => s.id === draggedStepId.value)
  draggedStepId.value = null
  dragOverIndex.value = null

  if (fromIndex === -1 || fromIndex === targetIndex) return

  const [moved] = steps.splice(fromIndex, 1)
  const insertAt = targetIndex > fromIndex ? targetIndex - 1 : targetIndex
  steps.splice(insertAt, 0, moved)

  const updatedSteps = steps.map((s, i) => ({ id: s.id, orderIndex: i }))
  const success = await adminPathwaysStore.updateStepsOrder(pathway.value.id, updatedSteps)
  if (success) {
    fetchPathway()
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Failed to reorder steps',
      color: 'error'
    })
  }
}

const tabItems = [
  { label: 'Steps', slot: 'steps', icon: 'i-heroicons-list-bullet' },
  { label: 'Eligibility', slot: 'eligibility', icon: 'i-heroicons-check-badge' }
]

async function fetchPathway() {
  loading.value = true
  try {
    pathway.value = await $fetch<Pathway>(`/api/admin/pathways/${pathwayId}`)
  } catch {
    toast.add({ title: 'Error', description: 'Failed to load pathway details', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function togglePublish() {
  if (!pathway.value) return
  const success = await adminPathwaysStore.togglePublish(pathway.value.id, !pathway.value.published)
  if (success) {
    pathway.value.published = !pathway.value.published
    toast.add({ title: 'Success', description: 'Publish state updated', color: 'success' })
  }
}

async function generateRules() {
  if (!pathway.value) return
  const countryName = (pathway.value as any).destinationProfile?.country?.name
  if (!countryName) return

  const suggestedRules = await adminPathwaysStore.generateAIRules(countryName, pathway.value.name)

  if (suggestedRules && suggestedRules.length > 0) {
    if (
      pathway.value.eligibilityRules?.length &&
      !confirm('This will add suggested rules to your existing rules. Continue?')
    )
      return

    for (const rule of suggestedRules) {
      await adminPathwaysStore.createRule({ ...rule, pathwayId: pathway.value.id })
    }

    toast.add({
      title: 'Rules Suggested',
      description: `Added ${suggestedRules.length} eligibility rules.`,
      color: 'success'
    })
    fetchPathway()
  } else {
    toast.add({
      title: 'AI Assist Failed',
      description: adminPathwaysStore.error || 'Failed to suggest rules.',
      color: 'error'
    })
  }
}

async function generateSteps() {
  if (!pathway.value) return
  const countryName = (pathway.value as any).destinationProfile?.country?.name
  if (!countryName) return

  const suggestedSteps = await adminPathwaysStore.generateAISteps(countryName, pathway.value.name)

  if (suggestedSteps && suggestedSteps.length > 0) {
    if (
      pathway.value.steps?.length &&
      !confirm('This will add suggested steps to your existing steps. Continue?')
    ) {
      return
    }

    for (const step of suggestedSteps) {
      await adminPathwaysStore.createStep({
        ...step,
        pathwayId: pathway.value.id
      })
    }

    toast.add({
      title: 'Steps Suggested',
      description: `Added ${suggestedSteps.length} steps.`,
      color: 'success'
    })
    fetchPathway()
  } else {
    toast.add({
      title: 'AI Assist Failed',
      description: adminPathwaysStore.error || 'Failed to suggest steps.',
      color: 'error'
    })
  }
}

async function handleDeleteStep(stepId: string) {
  if (!confirm('Are you sure you want to delete this step?')) return
  const success = await adminPathwaysStore.deleteStep(stepId)
  if (success) {
    toast.add({ title: 'Success', description: 'Step deleted', color: 'success' })
    fetchPathway()
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Failed to delete step',
      color: 'error'
    })
  }
}

async function handleDeleteRule(ruleId: string) {
  if (!confirm('Are you sure you want to delete this rule?')) return
  const success = await adminPathwaysStore.deleteRule(ruleId)
  if (success) {
    toast.add({ title: 'Success', description: 'Rule deleted', color: 'success' })
    fetchPathway()
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Failed to delete rule',
      color: 'error'
    })
  }
}

onMounted(() => {
  fetchPathway()
})
</script>
