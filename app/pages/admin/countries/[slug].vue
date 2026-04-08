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

      <div v-else-if="profile" class="max-w-3xl mx-auto">
        <div class="mb-6 flex justify-between items-end">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">
              {{ profile.country?.name }}
            </h1>
            <p class="text-sm text-gray-400 mt-1">
              {{ isDestination ? 'Destination profile' : 'Origin profile' }} · Last reviewed
              {{ profile.lastEditorialReview ? profile.lastEditorialReview.slice(0, 10) : 'never' }}
            </p>
          </div>
          <UButton
            :loading="store.loading"
            color="neutral"
            icon="i-heroicons-sparkles"
            variant="outline"
            @click="generateAI"
          >
            AI Assist
          </UButton>
        </div>

        <!-- Destination: tab-based editor -->
        <template v-if="isDestination">
          <UTabs :items="destinationTabs" class="w-full">
            <template #summary>
              <div class="py-4 space-y-6">
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
              </div>
            </template>

            <template #tax>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="destinationForm.taxStatus" />
                <AdminDestinationTaxSection v-model="destinationForm" />
              </div>
            </template>

            <template #banking>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="destinationForm.bankingStatus" />
                <AdminDestinationBankingSection v-model="destinationForm" />
              </div>
            </template>

            <template #healthcare>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="destinationForm.healthcareStatus" />
                <AdminDestinationHealthcareSection v-model="destinationForm" />
              </div>
            </template>

            <template #cost>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="destinationForm.costStatus" />
                <AdminDestinationCostSection v-model="destinationForm" />
              </div>
            </template>

            <template #friction>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="destinationForm.frictionStatus" />
                <AdminDestinationFrictionSection v-model="destinationForm" />
              </div>
            </template>
          </UTabs>
        </template>

        <!-- Origin: tab-based editor -->
        <template v-else>
          <UTabs :items="originTabs" class="w-full">
            <template #summary>
              <div class="py-4 space-y-6">
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
              </div>
            </template>

            <template #taxexit>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="originForm.taxExitStatus" />
                <AdminOriginTaxExitSection v-model="originForm" />
              </div>
            </template>

            <template #dereg>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="originForm.deregStatus" />
                <AdminOriginDeregistrationSection v-model="originForm" />
              </div>
            </template>

            <template #financial>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="originForm.financialStatus" />
                <AdminOriginFinancialSection v-model="originForm" />
              </div>
            </template>

            <template #documents>
              <div class="py-4 space-y-4">
                <AdminStatusBadge v-model="originForm.documentsStatus" />
                <AdminOriginDocumentsSection v-model="originForm" />
              </div>
            </template>
          </UTabs>
        </template>

        <div class="flex justify-end pt-6">
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

const originalForm = ref(JSON.stringify(form))
const dirty = computed(() => JSON.stringify(form) !== originalForm.value)

const destinationTabs = [
  { label: 'Summary', slot: 'summary', icon: 'i-heroicons-document-text' },
  { label: 'Tax', slot: 'tax', icon: 'i-heroicons-building-library' },
  { label: 'Banking', slot: 'banking', icon: 'i-heroicons-credit-card' },
  { label: 'Healthcare', slot: 'healthcare', icon: 'i-heroicons-heart' },
  { label: 'Cost', slot: 'cost', icon: 'i-heroicons-banknotes' },
  { label: 'Friction', slot: 'friction', icon: 'i-heroicons-clipboard-document-check' }
]

const originTabs = [
  { label: 'Summary', slot: 'summary', icon: 'i-heroicons-document-text' },
  { label: 'Tax Exit', slot: 'taxexit', icon: 'i-heroicons-building-library' },
  { label: 'Deregistration', slot: 'dereg', icon: 'i-heroicons-home' },
  { label: 'Financial', slot: 'financial', icon: 'i-heroicons-banknotes' },
  { label: 'Documents', slot: 'documents', icon: 'i-heroicons-document' }
]

async function generateAI() {
  if (!profile.value?.country?.name) return

  const data = await store.generateAIProfile(
    profile.value.country.name,
    isDestination ? 'destination' : 'origin'
  )

  if (data) {
    Object.keys(data).forEach((key) => {
      if (key in form) {
        // @ts-ignore
        form[key] = data[key]
      }
    })
    toast.add({
      title: 'AI Draft Generated',
      description: 'Review and save the suggested content.',
      color: 'success'
    })
  } else {
    toast.add({
      title: 'AI Assist Failed',
      description: store.error || 'Failed to generate profile.',
      color: 'error'
    })
  }
}

async function save() {
  let success = false
  if (isDestination) {
    success = await store.saveDestinationProfile(slug, destinationForm)
  } else {
    success = await store.saveOriginProfile(slug, originForm)
  }
  if (success) {
    originalForm.value = JSON.stringify(form)
    toast.add({ title: 'Saved', description: 'Profile updated successfully', color: 'success' })
  } else {
    toast.add({ title: 'Error', description: store.error ?? 'Failed to save', color: 'error' })
  }
}
</script>
