import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/test-utils', '@pinia/nuxt'],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',
  runtimeConfig: {
    anthropicApiKey: '', // NUXT_ANTHROPIC_API_KEY
    deepseekApiKey: '' // NUXT_DEEPSEEK_API_KEY
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    },

    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  }
})
