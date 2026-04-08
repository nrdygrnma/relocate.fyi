import { expect, test } from '@playwright/test'

test.describe('External Country API', () => {
  test('should fetch country details from restcountries.com', async ({ request }) => {
    const response = await request.get('/api/admin/reference/external-country?name=Austria')
    expect(response.ok()).toBe(true)
    const data = await response.json()

    expect(data).toMatchObject({
      name: 'Austria',
      isoCode: 'AT',
      currencyCode: 'EUR',
      region: 'Europe'
    })
  })

  test('should handle fuzzy search', async ({ request }) => {
    const response = await request.get(
      '/api/admin/reference/external-country?name=United%20Arab%20Emirates'
    )
    expect(response.ok()).toBe(true)
    const data = await response.json()

    expect(data).toMatchObject({
      isoCode: 'AE',
      currencyCode: 'AED',
      region: 'Middle East'
    })
  })

  test('should return null for non-existent country', async ({ request }) => {
    const response = await request.get(
      '/api/admin/reference/external-country?name=NonExistentCountry123'
    )
    expect(response.ok()).toBe(true)
    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    expect(data).toBeNull()
  })
})
