<template>
  <UContainer class="py-12">
    <div v-if="store.loading" class="flex justify-center py-20">
      <UIcon class="animate-spin text-3xl" name="i-heroicons-arrow-path" />
    </div>

    <UAlert v-else-if="store.error" :description="store.error" color="error" />

    <div v-else-if="profile" class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-2">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <NuxtLink class="hover:text-gray-600" to="/">Countries</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>{{ profile.country.name }}</span>
        </div>
        <h1 class="text-4xl font-bold tracking-tight mb-2">{{ profile.country.name }}</h1>
        <p class="text-gray-500 text-lg max-w-3xl">{{ profile.summary }}</p>
      </div>

      <!-- Snapshot bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ profile.costTier ?? '–' }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Cost of living</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ profile.taxBasis ?? '–' }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Tax basis</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ profile.pathways.length }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Pathways</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ bestProcessingTime }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Fastest processing</div>
        </div>
      </div>

      <!-- Pathways (hero position) -->
      <div v-if="profile.pathways.length">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Available pathways
        </h2>
        <div class="space-y-4">
          <PathwayCard v-for="pathway in profile.pathways" :key="pathway.id" :pathway="pathway" />
        </div>
      </div>

      <!-- CTA for finder if no pathways -->
      <div
        v-else
        class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center"
      >
        <p class="text-gray-400 mb-3">No published pathways for this country yet.</p>
        <UButton to="/pathway-finder" variant="outline">Browse all pathways</UButton>
      </div>

      <USeparator />

      <!-- Collapsible detail sections -->
      <ProfileSectionCard
        :collapsible="true"
        :default-open="false"
        :notes="profile.taxNotes"
        :source-url="profile.taxSourceUrl"
        :status="profile.taxStatus"
        :verified-at="formatDate(profile.taxVerifiedAt)"
        title="Tax structure"
      >
        <ProfileFactGrid>
          <ProfileFactItem :value="profile.taxBasis" label="Tax basis" />
          <ProfileFactItem
            :value="incomeTaxRange"
            label="Income tax"
          />
          <ProfileFactItem
            :value="profile.capitalGainsTax ? 'Yes' : 'No'"
            label="Capital gains tax"
          />
          <ProfileFactItem :value="profile.wealthTax ? 'Yes' : 'No'" label="Wealth tax" />
        </ProfileFactGrid>
      </ProfileSectionCard>

      <ProfileSectionCard
        :collapsible="true"
        :default-open="false"
        :notes="profile.bankingNotes"
        :source-url="profile.bankingSourceUrl"
        :status="profile.bankingStatus"
        :verified-at="formatDate(profile.bankingVerifiedAt)"
        title="Banking"
      >
        <ProfileFactGrid>
          <ProfileFactItem label="Neobank accepted">
            <UBadge
              :color="
                profile.neobankAccepted === 'High'
                  ? 'success'
                  : profile.neobankAccepted === 'Moderate'
                    ? 'warning'
                    : 'error'
              "
              class="capitalize"
              variant="subtle"
            >
              {{ profile.neobankAccepted ?? 'Unknown' }}
            </UBadge>
          </ProfileFactItem>
          <ProfileFactItem
            :value="profile.permitRequiredForBanking ? 'Yes' : 'No'"
            label="Permit required first"
          />
          <ProfileFactItem
            :value="
              profile.minDepositRequired
                ? `USD ${profile.minDepositAmountUsd?.toLocaleString()}`
                : 'None'
            "
            label="Min deposit"
          />
          <ProfileFactItem
            :value="profile.accountBeforeArrival ? 'Yes' : 'No'"
            label="Account before arrival"
          />
        </ProfileFactGrid>
      </ProfileSectionCard>

      <ProfileSectionCard
        :collapsible="true"
        :default-open="false"
        :notes="profile.healthcareQualityNotes"
        :source-url="profile.healthcareSourceUrl"
        :status="profile.healthcareStatus"
        :verified-at="formatDate(profile.healthcareVerifiedAt)"
        title="Healthcare"
      >
        <ProfileFactGrid>
          <ProfileFactItem :value="profile.publicHealthcareAccess" label="Public access" />
          <ProfileFactItem
            :value="profile.privateInsuranceRequired ? 'Yes' : 'No'"
            label="Private insurance required"
          />
          <ProfileFactItem
            :value="
              profile.avgPrivateInsuranceUsdPa
                ? `USD ${profile.avgPrivateInsuranceUsdPa.toLocaleString()}`
                : null
            "
            label="Est. annual premium"
          />
        </ProfileFactGrid>
      </ProfileSectionCard>

      <ProfileSectionCard
        :collapsible="true"
        :default-open="false"
        :notes="profile.costNotes"
        :source-url="profile.costSourceUrl"
        :status="profile.costStatus"
        :verified-at="formatDate(profile.costVerifiedAt)"
        title="Cost of living"
      >
        <ProfileFactGrid>
          <ProfileFactItem :value="profile.costTier" label="Tier" />
          <ProfileFactItem
            :value="
              profile.monthlyBudgetSingleUsd
                ? `USD ${profile.monthlyBudgetSingleUsd.toLocaleString()}`
                : null
            "
            label="Single / month"
          />
          <ProfileFactItem
            :value="
              profile.monthlyBudgetCoupleUsd
                ? `USD ${profile.monthlyBudgetCoupleUsd.toLocaleString()}`
                : null
            "
            label="Couple / month"
          />
          <ProfileFactItem
            :value="
              profile.rent1bedCityUsd ? `USD ${profile.rent1bedCityUsd.toLocaleString()}` : null
            "
            label="1-bed rent (city)"
          />
        </ProfileFactGrid>
      </ProfileSectionCard>

      <ProfileSectionCard
        :collapsible="true"
        :default-open="false"
        :notes="profile.frictionNotes"
        :source-url="profile.frictionSourceUrl"
        :status="profile.frictionStatus"
        :verified-at="formatDate(profile.frictionVerifiedAt)"
        title="Practical requirements"
      >
        <ProfileFactGrid>
          <ProfileFactItem
            :value="profile.policeClearanceRequired ? 'Required' : 'Not required'"
            label="Police clearance"
          />
          <ProfileFactItem
            :value="profile.apostilleRequired ? 'Required' : 'Not required'"
            label="Apostille"
          />
          <ProfileFactItem
            :value="profile.translationRequired ? 'Required' : 'Not required'"
            label="Translation"
          />
          <ProfileFactItem
            :value="profile.inPersonRequired ? 'Required' : 'Not required'"
            label="In-person visit"
          />
        </ProfileFactGrid>
        <p v-if="profile.inPersonDetail" class="text-sm text-gray-500 mt-2">
          {{ profile.inPersonDetail }}
        </p>
      </ProfileSectionCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const route = useRoute()
const store = useCountriesStore()

await store.fetchProfile(route.params.slug as string)

const profile = computed(() => {
  if (store.currentProfile?.type === 'destination') {
    return store.currentProfile.data as DestinationProfile
  }
  return null
})

const bestProcessingTime = computed(() => {
  if (!profile.value?.pathways.length) return '–'
  const mins = profile.value.pathways
    .map((p) => p.processingWeeksMin)
    .filter((v): v is number => v !== null)
  if (!mins.length) return '–'
  return `${Math.min(...mins)}wk`
})

const incomeTaxRange = computed(() => {
  if (!profile.value) return null
  const { incomeTaxRateMin: min, incomeTaxRateMax: max } = profile.value
  if (min === null && max === null) return null
  if (min === max) return `${min}%`
  return `${min ?? 0}% – ${max ?? 0}%`
})

function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}
</script>
