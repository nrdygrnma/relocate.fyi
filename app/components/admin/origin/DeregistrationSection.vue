<template>
  <AdminSectionCard
    description="Residence and business deregistration steps and timing"
    icon="i-heroicons-clipboard-document-list"
    title="Deregistration"
  >
    <UFormField label="Deregister residence">
      <UTextarea v-model="deregisterResidence" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Deregister business">
      <UTextarea v-model="deregisterBusiness" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Timing recommendation">
      <UTextarea v-model="timingRecommendation" :rows="2" class="w-full" />
    </UFormField>
    <AdminFieldGrid>
      <UFormField label="Dereg source URL">
        <UInput v-model="deregSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Dereg verified at">
        <UInput v-model="deregVerifiedAt" class="w-full" type="date" />
      </UFormField>
    </AdminFieldGrid>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { OriginProfile } from '~/types'

const form = defineModel<Partial<OriginProfile>>({ required: true })

const deregisterResidence = useNullableString(form, 'deregisterResidence')
const deregisterBusiness = useNullableString(form, 'deregisterBusiness')
const timingRecommendation = useNullableString(form, 'timingRecommendation')
const deregSourceUrl = useNullableString(form, 'deregSourceUrl')
const deregVerifiedAt = useNullableDate(form, 'deregVerifiedAt')
</script>
