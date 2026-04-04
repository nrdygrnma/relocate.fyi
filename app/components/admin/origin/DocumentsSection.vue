<template>
  <AdminSectionCard
    description="Police clearance, apostilles and other required documents"
    icon="i-heroicons-document-check"
    title="Exit documents"
  >
    <AdminFieldGrid>
      <UFormField label="Police clearance issuer">
        <UInput v-model="policeClearanceIssuer" class="w-full" />
      </UFormField>
      <UFormField label="Processing weeks">
        <UInput v-model="policeClearanceWeeks" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Validity months">
        <UInput v-model="policeClearanceValidityMonths" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Police clearance URL">
        <UInput v-model="policeClearanceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Documents source URL">
        <UInput v-model="documentsSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Documents verified at">
        <UInput v-model="documentsVerifiedAt" class="w-full" type="date" />
      </UFormField>
    </AdminFieldGrid>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { OriginProfile } from '~/types'

const form = defineModel<Partial<OriginProfile>>({ required: true })

const policeClearanceIssuer = useNullableString(form, 'policeClearanceIssuer')
const policeClearanceWeeks = useNullableNumber(form, 'policeClearanceWeeks')
const policeClearanceValidityMonths = useNullableNumber(form, 'policeClearanceValidityMonths')
const policeClearanceUrl = useNullableString(form, 'policeClearanceUrl')
const documentsSourceUrl = useNullableString(form, 'documentsSourceUrl')
const documentsVerifiedAt = useNullableDate(form, 'documentsVerifiedAt')
</script>
