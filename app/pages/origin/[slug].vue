<template>
  <UContainer class="py-12">
    <div v-if="store.loading" class="flex justify-center py-20">
      <UIcon class="animate-spin text-3xl" name="i-heroicons-arrow-path" />
    </div>

    <UAlert v-else-if="store.error" :description="store.error" color="error" />

    <div v-else-if="profile" class="space-y-6 max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <NuxtLink class="hover:text-gray-600" to="/">Countries</NuxtLink>
          <UIcon name="i-heroicons-chevron-right" />
          <span>{{ profile.country.name }}</span>
        </div>
        <h1 class="text-4xl font-bold tracking-tight mb-2">Leaving {{ profile.country.name }}</h1>
        <p class="text-gray-500 text-lg max-w-3xl">{{ profile.summary }}</p>
      </div>

      <ProfileSectionCard
        :notes="profile.taxExitNotes"
        :source-url="profile.taxExitSourceUrl"
        :verified-at="formatDate(profile.taxExitVerifiedAt)"
        title="Tax liability exit"
      >
        <ProfileFactGrid>
          <ProfileFactItem :value="profile.exitTaxExists ? 'Yes' : 'No'" label="Exit tax" />
          <ProfileFactItem
            :value="profile.daysToBreakResidency ? `${profile.daysToBreakResidency} days` : null"
            label="Days to break residency"
          />
          <ProfileFactItem
            :value="profile.zweitwohnsitzRule ? 'Applies' : 'Does not apply'"
            label="Zweitwohnsitz rule"
          />
        </ProfileFactGrid>
        <div
          v-if="profile.zweitwohnsitzDetail"
          class="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20"
        >
          <p class="text-sm text-warning-700 dark:text-warning-300 leading-relaxed">
            {{ profile.zweitwohnsitzDetail }}
          </p>
        </div>
        <p
          v-if="profile.unlimitedLiabilityTriggers"
          class="text-sm text-gray-500 mt-3 leading-relaxed"
        >
          {{ profile.unlimitedLiabilityTriggers }}
        </p>
      </ProfileSectionCard>

      <ProfileSectionCard :source-url="profile.deregSourceUrl" :verified-at="formatDate(profile.deregVerifiedAt)" title="Deregistration">
        <div class="space-y-4">
          <div v-if="profile.deregisterResidence">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Residence</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.deregisterResidence }}
            </p>
          </div>
          <div v-if="profile.deregisterBusiness">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Business</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.deregisterBusiness }}
            </p>
          </div>
          <div v-if="profile.timingRecommendation">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Timing</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.timingRecommendation }}
            </p>
          </div>
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard
        :source-url="profile.financialSourceUrl"
        :verified-at="formatDate(profile.financialVerifiedAt)"
        title="Financial continuity"
      >
        <ProfileFactGrid>
          <ProfileFactItem
            :value="profile.bankAccountPostExit?.replace(/_/g, ' ')"
            label="Bank account after exit"
          />
        </ProfileFactGrid>
        <div class="space-y-4 mt-4">
          <div v-if="profile.bankAccountDetail">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Banking detail</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.bankAccountDetail }}
            </p>
          </div>
          <div v-if="profile.pensionPortability">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Pension portability
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.pensionPortability }}
            </p>
          </div>
          <div v-if="profile.abfertigungRules">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Abfertigung Neu</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.abfertigungRules }}
            </p>
          </div>
          <div v-if="profile.socialInsuranceDetail">
            <div class="text-xs text-gray-400 uppercase tracking-wide mb-1">Social insurance</div>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ profile.socialInsuranceDetail }}
            </p>
          </div>
        </div>
      </ProfileSectionCard>

      <ProfileSectionCard
        :source-url="profile.documentsSourceUrl"
        :verified-at="formatDate(profile.documentsVerifiedAt)"
        title="Documents needed to exit"
      >
        <ProfileFactGrid>
          <ProfileFactItem :value="profile.policeClearanceIssuer" label="Police clearance issuer" />
          <ProfileFactItem
            :value="profile.policeClearanceWeeks ? `${profile.policeClearanceWeeks} weeks` : null"
            label="Processing time"
          />
          <ProfileFactItem
            :value="
              profile.policeClearanceValidityMonths
                ? `${profile.policeClearanceValidityMonths} months`
                : null
            "
            label="Valid for"
          />
        </ProfileFactGrid>
        <div v-if="profile.policeClearanceUrl" class="mt-3">
          <UButton
            :to="profile.policeClearanceUrl"
            icon="i-heroicons-arrow-top-right-on-square"
            size="xs"
            target="_blank"
            trailing
            variant="outline"
          >
            Apply for police clearance
          </UButton>
        </div>
        <div v-if="otherDocuments.length" class="mt-4 space-y-2">
          <div class="text-xs text-gray-400 uppercase tracking-wide mb-2">Other documents</div>
          <div v-for="doc in otherDocuments" :key="doc.name" class="flex items-start gap-2">
            <UIcon class="text-gray-400 mt-0.5 shrink-0" name="i-heroicons-document-text" />
            <div>
              <span class="text-sm font-medium">{{ doc.name }}</span>
              <p class="text-xs text-gray-500">{{ doc.description }}</p>
            </div>
          </div>
        </div>
      </ProfileSectionCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { OriginProfile } from '~/types'

const route = useRoute()
const store = useCountriesStore()

await store.fetchProfile(route.params.slug as string)

const profile = computed(() => {
  if (store.currentProfile?.type === 'origin') {
    return store.currentProfile.data as OriginProfile
  }
  return null
})

const otherDocuments = computed(() => {
  if (!profile.value?.otherExitDocuments) return []
  try {
    return JSON.parse(profile.value.otherExitDocuments)
  } catch {
    return []
  }
})

function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}
</script>
