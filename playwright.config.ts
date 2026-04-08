/// <reference types="node" />
import { defineConfig } from '@playwright/test'
import * as os from 'node:os'

export default defineConfig({
  testDir: 'test',
  testMatch: '**/*.spec.ts',
  outputDir: 'test-results',
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: false,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version
        }
      }
    ]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      VITE_COVERAGE: 'true'
    }
  }
})
