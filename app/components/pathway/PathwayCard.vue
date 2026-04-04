<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-base">{{ pathway.name }}</h3>
        <UBadge class="capitalize" color="info" variant="subtle">
          {{ pathway.pathwayType.replace('_', ' ') }}
        </UBadge>
        <UBadge v-if="pathway.renewable" color="success" variant="subtle"> Renewable </UBadge>
      </div>
    </template>

    <div class="space-y-6">
      <p v-if="pathway.summary" class="text-sm text-gray-500 leading-relaxed">
        {{ pathway.summary }}
      </p>

      <ProfileFactGrid>
        <ProfileFactItem
          :value="pathway.durationYears ? `${pathway.durationYears} years` : 'Indefinite'"
          label="Duration"
        />
        <ProfileFactItem
          :value="`${pathway.processingWeeksMin}–${pathway.processingWeeksMax} weeks`"
          label="Processing"
        />
        <ProfileFactItem
          :value="pathway.governmentFeeUsd ? `USD ${pathway.governmentFeeUsd}` : 'None'"
          label="Government fee"
        />
        <ProfileFactItem :value="pathway.workAllowed.replace(/_/g, ' ')" label="Work allowed" />
        <ProfileFactItem
          :value="pathway.dependentsAllowed ? 'Allowed' : 'Not allowed'"
          label="Dependents"
        />
        <ProfileFactItem
          :value="
            pathway.stayRequirementDaysPA ? `${pathway.stayRequirementDaysPA} days/year` : 'None'
          "
          label="Stay requirement"
        />
        <ProfileFactItem :value="pathway.leadsToPr ? 'Yes' : 'No'" label="Leads to PR" />
        <ProfileFactItem
          :value="pathway.inPersonRequired ? 'Yes' : 'No'"
          label="In-person required"
        />
      </ProfileFactGrid>

      <USeparator />

      <div>
        <h4 class="text-sm font-semibold mb-3">Eligibility requirements</h4>
        <PathwayEligibilityList :rules="pathway.eligibilityRules" />
      </div>

      <USeparator />

      <div>
        <h4 class="text-sm font-semibold mb-3">Steps</h4>
        <PathwayStepList :steps="pathway.steps" />
      </div>

      <div v-if="pathway.processNotes" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <p class="text-xs text-gray-500 leading-relaxed">{{ pathway.processNotes }}</p>
      </div>

      <div v-if="pathway.sourceUrl" class="flex justify-end">
        <UButton
          :to="pathway.sourceUrl"
          icon="i-heroicons-arrow-top-right-on-square"
          size="xs"
          target="_blank"
          trailing
          variant="outline"
        >
          Official source
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { Pathway } from '~/types'

defineProps<{
  pathway: Pathway
}>()
</script>
