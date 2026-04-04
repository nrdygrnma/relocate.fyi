<template>
  <AdminSectionCard
    description="Neobank acceptance, deposit requirements and practical notes"
    icon="i-heroicons-building-office-2"
    title="Banking"
  >
    <AdminFieldGrid>
      <UFormField label="Neobank accepted">
        <USelect v-model="neobankAccepted" :items="neobankOptions" class="w-full" />
      </UFormField>
      <UFormField label="Min deposit amount (USD)">
        <UInput v-model="minDepositAmountUsd" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Banking source URL">
        <UInput v-model="bankingSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Banking verified at">
        <UInput v-model="bankingVerifiedAt" class="w-full" type="date" />
      </UFormField>
      <div class="flex flex-wrap items-center gap-6 pt-6">
        <UCheckbox v-model="form.accountBeforeArrival" label="Account before arrival" />
        <UCheckbox v-model="form.permitRequiredForBanking" label="Permit required first" />
        <UCheckbox v-model="form.minDepositRequired" label="Min deposit required" />
      </div>
    </AdminFieldGrid>
    <UFormField label="Neobank detail">
      <UTextarea v-model="neobankDetail" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Banking notes">
      <UTextarea v-model="bankingNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const form = defineModel<Partial<DestinationProfile>>({ required: true })
const neobankOptions = ['yes', 'no', 'partial', 'unknown']
const neobankAccepted = useNullableString(form, 'neobankAccepted')
const minDepositAmountUsd = useNullableNumber(form, 'minDepositAmountUsd')
const bankingSourceUrl = useNullableString(form, 'bankingSourceUrl')
const bankingVerifiedAt = useNullableDate(form, 'bankingVerifiedAt')
const neobankDetail = useNullableString(form, 'neobankDetail')
const bankingNotes = useNullableString(form, 'bankingNotes')
</script>
