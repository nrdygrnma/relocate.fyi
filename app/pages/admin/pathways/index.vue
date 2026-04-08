<template>
  <UContainer class="py-12 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <NuxtLink class="hover:text-gray-600" to="/admin">Admin</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>Pathways</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Pathways</h1>
      </div>
      <div class="flex gap-2">
        <AdminPathwayAIPathwaySuggestModal @created="adminPathwaysStore.fetchPathways()" />
        <AdminPathwayModal />
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <UInput
        v-model="search"
        class="w-56"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search pathways..."
      />
      <USelect
        v-model="filterType"
        :items="typeOptions"
        :nullable="true"
        class="w-44"
        placeholder="All types"
      />
      <USelect
        v-model="filterStatus"
        :items="statusOptions"
        :nullable="true"
        class="w-36"
        placeholder="All statuses"
      />
      <UButton
        v-if="isFiltered"
        color="neutral"
        icon="i-heroicons-x-mark"
        variant="ghost"
        @click="clearFilters"
      >
        Clear
      </UButton>
      <span class="ml-auto self-center text-sm text-gray-400">
        {{ totalFiltered }} pathway{{ totalFiltered === 1 ? '' : 's' }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="adminPathwaysStore.loading" class="text-center py-12">
      <UIcon class="animate-spin text-3xl text-gray-400" name="i-heroicons-arrow-path" />
    </div>

    <template v-else>
      <!-- No results -->
      <div
        v-if="totalFiltered === 0"
        class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <p class="text-gray-500">
          {{
            adminPathwaysStore.pathways.length === 0
              ? 'No pathways yet. Create your first one!'
              : 'No pathways match your filters.'
          }}
        </p>
      </div>

      <!-- Grouped by country -->
      <div v-else class="space-y-6">
        <div v-for="group in groupedPathways" :key="group.country">
          <div class="flex items-center gap-3 mb-2">
            <h2 class="font-semibold text-base">{{ group.country }}</h2>
            <span class="text-xs text-gray-400"
              >{{ group.pathways.length }} pathway{{ group.pathways.length === 1 ? '' : 's' }}</span
            >
            <USeparator class="flex-1" />
          </div>

          <div class="space-y-2">
            <UCard
              v-for="pathway in group.pathways"
              :key="pathway.id"
              class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              @click="navigateTo(`/admin/pathways/${pathway.id}`)"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <UTooltip :delay-duration="300" :text="pathway.name">
                    <div class="font-semibold truncate">{{ pathway.name }}</div>
                  </UTooltip>
                  <div class="flex flex-wrap items-center gap-2 mt-0.5">
                    <UBadge color="neutral" size="xs" variant="outline">{{
                      pathway.pathwayType
                    }}</UBadge>
                    <span v-if="pathway.durationYears" class="text-xs text-gray-400"
                      >{{ pathway.durationYears }}yr</span
                    >
                    <span v-if="pathway.leadsToPr" class="text-xs text-gray-400"
                      >· leads to PR</span
                    >
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0" @click.stop>
                  <UBadge :color="pathway.published ? 'success' : 'neutral'" variant="subtle">
                    {{ pathway.published ? 'Published' : 'Draft' }}
                  </UBadge>
                  <UButton
                    :color="pathway.published ? 'success' : 'neutral'"
                    :icon="pathway.published ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
                    size="xs"
                    variant="ghost"
                    @click="adminPathwaysStore.togglePublish(pathway.id, !pathway.published)"
                  />
                  <AdminPathwayModal :pathway="pathway">
                    <UButton color="neutral" icon="i-heroicons-pencil" size="xs" variant="ghost" />
                  </AdminPathwayModal>
                  <UButton
                    color="error"
                    icon="i-heroicons-trash"
                    size="xs"
                    variant="ghost"
                    @click="confirmDelete(pathway)"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>

    <!-- Delete confirm modal -->
    <UModal
      v-model:open="isDeleteDialogOpen"
      :description="`Are you sure you want to delete '${pathwayToDelete?.name}'? This will also delete all associated steps and eligibility rules.`"
      :ui="{ footer: 'justify-end' }"
      title="Delete Pathway"
    >
      <template #footer>
        <UButton color="neutral" variant="ghost" @click="isDeleteDialogOpen = false"
          >Cancel</UButton
        >
        <UButton :loading="adminPathwaysStore.saving" color="error" @click="handleDelete"
          >Delete</UButton
        >
      </template>
    </UModal>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Pathway } from '~/types'

const adminPathwaysStore = useAdminPathwaysStore()
const countriesStore = useCountriesStore()
const toast = useToast()

await Promise.all([adminPathwaysStore.fetchPathways(), countriesStore.fetchAdminCountries()])

// Filters
const search = ref('')
const filterType = ref<string | null>(null)
const filterStatus = ref<string | null>(null)

const typeOptions = [
  { label: 'Work', value: 'work' },
  { label: 'Digital Nomad', value: 'digital_nomad' },
  { label: 'Investment', value: 'investment' },
  { label: 'Retirement', value: 'retirement' },
  { label: 'Family', value: 'family' },
  { label: 'Study', value: 'study' },
  { label: 'Other', value: 'other' }
]
const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

const isFiltered = computed(
  () => search.value !== '' || filterType.value !== null || filterStatus.value !== null
)

function clearFilters() {
  search.value = ''
  filterType.value = null
  filterStatus.value = null
}

const filteredPathways = computed(() => {
  return adminPathwaysStore.pathways.filter((p) => {
    const q = search.value.toLowerCase()
    if (
      q &&
      !p.name.toLowerCase().includes(q) &&
      !(p as Pathway).destinationProfile?.country?.name?.toLowerCase().includes(q)
    )
      return false
    if (filterType.value !== null && p.pathwayType !== filterType.value) return false
    if (filterStatus.value === 'published' && !p.published) return false
    if (filterStatus.value === 'draft' && p.published) return false
    return true
  })
})

const totalFiltered = computed(() => filteredPathways.value.length)

const groupedPathways = computed(() => {
  const map = new Map<string, Pathway[]>()
  for (const p of filteredPathways.value) {
    const country = (p as Pathway).destinationProfile?.country?.name ?? 'Unknown'
    if (!map.has(country)) map.set(country, [])
    map.get(country)!.push(p)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([country, pathways]) => ({ country, pathways }))
})

// Delete
const isDeleteDialogOpen = ref(false)
const pathwayToDelete = ref<Pathway | null>(null)

function confirmDelete(pathway: Pathway) {
  pathwayToDelete.value = pathway
  isDeleteDialogOpen.value = true
}

async function handleDelete() {
  if (!pathwayToDelete.value) return
  const success = await adminPathwaysStore.deletePathway(pathwayToDelete.value.id)
  if (success) {
    toast.add({ title: 'Deleted', description: 'Pathway deleted successfully', color: 'success' })
    isDeleteDialogOpen.value = false
    pathwayToDelete.value = null
  } else {
    toast.add({
      title: 'Error',
      description: adminPathwaysStore.error || 'Failed to delete pathway',
      color: 'error'
    })
  }
}
</script>
