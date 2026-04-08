import { expect, test } from '@playwright/test'
import * as allure from 'allure-js-commons'

test.describe('Admin API', () => {
  const createdCountries: string[] = []

  test.beforeEach(async () => {
    await allure.parentSuite('API')
    await allure.suite('Admin')
  })

  test.afterAll(async ({ request }) => {
    for (const countryId of createdCountries) {
      await request.delete(`/api/admin/countries/${countryId}`)
    }
  })

  test('POST /api/admin/countries creates a country with all fields', async ({ request }) => {
    const countryName = 'Full Test Country ' + Date.now()
    const isoCode = 'FT' + Math.floor(Math.random() * 90 + 10)

    const response = await request.post('/api/admin/countries', {
      data: {
        name: countryName,
        isoCode: isoCode,
        region: 'Europe',
        currencyCode: 'EUR',
        languagePrimary: 'English',
        hasDestinationProfile: true,
        hasOriginProfile: false
      }
    })

    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    createdCountries.push(data.id)
    expect(data.name).toBe(countryName)
    expect(data.currencyCode).toBe('EUR')
    expect(data.languagePrimary).toBe('English')
    expect(data.region).toBe('europe') // check lowercase
  })

  test('POST /api/admin/countries returns 409 for duplicate country', async ({ request }) => {
    const countryName = 'Duplicate ' + Date.now()
    const isoCode = 'DP' + Math.floor(Math.random() * 90 + 10)

    // First create
    const response1 = await request.post('/api/admin/countries', {
      data: {
        name: countryName,
        isoCode: isoCode,
        region: 'Europe',
        hasDestinationProfile: false,
        hasOriginProfile: false
      }
    })
    const data1 = await response1.json()
    if (data1.id) createdCountries.push(data1.id)

    // Second create with same name
    const response = await request.post('/api/admin/countries', {
      data: {
        name: countryName,
        isoCode: isoCode + 'X',
        region: 'Europe',
        hasDestinationProfile: false,
        hasOriginProfile: false
      }
    })

    expect(response.status()).toBe(409)
    const error = await response.json()
    expect(error.statusMessage).toContain('Country already exists')
  })

  test('PATCH /api/admin/countries/[id] updates all country fields', async ({ request }) => {
    // Create first
    const countryName = 'Patch Test Country ' + Date.now()
    const response = await request.post('/api/admin/countries', {
      data: {
        name: countryName,
        isoCode: 'PT' + Math.floor(Math.random() * 90 + 10),
        region: 'Europe',
        currencyCode: 'EUR',
        languagePrimary: 'English',
        hasDestinationProfile: false,
        hasOriginProfile: false
      }
    })
    const data = await response.json()
    createdCountries.push(data.id)

    // Update
    const updateResponse = await request.patch(`/api/admin/countries/${data.id}`, {
      data: {
        name: countryName + ' Updated',
        isoCode: 'PU' + Math.floor(Math.random() * 90 + 10),
        region: 'Asia',
        currencyCode: 'USD',
        languagePrimary: 'Spanish',
        published: true
      }
    })

    expect(updateResponse.ok()).toBeTruthy()
    const updated = await updateResponse.json()
    expect(updated.name).toBe(countryName + ' Updated')
    expect(updated.region).toBe('asia')
    expect(updated.currencyCode).toBe('USD')
    expect(updated.languagePrimary).toBe('Spanish')
    expect(updated.published).toBe(true)
  })

  test('GET /api/admin/reference/countries includes currency and languagePrimary', async ({
    request
  }) => {
    const response = await request.get('/api/admin/reference/countries')
    expect(response.ok()).toBeTruthy()
    const countries = await response.json()

    // Find Mauritius in reference data
    const mauritius = countries.find((c: any) => c.isoCode === 'MU')
    expect(mauritius).toBeDefined()
    expect(mauritius.currency).toBeDefined()
    expect(mauritius.currency.code).toBe('MUR')
    expect(mauritius.languagePrimary).toBeDefined()
    expect(mauritius.languagePrimary.name).toBe('English')
  })
})
