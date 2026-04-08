<template>
  <UContainer class="py-12 max-w-2xl mx-auto">
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Find your pathway</h1>
        <p class="text-gray-500">Answer a few questions and we'll match you to the right permit.</p>
      </div>

      <div v-if="store.step <= store.totalSteps">
        <div class="mb-8">
          <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Step {{ store.step }} of {{ store.totalSteps }}</span>
            <span>{{ Math.round((store.step / store.totalSteps) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              :style="{ width: `${(store.step / store.totalSteps) * 100}%` }"
              class="bg-primary h-1.5 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <UCard class="mb-6">
          <PathwayFinderStepOriginCountry v-if="store.step === 1" />
          <PathwayFinderStep1 v-else-if="store.step === 2" />
          <PathwayFinderStep2 v-else-if="store.step === 3" />
          <PathwayFinderStep3 v-else-if="store.step === 4" />
          <PathwayFinderStep4 v-else-if="store.step === 5" />
          <PathwayFinderStep5 v-else-if="store.step === 6" />
          <PathwayFinderStep6 v-else-if="store.step === 7" />
        </UCard>

        <div class="flex items-center justify-between">
          <UButton
            v-if="store.step > 1"
            icon="i-heroicons-arrow-left"
            variant="outline"
            @click="store.prevStep()"
          >
            Back
          </UButton>
          <div v-else />

          <div class="flex items-center gap-3">
            <UButton
              v-if="store.step < store.totalSteps"
              :disabled="!canProceed"
              icon="i-heroicons-arrow-right"
              trailing
              @click="store.nextStep()"
            >
              Continue
            </UButton>
            <UButton
              v-else
              :loading="store.loading"
              icon="i-heroicons-magnifying-glass"
              trailing
              @click="findPathways"
            >
              Find pathways
            </UButton>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold">
              {{ eligible.length }} pathway{{ eligible.length === 1 ? '' : 's' }} found
            </h2>
            <p class="text-sm text-gray-400 mt-0.5">Click any result to see details</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-share"
              size="sm"
              variant="ghost"
              color="neutral"
              @click="copyShareLink"
            >
              Share
            </UButton>
            <UButton icon="i-heroicons-arrow-path" size="sm" variant="outline" @click="store.reset(); clearQuery()">
              Start over
            </UButton>
          </div>
        </div>

        <div v-if="eligible.length" class="space-y-2 mb-6">
          <PathwayFinderResult
            v-for="result in eligible"
            :key="result.pathway.id"
            :result="result"
          />
        </div>

        <div v-else class="text-center py-10 text-gray-400 mb-6">
          No pathways matched your profile. Try adjusting your answers.
        </div>

        <!-- Not eligible toggle -->
        <div v-if="notEligible.length">
          <button
            class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-3"
            @click="showNotEligible = !showNotEligible"
          >
            <UIcon
              :class="showNotEligible ? 'rotate-180' : ''"
              class="transition-transform"
              name="i-heroicons-chevron-down"
            />
            {{ showNotEligible ? 'Hide' : 'Show' }} {{ notEligible.length }} ineligible pathway{{
              notEligible.length === 1 ? '' : 's'
            }}
          </button>
          <div v-if="showNotEligible" class="space-y-2">
            <PathwayFinderResult
              v-for="result in notEligible"
              :key="result.pathway.id"
              :result="result"
            />
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

await store.fetchPathways()

const showNotEligible = ref(false)
const eligible = computed(() => store.results.filter((r) => !r.hardFail))
const notEligible = computed(() => store.results.filter((r) => r.hardFail))

// Load quiz state from URL query params on mount
onMounted(() => {
  const q = route.query
  if (q.from || q.nat || q.age || q.inc || q.emp) {
    if (q.from) store.userProfile.originCountry = q.from as string
    if (q.nat) store.userProfile.nationality = q.nat as string
    if (q.age) store.userProfile.age = Number(q.age)
    if (q.inc) store.userProfile.monthlyIncomeUsd = Number(q.inc)
    if (q.emp) store.userProfile.employmentStatus = q.emp as string
    if (q.dep) store.userProfile.dependentsCount = Number(q.dep)
    if (q.hi) store.userProfile.hasHealthInsurance = q.hi === '1'
    if (q.cr) store.userProfile.hasCriminalRecord = q.cr === '1'
    // Auto-run if all required fields are present
    if (q.nat && q.age && q.inc && q.emp) {
      store.computeResults()
      store.step = store.totalSteps + 1
    }
  }
})

const canProceed = computed(() => {
  const p = store.userProfile
  switch (store.step) {
    case 1:
      return p.originCountry !== ''
    case 2:
      return p.nationality !== ''
    case 3:
      return p.age !== null && p.age > 0
    case 4:
      return p.monthlyIncomeUsd !== null && p.monthlyIncomeUsd >= 0
    case 5:
      return p.employmentStatus !== ''
    case 6:
      return true
    case 7:
      return true
    default:
      return false
  }
})

async function findPathways() {
  store.computeResults()
  store.step = store.totalSteps + 1
  // Update URL with current quiz state for sharing
  const p = store.userProfile
  await router.replace({
    query: {
      from: p.originCountry || undefined,
      nat: p.nationality || undefined,
      age: p.age?.toString() || undefined,
      inc: p.monthlyIncomeUsd?.toString() || undefined,
      emp: p.employmentStatus || undefined,
      dep: p.dependentsCount > 0 ? p.dependentsCount.toString() : undefined,
      hi: p.hasHealthInsurance ? '1' : undefined,
      cr: p.hasCriminalRecord ? '1' : undefined
    }
  })
}

function clearQuery() {
  router.replace({ query: {} })
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.add({ title: 'Link copied', description: 'Share this link to show your results', color: 'success' })
  } catch {
    toast.add({ title: 'Copy failed', description: 'Please copy the URL manually', color: 'error' })
  }
}
</script>
