<template>
  <UContainer class="py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Admin</h1>
      <p class="text-gray-500">Manage countries, profiles, pathways and steps.</p>
    </div>

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
  </UContainer>
</template>

<script lang="ts" setup></script>
