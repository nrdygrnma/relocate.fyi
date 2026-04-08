<template>
  <UModal
    v-model:open="isOpen"
    :description="
      isEdit
        ? `Edit details for ${country?.name}`
        : 'Create a new country and its associated profiles.'
    "
    :title="isEdit ? 'Edit Country' : 'Add New Country'"
    :ui="{ footer: 'justify-end' }"
  >
    <slot>
      <UButton data-testid="add-country" icon="i-heroicons-plus"> Add Country </UButton>
    </slot>

    <template #body>
      <form id="country-form" class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Country" name="name" required>
          <div class="space-y-2">
            <div class="flex gap-2">
              <USelectMenu
                v-model="selectedCountry"
                :items="store.referenceData.countries"
                class="flex-1"
                create-item
                label-key="name"
                placeholder="Select a country"
                searchable
                @create="(item) => (selectedCountry = item)"
              >
                <template #option-create="{ item }">
                  <div data-testid="create-new-country">
                    Create "{{ (item as any)?.name || item }}"
                  </div>
                </template>
                <template #item-label="{ item }">
                  <span>
                    {{ (item as any)?.name || item }}
                  </span>
                </template>
              </USelectMenu>
              <UButton
                v-if="!!selectedCountry"
                :loading="store.loading"
                color="neutral"
                icon="i-heroicons-arrow-path"
                variant="outline"
                @click="fetchExternalDetails"
              >
                Fetch Details
              </UButton>
            </div>
            <UInput
              v-if="!!selectedCountry"
              v-model="state.isoCode"
              class="w-full"
              data-testid="iso-input"
              placeholder="Enter ISO Code (e.g. AT)"
            />
          </div>
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Currency Code">
            <USelectMenu
              v-model="selectedCurrency"
              :items="store.referenceData.currencies"
              class="w-full"
              create-item
              label-key="code"
              placeholder="Select currency"
              searchable
              @create="(item) => (selectedCurrency = item)"
            >
              <template #option-create="{ item }">
                <div data-testid="create-new-currency">
                  Create "{{ (item as any)?.code || item }}"
                </div>
              </template>
              <template #item="{ item }">
                <span>{{ item.code }} - {{ item.name }}</span>
              </template>
            </USelectMenu>
          </UFormField>

          <UFormField label="Primary Language">
            <USelectMenu
              v-model="selectedLanguage"
              :items="store.referenceData.languages"
              class="w-full"
              create-item
              label-key="name"
              placeholder="Select language"
              searchable
              @create="(item) => (selectedLanguage = item)"
            >
              <template #option-create="{ item }">
                <div data-testid="create-new-language">
                  Create "{{ (item as any)?.name || item }}"
                </div>
              </template>
            </USelectMenu>
          </UFormField>
        </div>

        <UFormField label="Region" required>
          <USelect
            v-model="state.region"
            :items="['Europe', 'Asia', 'Africa', 'Americas', 'Oceania', 'Middle East']"
            class="w-full"
            placeholder="Select region"
          />
        </UFormField>

        <div v-if="!isEdit" class="space-y-4">
          <div class="flex items-center justify-between">
            <UFormField
              description="Create a destination profile for this country"
              label="Destination Profile"
            >
              <USwitch v-model="state.hasDestinationProfile" />
            </UFormField>
          </div>

          <div class="flex items-center justify-between">
            <UFormField
              description="Create an origin profile for this country"
              label="Origin Profile"
            >
              <USwitch v-model="state.hasOriginProfile" />
            </UFormField>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false"> Cancel </UButton>
        <UButton :loading="store.saving" form="country-form" type="submit">
          {{ isEdit ? 'Save Changes' : 'Create Country' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Country } from '~/types'

const props = defineProps<{
  country?: Country
}>()

const store = useCountriesStore()
const toast = useToast()
const isOpen = defineModel<boolean>('open', { default: false })

const isEdit = computed(() => !!props.country)

interface CountryRef {
  name: string
  isoCode: string
  region?: string
  currency?: {
    id: string
    name: string
    code: string
  }
  languagePrimary?: {
    id: string
    name: string
    code: string
  }
}

interface LanguageRef {
  name: string
  code: string
}

interface CurrencyRef {
  code: string
  name: string
}

const selectedCountry = ref<CountryRef | string | null>(null)
const selectedLanguage = ref<LanguageRef | string | null>(null)
const selectedCurrency = ref<CurrencyRef | string | null>(null)

const state = reactive({
  name: '',
  isoCode: '',
  region: 'Europe',
  currencyCode: '',
  languagePrimary: '',
  hasDestinationProfile: true,
  hasOriginProfile: false
})

watch(
  () => props.country,
  (newCountry) => {
    if (newCountry) {
      state.name = newCountry.name
      state.isoCode = newCountry.isoCode
      state.region =
        newCountry.region.charAt(0).toUpperCase() + newCountry.region.slice(1).toLowerCase()
      state.currencyCode = newCountry.currencyCode
      state.languagePrimary = newCountry.languagePrimary

      selectedCountry.value = {
        name: newCountry.name,
        isoCode: newCountry.isoCode,
        region: newCountry.region,
        currency: {
          code: newCountry.currencyCode,
          name: '',
          id: ''
        },
        languagePrimary: {
          name: newCountry.languagePrimary,
          code: '',
          id: ''
        }
      } as CountryRef

      selectedCurrency.value = { code: newCountry.currencyCode, name: '' } as CurrencyRef
      selectedLanguage.value = { name: newCountry.languagePrimary, code: '' } as LanguageRef
    }
  },
  { immediate: true }
)

watch(selectedCountry, (val) => {
  if (val) {
    if (typeof val === 'string') {
      state.name = val
      state.isoCode = val.slice(0, 2).toUpperCase()
    } else {
      state.name = val.name
      state.isoCode = val.isoCode

      // Auto-populate currency and language if available
      if (val.region) {
        state.region = val.region
          .split('_')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      }
      if (val.currency) {
        selectedCurrency.value = val.currency
        state.currencyCode = val.currency.code
      }
      if (val.languagePrimary) {
        selectedLanguage.value = val.languagePrimary
        state.languagePrimary = val.languagePrimary.name
      }
    }
  }
})

watch(selectedLanguage, (val) => {
  if (val) {
    if (typeof val === 'string') {
      state.languagePrimary = val
    } else {
      state.languagePrimary = val.name
    }
  }
})

watch(selectedCurrency, (val) => {
  if (val) {
    if (typeof val === 'string') {
      state.currencyCode = val
    } else {
      state.currencyCode = val.code
    }
  }
})

onMounted(() => {
  store.fetchReferenceData()
})

async function fetchExternalDetails() {
  const val = selectedCountry.value as unknown as CountryRef | string | null
  const countryName = typeof val === 'string' ? val : val?.name
  if (!countryName) return

  const data = await store.fetchExternalCountryData(countryName)
  if (data) {
    state.isoCode = data.isoCode
    state.region = data.region
    state.currencyCode = data.currencyCode
    state.languagePrimary = data.languagePrimary

    // Also update the select menus if they match
    const foundCurrency = store.referenceData.currencies.find((c) => c.code === data.currencyCode)
    if (foundCurrency) {
      selectedCurrency.value = foundCurrency
    } else {
      selectedCurrency.value = { code: data.currencyCode, name: data.currencyName }
    }

    const foundLanguage = store.referenceData.languages.find((l) => l.name === data.languagePrimary)
    if (foundLanguage) {
      selectedLanguage.value = foundLanguage
    } else {
      selectedLanguage.value = data.languagePrimary
    }

    toast.add({
      title: 'Details Fetched',
      description: `Loaded data for ${data.name}`,
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Not Found',
      description: 'Could not find details for this country',
      color: 'warning'
    })
  }
}

async function handleSubmit() {
  if (!state.name || !state.isoCode || !state.region) return

  let success = false
  if (isEdit.value && props.country) {
    const updated = await store.updateCountry(props.country.id, {
      name: state.name,
      isoCode: state.isoCode,
      region: state.region,
      currencyCode: state.currencyCode,
      languagePrimary: state.languagePrimary
    })
    success = !!updated
  } else {
    const country = await store.createCountry(state)
    if (country) {
      success = true
      if (country.hasDestinationProfile && country.destinationProfile?.slug) {
        await navigateTo(`/admin/countries/${country.destinationProfile.slug}?type=destination`)
      } else if (country.hasOriginProfile && country.originProfile?.slug) {
        await navigateTo(`/admin/countries/${country.originProfile.slug}?type=origin`)
      } else {
        await store.fetchAdminCountries()
      }
    }
  }

  if (success) {
    toast.add({
      title: 'Success',
      description: `${state.name} ${isEdit.value ? 'updated' : 'created'} successfully`,
      color: 'success'
    })
    isOpen.value = false
    if (!isEdit.value) {
      // Reset state for new country
      state.name = ''
      state.isoCode = ''
      state.region = 'Europe'
      state.currencyCode = ''
      state.languagePrimary = ''
      state.hasDestinationProfile = true
      state.hasOriginProfile = false

      selectedCountry.value = null
      selectedLanguage.value = null
      selectedCurrency.value = null
    }
  } else if (store.error) {
    toast.add({
      title: 'Error',
      description: store.error,
      color: 'error'
    })
  }
}
</script>
