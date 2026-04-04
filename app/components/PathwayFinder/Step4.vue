<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold mb-1">What is your employment status?</h2>
      <p class="text-sm text-gray-500">This affects which permits you are eligible for.</p>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <div
        v-for="option in options"
        :key="option.value"
        :class="
          store.userProfile.employmentStatus === option.value
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
        "
        class="flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all"
        @click="store.userProfile.employmentStatus = option.value"
      >
        <UIcon
          :class="
            store.userProfile.employmentStatus === option.value ? 'text-primary' : 'text-gray-400'
          "
          :name="option.icon"
          class="text-xl mt-0.5 shrink-0"
        />
        <div>
          <div class="font-medium text-sm">{{ option.label }}</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ option.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = usePathwayFinderStore()

const options = [
  {
    value: 'retired',
    label: 'Retired',
    description: 'Receiving pension or living off savings/investments',
    icon: 'i-heroicons-sun'
  },
  {
    value: 'remote_employee',
    label: 'Remote employee',
    description: 'Employed by a foreign company, working remotely',
    icon: 'i-heroicons-computer-desktop'
  },
  {
    value: 'freelancer',
    label: 'Freelancer / self-employed',
    description: 'Independent contractor or sole trader',
    icon: 'i-heroicons-briefcase'
  },
  {
    value: 'business_owner',
    label: 'Business owner',
    description: 'Director or owner of a company',
    icon: 'i-heroicons-building-office'
  },
  {
    value: 'investor',
    label: 'Investor',
    description: 'Living off investment income, dividends or rental income',
    icon: 'i-heroicons-chart-bar-square'
  }
]
</script>
