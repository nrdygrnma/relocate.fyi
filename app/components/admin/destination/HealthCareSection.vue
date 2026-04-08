<template>
  <AdminSectionCard
    description="Public access, insurance requirements and quality notes"
    icon="i-heroicons-heart"
    title="Healthcare"
  >
    <AdminFieldGrid>
      <UFormField label="Public healthcare access">
        <USelect v-model="publicHealthcareAccess" :items="healthcareAccessOptions" class="w-full" />
      </UFormField>
      <UFormField label="Avg private insurance (USD/year)">
        <UInput v-model="avgPrivateInsuranceUsdPa" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Healthcare source URL">
        <UInput v-model="healthcareSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Healthcare verified at">
        <UInput v-model="healthcareVerifiedAt" class="w-full" type="date" />
      </UFormField>
      <div class="pt-6">
        <UCheckbox v-model="form.privateInsuranceRequired" label="Private insurance required" />
      </div>
    </AdminFieldGrid>
    <UFormField label="Public healthcare detail">
      <UTextarea v-model="publicHealthcareDetail" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Healthcare quality notes">
      <UTextarea v-model="healthcareQualityNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const form = defineModel<Partial<DestinationProfile>>({ required: true })
const healthcareAccessOptions = ['Full', 'Limited', 'None']

const publicHealthcareAccess = useNullableString(form, 'publicHealthcareAccess')
const avgPrivateInsuranceUsdPa = useNullableNumber(form, 'avgPrivateInsuranceUsdPa')
const healthcareSourceUrl = useNullableString(form, 'healthcareSourceUrl')
const healthcareVerifiedAt = useNullableDate(form, 'healthcareVerifiedAt')
const publicHealthcareDetail = useNullableString(form, 'publicHealthcareDetail')
const healthcareQualityNotes = useNullableString(form, 'healthcareQualityNotes')
</script>
