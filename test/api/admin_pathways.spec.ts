import { expect, test } from '@playwright/test'

test.describe('Admin Pathways API', () => {
  let tempPathwayId: string
  let destinationProfileId: string

  test.beforeAll(async ({ request }) => {
    // We need a destination profile to link the pathway to
    // First find a country with destination profile
    const countries = await request.get('/api/admin/countries').then((r) => r.json())
    const country = countries.find((c: any) => c.hasDestinationProfile)

    if (country && country.destinationProfile) {
      destinationProfileId = country.destinationProfile.id
    } else {
      // Create one if none exists
      const countryResponse = await request.post('/api/admin/countries', {
        data: {
          name: 'TestPathwayCountry',
          isoCode: 'TPC',
          region: 'Europe',
          hasDestinationProfile: true
        }
      })
      const newCountry = await countryResponse.json()
      destinationProfileId = newCountry.destinationProfile.id
    }
  })

  test('can create a pathway', async ({ request }) => {
    const response = await request.post('/api/admin/pathways', {
      data: {
        name: 'Test API Pathway',
        slug: 'test-api-pathway',
        destinationProfileId,
        pathwayType: 'digital_nomad',
        summary: 'A test pathway'
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('Test API Pathway')
    tempPathwayId = body.id
  })

  test('can fetch pathways', async ({ request }) => {
    const response = await request.get('/api/admin/pathways')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.some((p: any) => p.id === tempPathwayId)).toBe(true)
  })

  test('can update a pathway', async ({ request }) => {
    const response = await request.patch(`/api/admin/pathways/${tempPathwayId}`, {
      data: {
        name: 'Updated API Pathway',
        published: true
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.name).toBe('Updated API Pathway')
    expect(body.published).toBe(true)
  })

  test('can delete a pathway', async ({ request }) => {
    const response = await request.delete(`/api/admin/pathways/${tempPathwayId}`)
    expect(response.status()).toBe(200)

    // Verify it's gone
    const check = await request.get('/api/admin/pathways').then((r) => r.json())
    expect(check.some((p: any) => p.id === tempPathwayId)).toBe(false)
  })

  test.afterAll(async ({ request }) => {
    // Cleanup any other test pathways if they exist
    const pathways = await request.get('/api/admin/pathways').then((r) => r.json())
    for (const p of pathways) {
      if (p.name.includes('Test API Pathway')) {
        await request.delete(`/api/admin/pathways/${p.id}`)
      }
    }
  })
})
