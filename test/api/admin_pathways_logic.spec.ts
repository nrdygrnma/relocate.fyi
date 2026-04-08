import { expect, test } from '@playwright/test'

test.describe('Admin Pathways API - Creation logic', () => {
  const testIsoCode = 'IE' // Ireland (from seed)
  let createdPathwayId: string
  let createdCountryId: string

  test('can create a pathway with an ISO code instead of a profile ID', async ({ request }) => {
    // 1. Ensure Ireland doesn't have a Country/Profile yet (it shouldn't by default after seed unless added)
    const countries = await request.get('/api/admin/countries').then((r) => r.json())
    const existing = countries.find((c: any) => c.isoCode === testIsoCode)

    if (existing) {
      // For a clean test, let's delete it if it exists
      await request.delete(`/api/admin/countries/${existing.id}`)
    }

    // 2. Create pathway using ISO code
    const response = await request.post('/api/admin/pathways', {
      data: {
        name: 'Ireland Tech Visa',
        slug: 'ireland-tech-visa',
        destinationProfileId: testIsoCode, // Passing ISO code
        pathwayType: 'work',
        summary: 'A test tech visa for Ireland'
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('Ireland Tech Visa')
    createdPathwayId = body.id

    // 3. Verify that the country and destination profile were created
    const checkCountries = await request.get('/api/admin/countries').then((r) => r.json())
    const newCountry = checkCountries.find((c: any) => c.isoCode === testIsoCode)

    expect(newCountry).toBeDefined()
    expect(newCountry.name).toBe('Ireland')
    expect(newCountry.hasDestinationProfile).toBe(true)
    expect(newCountry.destinationProfile).toBeDefined()
    expect(body.destinationProfileId).toBe(newCountry.destinationProfile.id)
    createdCountryId = newCountry.id
  })

  test.afterAll(async ({ request }) => {
    if (createdPathwayId) {
      await request.delete(`/api/admin/pathways/${createdPathwayId}`)
    }
    if (createdCountryId) {
      await request.delete(`/api/admin/countries/${createdCountryId}`)
    }
  })
})
