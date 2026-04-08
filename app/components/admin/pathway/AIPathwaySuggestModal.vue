<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ footer: 'justify-end', content: 'max-w-3xl' }"
    description="Claude will research visa and residency pathways for the selected country and suggest them for review."
    title="AI Pathway Suggestions"
  >
    <slot>
      <UButton color="neutral" icon="i-heroicons-sparkles" variant="outline">
        AI Suggest Pathways
      </UButton>
    </slot>

    <template #body>
      <div class="space-y-5">
        <!-- Country selector -->
        <UFormField label="Country">
          <USelectMenu
            v-model="selectedCountry"
            :items="countryOptions"
            class="w-full"
            label-key="label"
            placeholder="Select a country to research..."
            searchable
          />
        </UFormField>

        <!-- Category filters -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium">Categories to research</p>
            <div class="flex gap-2">
              <UButton size="xs" variant="ghost" @click="checkAllCategories">All</UButton>
              <UButton size="xs" variant="ghost" @click="uncheckAllCategories">None</UButton>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-6 gap-y-2">
            <UCheckbox
              v-for="cat in CATEGORIES"
              :key="cat.value"
              :label="cat.label"
              :model-value="selectedCategories.includes(cat.value)"
              @update:model-value="toggleCategory(cat.value)"
            />
          </div>
        </div>

        <!-- Research button -->
        <UButton
          :disabled="!selectedCountry || selectedCategories.length === 0"
          :loading="store.loading"
          block
          icon="i-heroicons-magnifying-glass"
          @click="research"
        >
          Research {{ selectedCountry ? selectedCountry.label : '' }}
        </UButton>

        <!-- Results -->
        <div v-if="suggestions.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
              {{ suggestions.length }} pathways found — select the ones to add
            </p>
            <div class="flex gap-2">
              <UButton size="xs" variant="ghost" @click="selectAll">Select all</UButton>
              <UButton size="xs" variant="ghost" @click="selectNone">Clear</UButton>
            </div>
          </div>

          <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            <div
              v-for="(pathway, i) in suggestions"
              :key="i"
              :class="[
                'border rounded-lg p-4 cursor-pointer transition-colors',
                selected.has(i)
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              ]"
              @click="toggleSelect(i)"
            >
              <div class="flex items-start gap-3">
                <UCheckbox
                  :model-value="selected.has(i)"
                  class="mt-0.5 shrink-0"
                  @click.stop
                  @update:model-value="toggleSelect(i)"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold">{{ pathway.name }}</span>
                    <UBadge color="neutral" size="xs" variant="subtle">
                      {{ pathway.pathwayType }}
                    </UBadge>
                    <UBadge v-if="pathway.leadsToPr" color="success" size="xs" variant="subtle">
                      Leads to PR
                    </UBadge>
                  </div>
                  <p v-if="pathway.officialName" class="text-xs text-gray-400 mt-0.5">
                    {{ pathway.officialName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ pathway.summary }}
                  </p>
                  <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                    <span v-if="pathway.durationYears">{{ pathway.durationYears }}yr</span>
                    <span v-if="pathway.processingWeeksMin"
                      >{{ pathway.processingWeeksMin }}–{{ pathway.processingWeeksMax }}wk</span
                    >
                    <span v-if="pathway.governmentFeeUsd"
                      >~${{ Number(pathway.governmentFeeUsd).toLocaleString() }}</span
                    >
                    <span>Work: {{ pathway.workAllowed }}</span>
                    <span v-if="pathway.dependentsAllowed">Dependents ok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty / error state -->
        <div v-else-if="hasSearched && !store.loading" class="text-center py-8 text-gray-400">
          No pathways were returned. Try different categories or retry.
        </div>
      </div>
    </template>

    <template #footer>
      <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancel</UButton>
      <UButton
        :disabled="suggestions.length === 0 || selected.size === 0"
        :loading="adding"
        icon="i-heroicons-plus"
        @click="addSelected"
      >
        Add {{ selected.size > 0 ? selected.size : '' }} Selected
      </UButton>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const store = useAdminPathwaysStore()
const countriesStore = useCountriesStore()
const toast = useToast()
const isOpen = defineModel<boolean>('open', { default: false })

onMounted(() => countriesStore.fetchReferenceData())

const CATEGORIES = [
  { label: 'Employed / Skilled Worker', value: 'employed' },
  { label: 'Self-employed / Freelancer', value: 'self_employed' },
  { label: 'Business Owner', value: 'business' },
  { label: 'Investor / Golden Visa', value: 'investor' },
  { label: 'Real Estate Purchase', value: 'real_estate' },
  { label: 'Digital Nomad', value: 'digital_nomad' },
  { label: 'Retirement / Passive Income', value: 'retirement' },
  { label: 'Family Reunification (spouse/partner)', value: 'family' }
]

interface CountryOption {
  id: string
  label: string
}

const countryOptions = computed<CountryOption[]>(() =>
  (countriesStore.referenceData.countries as { name: string; isoCode: string }[]).map((c) => ({
    id: c.isoCode,
    label: c.name
  }))
)

const selectedCountry = ref<CountryOption | undefined>(undefined)
const selectedCategories = ref<string[]>(CATEGORIES.map((c) => c.value))
const suggestions = ref<Record<string, any>[]>([])
const selected = ref<Set<number>>(new Set())
const hasSearched = ref(false)
const adding = ref(false)

function toggleCategory(value: string) {
  const i = selectedCategories.value.indexOf(value)
  if (i === -1) selectedCategories.value.push(value)
  else selectedCategories.value.splice(i, 1)
}

function checkAllCategories() {
  selectedCategories.value = CATEGORIES.map((c) => c.value)
}

function uncheckAllCategories() {
  selectedCategories.value = []
}

async function research() {
  if (!selectedCountry.value || selectedCategories.value.length === 0) return
  suggestions.value = []
  selected.value = new Set()
  hasSearched.value = false

  const categoryLabels = CATEGORIES.filter((c) => selectedCategories.value.includes(c.value)).map(
    (c) => c.label
  )

  const result = await store.suggestAIPathways(selectedCountry.value.label, categoryLabels)
  hasSearched.value = true

  if (result) {
    suggestions.value = result
    selected.value = new Set(result.map((_, i) => i))
  } else {
    toast.add({
      title: 'AI Error',
      description: store.error ?? 'Failed to get suggestions',
      color: 'error'
    })
  }
}

function toggleSelect(i: number) {
  const next = new Set(selected.value)
  next.has(i) ? next.delete(i) : next.add(i)
  selected.value = next
}

function selectAll() {
  selected.value = new Set(suggestions.value.map((_, i) => i))
}

function selectNone() {
  selected.value = new Set()
}

const emit = defineEmits(['created'])

async function addSelected() {
  if (!selectedCountry.value || selected.value.size === 0) return
  adding.value = true

  const toAdd = [...selected.value].map((i) => suggestions.value[i])
  let successCount = 0

  for (const pathway of toAdd) {
    const countrySlug = selectedCountry.value!.id.toLowerCase()
    const nameSlug = (pathway.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const slug = `${countrySlug}-${nameSlug}`

    const result = await store.createPathway({
      ...pathway,
      slug,
      destinationProfileId: selectedCountry.value!.id,
      published: false
    })

    if (result) {
      successCount++
      // Auto-generate eligibility rules for this pathway
      const rules = await store.generateAIRules(
        selectedCountry.value!.label,
        pathway.name as string
      )
      if (rules?.length) {
        for (const rule of rules) {
          await store.createRule({ ...rule, pathwayId: result.id })
        }
      }
    }
  }

  adding.value = false

  if (successCount > 0) {
    toast.add({
      title: 'Pathways Added',
      description: `${successCount} of ${toAdd.length} pathways created successfully.`,
      color: 'success'
    })
    emit('created')
    isOpen.value = false
  } else {
    toast.add({
      title: 'Error',
      description: store.error ?? 'Failed to create pathways',
      color: 'error'
    })
  }
}
</script>
