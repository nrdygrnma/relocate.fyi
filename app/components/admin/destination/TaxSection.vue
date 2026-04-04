<template>
  <AdminSectionCard
    description="Tax basis, rates and treaty information"
    icon="i-heroicons-building-library"
    title="Tax structure"
  >
    <AdminFieldGrid>
      <UFormField label="Tax basis">
        <USelect v-model="taxBasis" :items="taxBasisOptions" class="w-full" />
      </UFormField>
      <UFormField label="Income tax rate min (%)">
        <UInput v-model="incomeTaxRateMin" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Income tax rate max (%)">
        <UInput v-model="incomeTaxRateMax" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Tax source URL">
        <UInput v-model="taxSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Tax verified at">
        <UInput v-model="taxVerifiedAt" class="w-full" type="date" />
      </UFormField>
      <div class="flex items-center gap-6 pt-6">
        <UCheckbox v-model="form.capitalGainsTax" label="Capital gains tax" />
        <UCheckbox v-model="form.wealthTax" label="Wealth tax" />
      </div>
    </AdminFieldGrid>
    <UFormField label="Tax remittance detail">
      <UTextarea v-model="taxRemittanceDetail" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Tax notes">
      <UTextarea v-model="taxNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const form = defineModel<Partial<DestinationProfile>>({ required: true })
const taxBasisOptions = ['territorial', 'remittance', 'worldwide']

const taxBasis = useNullableString(form, 'taxBasis')
const incomeTaxRateMin = useNullableNumber(form, 'incomeTaxRateMin')
const incomeTaxRateMax = useNullableNumber(form, 'incomeTaxRateMax')
const taxSourceUrl = useNullableString(form, 'taxSourceUrl')
const taxVerifiedAt = useNullableDate(form, 'taxVerifiedAt')
const taxRemittanceDetail = useNullableString(form, 'taxRemittanceDetail')
const taxNotes = useNullableString(form, 'taxNotes')
</script>
