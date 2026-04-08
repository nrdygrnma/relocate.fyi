<template>
  <UContainer class="py-12 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <NuxtLink class="hover:text-gray-600" to="/admin">Admin</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>Countries</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Countries</h1>
      </div>
      <AdminCountryModal />
    </div>

    <div class="space-y-3">
      <UCard
        v-for="country in store.countries"
        :key="country.id"
        class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
        @click="navigateTo(editUrl(country))"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <div class="font-semibold">{{ country.name }}</div>
              <div class="text-sm text-gray-400 capitalize">
                {{ country.region }} · {{ country.isoCode }} · {{ country.currencyCode }} ·
                {{ country.languagePrimary }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="country.hasDestinationProfile" color="info" variant="subtle">
              Destination
            </UBadge>
            <UBadge v-if="country.hasOriginProfile" color="neutral" variant="subtle">
              Origin
            </UBadge>
            <div class="flex items-center gap-2" @click.stop>
              <UButton
                :color="country.published ? 'success' : 'neutral'"
                :label="country.published ? 'Published' : 'Draft'"
                :loading="store.saving"
                size="xs"
                variant="subtle"
                @click="store.togglePublish(country.id, !country.published)"
              />
              <AdminCountryModal :country="country">
                <UButton
                  color="neutral"
                  data-testid="edit-country"
                  icon="i-heroicons-pencil"
                  size="xs"
                  variant="ghost"
                />
              </AdminCountryModal>
              <UButton
                class="delete-button"
                color="error"
                icon="i-heroicons-trash"
                size="xs"
                variant="ghost"
                @click="confirmDelete(country)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
    <UModal
      v-model:open="isDeleteDialogOpen"
      :description="`Are you sure you want to delete ${countryToDelete?.name}? This action cannot be undone and will delete all associated profiles and pathways.`"
      :ui="{ footer: 'justify-end' }"
      title="Delete Country"
    >
      <template #footer>
        <div class="flex items-center justify-end">
          <div class="flex gap-3">
            <UButton color="neutral" variant="ghost" @click="isDeleteDialogOpen = false">
              Cancel
            </UButton>
            <UButton
              :loading="store.saving"
              class="confirm-delete-button"
              color="error"
              @click="handleDelete"
            >
              Delete
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Country } from '~/types'

const store = useCountriesStore()
const toast = useToast()

await store.fetchAdminCountries()

const isDeleteDialogOpen = ref(false)
const countryToDelete = ref<Country | null>(null)

function confirmDelete(country: Country) {
  countryToDelete.value = country
  isDeleteDialogOpen.value = true
}

async function handleDelete() {
  if (!countryToDelete.value) return

  const success = await store.deleteCountry(countryToDelete.value.id)
  if (success) {
    toast.add({
      title: 'Success',
      description: 'Country deleted successfully',
      color: 'success'
    })
    isDeleteDialogOpen.value = false
    countryToDelete.value = null
  } else {
    toast.add({
      title: 'Error',
      description: store.error || 'Failed to delete country',
      color: 'error'
    })
  }
}

function editUrl(country: Country): string {
  if (country.hasDestinationProfile && country.destinationProfile?.slug) {
    return `/admin/countries/${country.destinationProfile.slug}?type=destination`
  }
  if (country.hasOriginProfile && country.originProfile?.slug) {
    return `/admin/countries/${country.originProfile.slug}?type=origin`
  }
  return '/admin/countries'
}
</script>
