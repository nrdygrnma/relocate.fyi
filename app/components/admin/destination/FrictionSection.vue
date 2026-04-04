<template>
  <AdminSectionCard
    description="Documents, apostilles, translations and in-person requirements"
    icon="i-heroicons-clipboard-document-check"
    title="Practical requirements"
  >
    <AdminFieldGrid>
      <UFormField label="Friction source URL">
        <UInput v-model="frictionSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Friction verified at">
        <UInput v-model="frictionVerifiedAt" class="w-full" type="date" />
      </UFormField>
      <div class="flex flex-wrap gap-4 pt-6">
        <UCheckbox v-model="form.policeClearanceRequired" label="Police clearance required" />
        <UCheckbox v-model="form.apostilleRequired" label="Apostille required" />
        <UCheckbox v-model="form.translationRequired" label="Translation required" />
        <UCheckbox v-model="form.inPersonRequired" label="In-person required" />
      </div>
    </AdminFieldGrid>
    <UFormField label="In-person detail">
      <UTextarea v-model="inPersonDetail" :rows="2" class="w-full" />
    </UFormField>
    <UFormField label="Friction notes">
      <UTextarea v-model="frictionNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { DestinationProfile } from '~/types'

const form = defineModel<Partial<DestinationProfile>>({ required: true })

const frictionSourceUrl = useNullableString(form, 'frictionSourceUrl')
const frictionVerifiedAt = useNullableDate(form, 'frictionVerifiedAt')
const inPersonDetail = useNullableString(form, 'inPersonDetail')
const frictionNotes = useNullableString(form, 'frictionNotes')
</script>
