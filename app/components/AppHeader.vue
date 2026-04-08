<template>
  <header
    class="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50"
  >
    <UContainer>
      <div class="flex items-center justify-between h-14">
        <NuxtLink class="font-black text-xl tracking-tighter" to="/">
          relocate<span class="text-primary">.fyi</span>
        </NuxtLink>

        <nav class="flex items-center gap-6">
          <NuxtLink
            active-class="text-gray-900 dark:text-white"
            class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            to="/"
          >
            Countries
          </NuxtLink>
          <NuxtLink
            active-class="text-gray-900 dark:text-white"
            class="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            to="/pathway-finder"
          >
            Pathway finder
          </NuxtLink>
          <UButton icon="i-heroicons-arrow-right" size="xs" to="/pathway-finder" trailing>
            Get started
          </UButton>
          <USeparator class="h-4" orientation="vertical" />
          <UButton icon="i-heroicons-cog-6-tooth" size="xs" to="/admin" variant="outline">
            Admin
          </UButton>
        </nav>
      </div>
    </UContainer>
  </header>
</template>

<script lang="ts" setup></script>
