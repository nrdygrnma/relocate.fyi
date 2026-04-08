import { expect, test } from '@playwright/test'
import * as allure from 'allure-js-commons'

test.describe('Countries API', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('API')
    await allure.suite('Countries')
  })

  test('GET /api/countries returns a list of published countries', async ({ request }) => {
    const response = await request.get('/api/countries')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  test('returns Austria in the list', async ({ request }) => {
    const response = await request.get('/api/countries')
    const data = await response.json()

    const austria = data.find((c: { isoCode: string }) => c.isoCode === 'AT')
    expect(austria).toBeDefined()
    expect(austria.name).toBe('Austria')
    expect(austria.hasOriginProfile).toBe(true)
  })

  test('returns Mauritius in the list', async ({ request }) => {
    const response = await request.get('/api/countries')
    const data = await response.json()

    const mauritius = data.find((c: { isoCode: string }) => c.isoCode === 'MU')
    expect(mauritius).toBeDefined()
    expect(mauritius.name).toBe('Mauritius')
    expect(mauritius.hasDestinationProfile).toBe(true)
  })

  test('includes destination and origin profile slugs', async ({ request }) => {
    const response = await request.get('/api/countries')
    const data = await response.json()

    const mauritius = data.find((c: { isoCode: string }) => c.isoCode === 'MU')
    expect(mauritius.destinationProfile?.slug).toBe('mauritius')

    const austria = data.find((c: { isoCode: string }) => c.isoCode === 'AT')
    expect(austria.originProfile?.slug).toBe('austria')
  })

  test('only returns published countries', async ({ request }) => {
    const response = await request.get('/api/countries')
    const data = await response.json()

    data.forEach((c: { published: boolean }) => {
      expect(c.published).toBe(true)
    })
  })
})

test.describe('Destination profile API', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('API')
    await allure.suite('Countries')
    await allure.subSuite('Destination profile')
  })

  test('GET /api/countries/mauritius returns destination profile', async ({ request }) => {
    const response = await request.get('/api/countries/mauritius')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.type).toBe('destination')
    expect(data.data.slug).toBe('mauritius')
  })

  test('returns pathway data with eligibility rules and steps', async ({ request }) => {
    const response = await request.get('/api/countries/mauritius')
    const data = await response.json()

    expect(data.data.pathways.length).toBeGreaterThan(0)
    const pathway = data.data.pathways[0]
    expect(pathway.eligibilityRules.length).toBeGreaterThan(0)
    expect(pathway.steps.length).toBeGreaterThan(0)
  })

  test('returns 404 for unknown slug', async ({ request }) => {
    const response = await request.get('/api/countries/unknown-country')
    expect(response.status()).toBe(404)
  })
})

test.describe('Origin profile API', () => {
  test.beforeEach(async () => {
    await allure.parentSuite('API')
    await allure.suite('Countries')
    await allure.subSuite('Origin profile')
  })

  test('GET /api/countries/austria returns origin profile', async ({ request }) => {
    const response = await request.get('/api/countries/austria')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.type).toBe('origin')
    expect(data.data.slug).toBe('austria')
  })

  test('returns Austria tax exit information', async ({ request }) => {
    const response = await request.get('/api/countries/austria')
    const data = await response.json()

    expect(data.data.zweitwohnsitzRule).toBe(true)
    expect(data.data.daysToBreakResidency).toBe(183)
  })
})
