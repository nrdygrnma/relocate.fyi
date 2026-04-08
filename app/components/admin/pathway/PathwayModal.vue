<template>
  <UModal
    v-model:open="isOpen"
    :description="
      isEdit
        ? `Edit details for ${pathway?.name}`
        : 'Create a new pathway for a destination profile.'
    "
    :title="isEdit ? 'Edit Pathway' : 'Add New Pathway'"
    :ui="{ footer: 'justify-end' }"
  >
    <slot>
      <UButton data-testid="add-pathway" icon="i-heroicons-plus"> Add Pathway </UButton>
    </slot>

    <template #body>
      <form id="pathway-form" class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" class="w-full" placeholder="e.g. Digital Nomad Visa" />
        </UFormField>

        <UFormField label="Destination Profile" name="destinationProfileId" required>
          <USelectMenu
            v-model="selectedDestination"
            :items="destinationProfiles"
            class="w-full"
            label-key="label"
            placeholder="Select a destination country"
            searchable
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Pathway Type" name="pathwayType" required>
            <USelect
              v-model="state.pathwayType"
              :items="[
                { label: 'Work', value: 'work' },
                { label: 'Study', value: 'study' },
                { label: 'Investment', value: 'investment' },
                { label: 'Family', value: 'family' },
                { label: 'Digital Nomad', value: 'digital_nomad' },
                { label: 'Retirement', value: 'retirement' },
                { label: 'Other', value: 'other' }
              ]"
              class="w-full"
              placeholder="Select type"
            />
          </UFormField>

          <UFormField class="w-full" label="Duration (Years)" name="durationYears">
            <UInput v-model.number="state.durationYears" class="w-full" type="number" />
          </UFormField>
        </div>

        <div class="flex items-center gap-4">
          <UFormField label="Renewable" name="renewable">
            <USwitch v-model="state.renewable" />
          </UFormField>

          <UFormField label="Leads to PR" name="leadsToPr">
            <USwitch v-model="state.leadsToPr" />
          </UFormField>

          <UFormField label="Dependents Allowed" name="dependentsAllowed">
            <USwitch v-model="state.dependentsAllowed" />
          </UFormField>
        </div>

        <UFormField label="Summary" name="summary">
          <UTextarea
            v-model="state.summary"
            class="w-full"
            placeholder="Brief description of the pathway"
          />
        </UFormField>

        <UFormField label="Official Name" name="officialName">
          <UInput
            v-model="state.officialName"
            class="w-full"
            placeholder="e.g. Digital Nomad Visa (Subclass 123)"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Renewal Detail" name="renewalDetail">
            <UInput
              v-model="state.renewalDetail"
              class="w-full"
              placeholder="e.g. Renew every 2 years"
            />
          </UFormField>

          <UFormField label="PR Timeline (Years)" name="prTimelineYears">
            <UInput v-model.number="state.prTimelineYears" class="w-full" type="number" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Dependent Types" name="dependentTypes">
            <USelectMenu
              v-model="dependentTypesArray"
              :items="commonDependentTypes"
              class="w-full"
              creatable
              multiple
              placeholder="Select or type to add..."
            />
          </UFormField>

          <UFormField label="Work Allowed" name="workAllowed">
            <USelect
              v-model="state.workAllowed"
              :items="[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Limited', value: 'limited' }
              ]"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Stay Requirement (Days/Year)" name="stayRequirementDaysPA">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Stay Requirement (Days/Year)</span>
                <UTooltip
                  text="Minimum number of days per year the applicant must stay in the country."
                >
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <UInput v-model.number="state.stayRequirementDaysPA" class="w-full" type="number" />
          </UFormField>

          <div class="flex items-center gap-4">
            <UFormField label="Property Purchase Required" name="propertyPurchaseRequired">
              <USwitch v-model="state.propertyPurchaseRequired" />
            </UFormField>

            <UFormField
              v-if="state.propertyPurchaseRequired"
              label="Min Value (USD)"
              name="propertyMinValueUsd"
            >
              <UInput v-model.number="state.propertyMinValueUsd" class="w-full" type="number" />
            </UFormField>
          </div>
        </div>

        <UFormField label="Application Stages" name="applicationStages">
          <div class="space-y-2">
            <div
              v-for="(stage, index) in applicationStagesArray"
              :key="index"
              class="flex items-center gap-2"
            >
              <UInput
                v-model="applicationStagesArray[index]"
                class="flex-1"
                placeholder="Stage name"
              />
              <UButton
                color="error"
                icon="i-heroicons-trash"
                size="sm"
                variant="ghost"
                @click="removeStage(index)"
              />
            </div>
            <UButton icon="i-heroicons-plus" size="sm" variant="outline" @click="addStage">
              Add Stage
            </UButton>
          </div>
        </UFormField>

        <div class="grid grid-cols-3 gap-4">
          <UFormField label="Processing Weeks (Min)" name="processingWeeksMin">
            <UInput v-model.number="state.processingWeeksMin" class="w-full" type="number" />
          </UFormField>

          <UFormField label="Processing Weeks (Max)" name="processingWeeksMax">
            <UInput v-model.number="state.processingWeeksMax" class="w-full" type="number" />
          </UFormField>

          <UFormField label="In Person Required" name="inPersonRequired">
            <template #label>
              <div class="flex items-center gap-1">
                <span>In Person Required</span>
                <UTooltip
                  text="Whether the applicant must appear in person at an embassy or office."
                >
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <div class="flex items-center h-8">
              <USwitch v-model="state.inPersonRequired" />
            </div>
          </UFormField>
        </div>

        <div
          class="grid grid-cols-3 gap-4 items-end bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <UFormField label="Gov Fee (Local)" name="governmentFee">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Gov Fee (Local)</span>
                <UTooltip text="Government fee in the local/selected currency.">
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <UInput v-model.number="state.governmentFee" class="w-full" type="number" />
          </UFormField>

          <UFormField label="Fee Currency" name="currencyCode">
            <USelectMenu
              v-model="state.currencyCode"
              :items="currencies"
              class="w-full"
              placeholder="Select currency"
              searchable
            />
          </UFormField>

          <UFormField label="Equivalent Fee (USD)" name="governmentFeeUsd">
            <template #label>
              <div class="flex items-center gap-1">
                <span>Equivalent Fee (USD)</span>
                <UTooltip text="Estimated fee converted to USD for comparison.">
                  <UIcon class="text-gray-400 cursor-help" name="i-heroicons-information-circle" />
                </UTooltip>
              </div>
            </template>
            <UInput v-model.number="state.governmentFeeUsd" class="w-full" type="number" />
          </UFormField>
        </div>

        <UFormField label="Process Notes" name="processNotes">
          <UTextarea
            v-model="state.processNotes"
            class="w-full"
            placeholder="Additional details on the process..."
          />
        </UFormField>

        <UFormField label="Source URL" name="sourceUrl">
          <UInput v-model="state.sourceUrl" class="w-full" placeholder="https://..." />
        </UFormField>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false"> Cancel </UButton>
        <UButton :loading="adminPathwaysStore.saving" form="pathway-form" type="submit">
          {{ isEdit ? 'Save Changes' : 'Create Pathway' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Pathway } from '~/types'

onMounted(() => {
  countriesStore.fetchReferenceData()
})

const props = defineProps<{
  pathway?: Pathway
}>()

const adminPathwaysStore = useAdminPathwaysStore()
const countriesStore = useCountriesStore()
const toast = useToast()
const isOpen = defineModel<boolean>('open', { default: false })

const isEdit = computed(() => !!props.pathway)

interface CountryOption {
  id: string
  label: string
  isoCode: string
}

interface CountryRef {
  name: string
  isoCode: string
  region?: string
}

const destinationProfiles = computed(() => {
  return (countriesStore.referenceData.countries as CountryRef[]).map((c) => ({
    id: c.isoCode,
    label: c.name,
    isoCode: c.isoCode
  }))
})

const selectedDestination = ref<CountryOption | undefined>(undefined)

const currencies = computed(() => {
  return (countriesStore.referenceData.currencies as { code: string }[]).map((c) => c.code)
})

const commonDependentTypes = ['Spouse', 'Children (under 18)', 'Children (over 18)', 'Parents']

const dependentTypesArray = computed({
  get: () => (state.dependentTypes ? state.dependentTypes.split(',').map((t) => t.trim()) : []),
  set: (val) => {
    state.dependentTypes = val.join(', ')
  }
})

const applicationStagesArray = ref<string[]>([])

function addStage() {
  applicationStagesArray.value.push('')
}

function removeStage(index: number) {
  applicationStagesArray.value.splice(index, 1)
}

watch(
  applicationStagesArray,
  (val) => {
    state.applicationStages = JSON.stringify(val.filter((s) => s.trim() !== ''))
  },
  { deep: true }
)

const state = reactive({
  name: '',
  slug: '',
  destinationProfileId: '',
  officialName: '',
  summary: '',
  pathwayType: 'work',
  published: false,
  durationYears: 1,
  renewable: false,
  renewalDetail: '',
  leadsToPr: false,
  prTimelineYears: 5,
  dependentsAllowed: false,
  dependentTypes: '',
  workAllowed: 'yes',
  stayRequirementDaysPA: 0,
  propertyPurchaseRequired: false,
  propertyMinValueUsd: 0,
  applicationStages: '',
  processingWeeksMin: 4,
  processingWeeksMax: 12,
  inPersonRequired: false,
  governmentFee: 0,
  governmentFeeUsd: 0,
  currencyCode: 'USD',
  processNotes: '',
  sourceUrl: ''
})

watch(
  () => props.pathway,
  (val) => {
    if (val) {
      Object.assign(state, {
        ...val,
        // Ensure numbers are numbers
        durationYears: val.durationYears || 0,
        prTimelineYears: val.prTimelineYears || 0,
        stayRequirementDaysPA: val.stayRequirementDaysPA || 0,
        propertyMinValueUsd: val.propertyMinValueUsd || 0,
        processingWeeksMin: val.processingWeeksMin || 0,
        processingWeeksMax: val.processingWeeksMax || 0,
        governmentFee: val.governmentFee || 0,
        governmentFeeUsd: val.governmentFeeUsd || 0,
        currencyCode: val.currencyCode || 'USD'
      })

      // Set application stages array
      if (val.applicationStages) {
        try {
          applicationStagesArray.value = JSON.parse(val.applicationStages)
        } catch {
          applicationStagesArray.value = val.applicationStages
            ? val.applicationStages.split(',').map((s) => s.trim())
            : []
        }
      } else {
        applicationStagesArray.value = []
      }

      const isoCode = (val as any).destinationProfile?.country?.isoCode
      selectedDestination.value =
        destinationProfiles.value.find((d) => d.isoCode === isoCode) || undefined
    }
  },
  { immediate: true }
)

watch(selectedDestination, (val) => {
  if (val) {
    // If it's a reference country, we'll need the backend to handle finding/creating the profile
    // For now, let's keep it simple and assume the ID is what's needed
    // But if it's from reference data, we use isoCode
    state.destinationProfileId = val.id

    // Set default currency from country if not already set or if creating new
    if (!isEdit.value || !state.currencyCode) {
      const countryRef = countriesStore.referenceData.countries.find(
        (c: { isoCode: string; currency?: { code: string } }) => c.isoCode === val.isoCode
      )
      if (countryRef?.currency?.code) {
        state.currencyCode = countryRef.currency.code
      }
    }
  }
})

watch(
  () => state.name,
  (val) => {
    if (!isEdit.value && val) {
      state.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
  }
)

const emit = defineEmits(['update'])

async function handleSubmit() {
  if (!state.name || !state.slug || !state.destinationProfileId) return

  let result
  if (isEdit.value && props.pathway) {
    result = await adminPathwaysStore.updatePathway(props.pathway.id, state)
  } else {
    result = await adminPathwaysStore.createPathway(state)
  }

  if (result) {
    toast.add({
      title: 'Success',
      description: `Pathway ${isEdit.value ? 'updated' : 'created'} successfully`,
      color: 'success'
    })
    emit('update', result)
    isOpen.value = false
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Failed to save pathway',
      color: 'error'
    })
  }
}
</script>
