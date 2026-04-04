<template>
  <AdminSectionCard
    description="Banking, pensions, Abfertigung and social insurance on exit"
    icon="i-heroicons-banknotes"
    title="Financial continuity"
  >
    <AdminFieldGrid>
      <UFormField label="Bank account post exit">
        <USelect v-model="bankAccountPostExit" :items="bankAccountOptions" class="w-full" />
      </UFormField>
      <UFormField label="Financial source URL">
        <UInput v-model="financialSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Financial verified at">
        <UInput v-model="financialVerifiedAt" class="w-full" type="date" />
      </UFormField>
    </AdminFieldGrid>
    <UFormField label="Bank account detail">
      <UTextarea v-model="bankAccountDetail" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Pension portability">
      <UTextarea v-model="pensionPortability" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Abfertigung rules">
      <UTextarea v-model="abfertigungRules" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Social insurance detail">
      <UTextarea v-model="socialInsuranceDetail" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { OriginProfile } from '~/types'

const form = defineModel<Partial<OriginProfile>>({ required: true })
const bankAccountOptions = ['keep', 'close_required', 'varies_by_bank']

const bankAccountPostExit = useNullableString(form, 'bankAccountPostExit')
const financialSourceUrl = useNullableString(form, 'financialSourceUrl')
const financialVerifiedAt = useNullableDate(form, 'financialVerifiedAt')
const bankAccountDetail = useNullableString(form, 'bankAccountDetail')
const pensionPortability = useNullableString(form, 'pensionPortability')
const abfertigungRules = useNullableString(form, 'abfertigungRules')
const socialInsuranceDetail = useNullableString(form, 'socialInsuranceDetail')
</script>
