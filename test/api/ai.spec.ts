import { expect, test } from '@playwright/test'

test.describe('AI API Endpoints', () => {
  test('POST /api/admin/ai/generate-profile returns 500 when no API key is set', async ({
    request
  }) => {
    const response = await request.post('/api/admin/ai/generate-profile', {
      data: { countryName: 'Mauritius', type: 'destination' }
    })
    expect(response.status()).toBe(500)
    const data = await response.json()
    expect(data.statusMessage).toContain('Claude API key not configured')
  })

  test('POST /api/admin/ai/generate-steps returns 500 when no API key is set', async ({
    request
  }) => {
    const response = await request.post('/api/admin/ai/generate-steps', {
      data: { countryName: 'Mauritius', pathwayName: 'Occupation Permit' }
    })
    expect(response.status()).toBe(500)
    const data = await response.json()
    expect(data.statusMessage).toContain('Claude API key not configured')
  })
})
