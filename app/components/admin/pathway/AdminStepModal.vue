<template>
  <UModal
    v-model:open="isOpen"
    :description="isEdit ? 'Update step details' : 'Create a new step for this pathway'"
    :title="isEdit ? 'Edit Step' : 'Add New Step'"
    :ui="{ footer: 'justify-end' }"
  >
    <slot />

    <template #body>
      <form id="step-form" class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" class="w-full" placeholder="e.g. Gather Documents" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" class="w-full" placeholder="Step details..." />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Category" name="category">
            <USelect
              v-model="state.category"
              :items="[
                { label: 'Document Gathering', value: 'document_gathering' },
                { label: 'Online Application', value: 'online_application' },
                { label: 'Appointment', value: 'appointment' },
                { label: 'Payment', value: 'payment' },
                { label: 'Travel', value: 'travel' },
                { label: 'Arrival', value: 'arrival' },
                { label: 'Residence Permit', value: 'residence_permit' },
                { label: 'Other', value: 'other' }
              ]"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Order Index" name="orderIndex" required>
            <UInput v-model.number="state.orderIndex" class="w-full" type="number" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Duration (Days)" name="typicalDurationDays">
            <UInput v-model.number="state.typicalDurationDays" class="w-full" type="number" />
          </UFormField>

          <UFormField label="Validity (Days)" name="validityDays">
            <UInput v-model.number="state.validityDays" class="w-full" type="number" />
          </UFormField>
        </div>

        <UFormField label="Official URL" name="officialUrl">
          <UInput v-model="state.officialUrl" class="w-full" placeholder="https://..." />
        </UFormField>

        <div
          class="grid grid-cols-3 gap-4 items-end bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <UFormField label="Cost (Local)" name="cost">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Cost (Local)</span>
                <UTooltip text="Step cost in the local/selected currency.">
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <UInput v-model.number="state.cost" class="w-full" type="number" />
          </UFormField>

          <UFormField label="Cost Currency" name="currencyCode">
            <USelectMenu
              v-model="state.currencyCode"
              :items="currencies"
              class="w-full"
              placeholder="Select currency"
              searchable
            />
          </UFormField>

          <UFormField label="Equivalent Cost (USD)" name="costUsd">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Equivalent Cost (USD)</span>
                <UTooltip text="Estimated cost converted to USD for comparison.">
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <UInput v-model.number="state.costUsd" class="w-full" type="number" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Origin Side" name="originSide">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Origin Side</span>
                <UTooltip
                  text="If enabled, this step is performed in the origin country before departure."
                >
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <div class="flex items-center h-[32px]">
              <USwitch v-model="state.originSide" />
            </div>
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Depends On (Step IDs)" name="dependsOn">
            <UInput v-model="state.dependsOn" class="w-full" placeholder="ID1,ID2" />
          </UFormField>

          <UFormField label="Must Complete Before (Step IDs)" name="mustCompleteBefore">
            <UInput v-model="state.mustCompleteBefore" class="w-full" placeholder="ID3,ID4" />
          </UFormField>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false"> Cancel </UButton>
        <UButton :loading="adminPathwaysStore.saving" form="step-form" type="submit">
          {{ isEdit ? 'Save Changes' : 'Add Step' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Step } from '~/types'

const props = defineProps<{
  pathwayId: string
  step?: Step
}>()

const emit = defineEmits(['update'])

const isOpen = ref(false)
const adminPathwaysStore = useAdminPathwaysStore()
const countriesStore = useCountriesStore()
const toast = useToast()

onMounted(() => {
  countriesStore.fetchReferenceData()
})

const currencies = computed(() => {
  return (countriesStore.referenceData.currencies as { code: string }[]).map((c) => c.code)
})

const isEdit = computed(() => !!props.step)

const state = reactive({
  title: '',
  description: '',
  category: 'other',
  orderIndex: 0,
  typicalDurationDays: undefined as number | undefined,
  validityDays: undefined as number | undefined,
  officialUrl: '',
  cost: undefined as number | undefined,
  costUsd: undefined as number | undefined,
  currencyCode: 'USD',
  originSide: false,
  dependsOn: '',
  mustCompleteBefore: ''
})

watch(
  () => props.step,
  (newStep) => {
    if (newStep) {
      state.title = newStep.title || ''
      state.description = newStep.description || ''
      state.category = newStep.category || 'other'
      state.orderIndex = newStep.orderIndex || 0
      state.typicalDurationDays = newStep.typicalDurationDays ?? undefined
      state.validityDays = newStep.validityDays ?? undefined
      state.officialUrl = newStep.officialUrl || ''
      state.cost = newStep.cost ?? undefined
      state.costUsd = newStep.costUsd ?? undefined
      state.currencyCode = newStep.currencyCode || 'USD'
      state.originSide = newStep.originSide || false
      state.dependsOn = newStep.dependsOn || ''
      state.mustCompleteBefore = newStep.mustCompleteBefore || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  state.title = ''
  state.description = ''
  state.category = 'other'
  state.orderIndex = 0
  state.typicalDurationDays = undefined
  state.validityDays = undefined
  state.officialUrl = ''
  state.cost = undefined
  state.costUsd = undefined
  state.currencyCode = 'USD'
  state.originSide = false
  state.dependsOn = ''
  state.mustCompleteBefore = ''
}

async function handleSubmit() {
  const data = {
    ...state,
    pathwayId: props.pathwayId
  }

  let result
  if (isEdit.value && props.step) {
    result = await adminPathwaysStore.updateStep(props.step.id, data)
  } else {
    result = await adminPathwaysStore.createStep(data)
  }

  if (result) {
    toast.add({
      title: 'Success',
      description: isEdit.value ? 'Step updated' : 'Step added',
      color: 'success'
    })
    isOpen.value = false
    emit('update')
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Operation failed',
      color: 'error'
    })
  }
}
</script>
