<template>
  <UModal
    v-model:open="isOpen"
    :description="
      isEdit ? 'Update eligibility rule details' : 'Create a new eligibility rule for this pathway'
    "
    :title="isEdit ? 'Edit Eligibility Rule' : 'Add New Rule'"
  >
    <slot />

    <template #body>
      <form id="rule-form" class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Display Label" name="displayLabel" required>
          <UInput v-model="state.displayLabel" class="w-full" placeholder="e.g. Minimum Salary" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Rule Type" name="ruleType" required>
            <USelect
              v-model="state.ruleType"
              :items="[
                'income',
                'savings',
                'age',
                'nationality',
                'education',
                'experience',
                'other'
              ]"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Operator" name="operator" required>
            <USelect
              v-model="state.operator"
              :items="[
                { label: 'Equals (==)', value: 'eq' },
                { label: 'Greater Than (>)', value: 'gt' },
                { label: 'Greater or Equal (>=)', value: 'gte' },
                { label: 'Less Than (<)', value: 'lt' },
                { label: 'Less or Equal (<=)', value: 'lte' },
                { label: 'In List', value: 'in' },
                { label: 'Not In List', value: 'notin' }
              ]"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Value (Number)" name="valueInt">
            <UInput v-model.number="state.valueInt" class="w-full" type="number" />
          </UFormField>

          <UFormField label="Value (String)" name="valueString">
            <UInput v-model="state.valueString" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Value List (Comma separated)" name="valueList">
          <UInput v-model="state.valueList" class="w-full" placeholder="USA,CAN,GBR" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-4 mt-8">
            <UFormField label="Per Dependent" name="perDependent">
              <USwitch v-model="state.perDependent" />
            </UFormField>

            <UFormField label="Hard Requirement" name="hardRequirement">
              <USwitch v-model="state.hardRequirement" />
            </UFormField>
          </div>

          <UFormField label="Dependent Increment (USD)" name="dependentIncrementUsd">
            <UInput v-model.number="state.dependentIncrementUsd" class="w-full" type="number" />
          </UFormField>
        </div>

        <UFormField label="Notes" name="notes">
          <UTextarea v-model="state.notes" class="w-full" />
        </UFormField>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false"> Cancel </UButton>
        <UButton :loading="adminPathwaysStore.saving" form="rule-form" type="submit">
          {{ isEdit ? 'Save Changes' : 'Add Rule' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { EligibilityRule } from '~/types'

const props = defineProps<{
  pathwayId: string
  rule?: EligibilityRule
}>()

const emit = defineEmits(['update'])

const isOpen = ref(false)
const adminPathwaysStore = useAdminPathwaysStore()
const toast = useToast()

const isEdit = computed(() => !!props.rule)

const state = reactive({
  ruleType: 'income',
  operator: 'gte',
  valueInt: undefined as number | undefined,
  valueString: '',
  valueList: '',
  perDependent: false,
  dependentIncrementUsd: undefined as number | undefined,
  hardRequirement: true,
  displayLabel: '',
  notes: ''
})

watch(
  () => props.rule,
  (newRule) => {
    if (newRule) {
      state.ruleType = newRule.ruleType || 'income'
      state.operator = newRule.operator || 'gte'
      state.valueInt = newRule.valueInt ?? undefined
      state.valueString = newRule.valueString || ''
      state.valueList = newRule.valueList || ''
      state.perDependent = newRule.perDependent || false
      state.dependentIncrementUsd = newRule.dependentIncrementUsd ?? undefined
      state.hardRequirement = newRule.hardRequirement !== false
      state.displayLabel = newRule.displayLabel || ''
      state.notes = newRule.notes || ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  state.ruleType = 'income'
  state.operator = 'gte'
  state.valueInt = undefined
  state.valueString = ''
  state.valueList = ''
  state.perDependent = false
  state.dependentIncrementUsd = undefined
  state.hardRequirement = true
  state.displayLabel = ''
  state.notes = ''
}

async function handleSubmit() {
  const data = {
    ...state,
    pathwayId: props.pathwayId
  }

  let result
  if (isEdit.value && props.rule) {
    result = await adminPathwaysStore.updateRule(props.rule.id, data)
  } else {
    result = await adminPathwaysStore.createRule(data)
  }

  if (result) {
    toast.add({
      title: 'Success',
      description: isEdit.value ? 'Rule updated' : 'Rule added',
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
