<template>
  <div>
    <AdminSaveBar
      :dirty="dirty"
      :loading="store.saving"
      :title="`${isDestination ? 'Destination' : 'Origin'} — ${profile?.country?.name ?? ''}`"
      @save="save"
    />

    <UContainer class="py-10">
      <div v-if="store.loading" class="flex justify-center py-20">
        <UIcon class="animate-spin text-3xl text-gray-400" name="i-heroicons-arrow-path" />
      </div>

      <div v-else-if="profile" class="space-y-6 max-w-3xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold tracking-tight">
            {{ profile.country?.name }}
          </h1>
          <p class="text-sm text-gray-400 mt-1">
            {{ isDestination ? 'Destination profile' : 'Origin profile' }} · Last reviewed
            {{ profile.lastEditorialReview ? profile.lastEditorialReview.slice(0, 10) : 'never' }}
          </p>
        </div>

        <AdminSectionCard
          description="Short overview shown at the top of the public profile page"
          icon="i-heroicons-document-text"
          title="Summary"
        >
          <UFormField label="Summary">
            <UTextarea
              v-model="summary"
              :rows="4"
              class="w-full"
              placeholder="2–3 sentence overview of this country for relocators..."
            />
          </UFormField>
        </AdminSectionCard>

        <template v-if="isDestination">
          <AdminDestinationTaxSection v-model="destinationForm" />
          <AdminDestinationBankingSection v-model="destinationForm" />
          <AdminDestinationHealthcareSection v-model="destinationForm" />
          <AdminDestinationCostSection v-model="destinationForm" />
          <AdminDestinationFrictionSection v-model="destinationForm" />
        </template>

        <template v-else>
          <AdminOriginTaxExitSection v-model="originForm" />
          <AdminOriginDeregistrationSection v-model="originForm" />
          <AdminOriginFinancialSection v-model="originForm" />
          <AdminOriginDocumentsSection v-model="originForm" />
        </template>

        <div class="flex justify-end pt-4">
          <UButton :loading="store.saving" icon="i-heroicons-check" @click="save">
            Save changes
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import type { DestinationProfile, OriginProfile } from '~/types'

const route = useRoute()
const slug = route.params.slug as string
const isDestination = route.query.type === 'destination'
const toast = useToast()
const store = useCountriesStore()

await store.fetchAdminProfile(slug, isDestination ? 'destination' : 'origin')

const profile = computed(() => store.adminProfile)

const form = reactive(
  isDestination
    ? ((store.adminProfile as Partial<DestinationProfile>) ?? {})
    : ((store.adminProfile as Partial<OriginProfile>) ?? {})
) as Partial<DestinationProfile> & Partial<OriginProfile>

const destinationForm = form as Partial<DestinationProfile>
const originForm = form as Partial<OriginProfile>

const formRef = toRef(() => form) as Ref<Partial<DestinationProfile> & Partial<OriginProfile>>
const summary = useNullableString(formRef, 'summary')

const originalForm = JSON.stringify(form)
const dirty = computed(() => JSON.stringify(form) !== originalForm)

async function save() {
  let success = false
  if (isDestination) {
    success = await store.saveDestinationProfile(slug, destinationForm)
  } else {
    success = await store.saveOriginProfile(slug, originForm)
  }
  if (success) {
    toast.add({ title: 'Saved', description: 'Profile updated successfully', color: 'success' })
  } else {
    toast.add({ title: 'Error', description: store.error ?? 'Failed to save', color: 'error' })
  }
}
</script>
