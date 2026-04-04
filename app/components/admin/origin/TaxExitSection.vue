<template>
  <AdminSectionCard
    description="How to cleanly break tax residency and avoid ongoing liability"
    icon="i-heroicons-arrow-right-start-on-rectangle"
    title="Tax liability exit"
  >
    <AdminFieldGrid>
      <UFormField label="Days to break residency">
        <UInput v-model="daysToBreakResidency" class="w-full" type="number" />
      </UFormField>
      <UFormField label="Tax exit source URL">
        <UInput v-model="taxExitSourceUrl" class="w-full" />
      </UFormField>
      <UFormField label="Tax exit verified at">
        <UInput v-model="taxExitVerifiedAt" class="w-full" type="date" />
      </UFormField>
      <div class="flex gap-6 pt-6">
        <UCheckbox v-model="form.exitTaxExists" label="Exit tax exists" />
        <UCheckbox v-model="form.zweitwohnsitzRule" label="Zweitwohnsitz rule applies" />
      </div>
    </AdminFieldGrid>
    <UFormField label="Tax residency rule">
      <UTextarea v-model="taxResidencyRule" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Zweitwohnsitz detail">
      <UTextarea v-model="zweitwohnsitzDetail" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Unlimited liability triggers">
      <UTextarea v-model="unlimitedLiabilityTriggers" :rows="3" class="w-full" />
    </UFormField>
    <UFormField label="Tax exit notes">
      <UTextarea v-model="taxExitNotes" :rows="3" class="w-full" />
    </UFormField>
  </AdminSectionCard>
</template>

<script lang="ts" setup>
import type { OriginProfile } from '~/types'

const form = defineModel<Partial<OriginProfile>>({ required: true })

const daysToBreakResidency = useNullableNumber(form, 'daysToBreakResidency')
const taxExitSourceUrl = useNullableString(form, 'taxExitSourceUrl')
const taxExitVerifiedAt = useNullableDate(form, 'taxExitVerifiedAt')
const taxResidencyRule = useNullableString(form, 'taxResidencyRule')
const zweitwohnsitzDetail = useNullableString(form, 'zweitwohnsitzDetail')
const unlimitedLiabilityTriggers = useNullableString(form, 'unlimitedLiabilityTriggers')
const taxExitNotes = useNullableString(form, 'taxExitNotes')
</script>
