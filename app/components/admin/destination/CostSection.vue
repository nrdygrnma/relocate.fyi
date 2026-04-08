<template>
  <AdminSectionCard
    description="Monthly budgets, rent estimates and cost tier"
    icon="i-heroicons-banknotes"
    title="Cost of living"
  >
    <AdminFieldGrid>
      <UFormField label="Cost tier">
        <USelect v-model="costTier" :items="costTierOptions" class="w-full" />
      </UFormField>
      <UFormField label="Monthly budget single (USD)">
        <UInput v-model="monthlyBudgetSingleUsd" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Monthly budget couple (USD)">
        <UInput v-model="monthlyBudgetCoupleUsd" class="w-full" type="number" />
      </UFormField>
      <UFormField label="1-bed rent city (USD)">
        <UInput v-model="rent1bedCityUsd" class="w-full" type="number" />
      </UFormField>
      <UFormField label="1-bed rent outside (USD)">
        <UInput v-model="rent1bedOutsideUsd" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Cost source URL">
        <UInput v-model="costSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Cost verified at">
        <UInput v-model="costVerifiedAt" class="w-full" type="date" />
      </UFormField>
    </AdminFieldGrid>
    <UFormField label="Cost notes">
      <UTextarea v-model="costNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const form = defineModel<Partial<DestinationProfile>>({ required: true })
const costTierOptions = ['Low', 'Moderate', 'High', 'Very High']

const costTier = useNullableString(form, 'costTier')
const monthlyBudgetSingleUsd = useNullableNumber(form, 'monthlyBudgetSingleUsd')
const monthlyBudgetCoupleUsd = useNullableNumber(form, 'monthlyBudgetCoupleUsd')
const rent1bedCityUsd = useNullableNumber(form, 'rent1bedCityUsd')
const rent1bedOutsideUsd = useNullableNumber(form, 'rent1bedOutsideUsd')
const costSourceUrl = useNullableString(form, 'costSourceUrl')
const costVerifiedAt = useNullableDate(form, 'costVerifiedAt')
const costNotes = useNullableString(form, 'costNotes')
</script>
