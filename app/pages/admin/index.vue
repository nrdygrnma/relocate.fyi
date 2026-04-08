<template>
  <UContainer class="py-12">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Admin</h1>
        <p class="text-gray-500">Manage countries, profiles, pathways and steps.</p>
      </div>

      <!-- Stats bar -->
      <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold">{{ stats.totalCountries }}</div>
          <div class="text-xs text-gray-400 mt-1">Countries</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold">
            {{ stats.publishedPathways
            }}<span class="text-base text-gray-400">/{{ stats.totalPathways }}</span>
          </div>
          <div class="text-xs text-gray-400 mt-1">Pathways published</div>
        </div>
        <div
          :class="[
            'rounded-xl p-4 text-center',
            stats.sectionsNeedingReview > 0 ? 'bg-warning/10' : 'bg-success/10'
          ]"
        >
          <div
            :class="[
              'text-2xl font-bold',
              stats.sectionsNeedingReview > 0 ? 'text-warning' : 'text-success'
            ]"
          >
            {{ stats.sectionsNeedingReview }}
          </div>
          <div class="text-xs text-gray-400 mt-1">Sections to review</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-success">
            {{
              stats.totalPathways > 0
                ? Math.round((stats.publishedPathways / stats.totalPathways) * 100)
                : 0
            }}%
          </div>
          <div class="text-xs text-gray-400 mt-1">Published rate</div>
        </div>
      </div>

      <!-- Navigation cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <UCard
          class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          @click="navigateTo('/admin/countries')"
        >
          <div class="flex items-center gap-4">
            <UIcon class="text-3xl text-primary" name="i-heroicons-globe-alt" />
            <div>
              <div class="font-semibold">Countries</div>
              <div class="text-sm text-gray-400">Manage destination and origin profiles</div>
            </div>
          </div>
        </UCard>

        <UCard
          class="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          @click="navigateTo('/admin/pathways')"
        >
          <div class="flex items-center gap-4">
            <UIcon class="text-3xl text-primary" name="i-heroicons-map" />
            <div>
              <div class="font-semibold">Pathways</div>
              <div class="text-sm text-gray-400">Manage permits, steps and eligibility</div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { data: stats } = await useFetch<{
  sectionsNeedingReview: number
  totalPathways: number
  publishedPathways: number
  totalCountries: number
}>('/api/admin/stats')
</script>
