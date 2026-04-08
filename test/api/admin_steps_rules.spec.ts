import { expect, test } from '@playwright/test'

test.describe('Admin Steps and Eligibility Rules API', () => {
  let pathwayId: string
  let destinationProfileId: string
  let stepId: string
  let ruleId: string

  test.beforeAll(async ({ request }) => {
    // Cleanup first to be sure
    const existing = await request.get('/api/admin/countries')
    const countries = await existing.json()
    for (const c of countries) {
      if (c.name === 'TestCountryStepRule') {
        await request.delete(`/api/admin/countries/${c.id}`)
      }
    }

    // Create a temporary country and pathway for testing
    const country = await request.post('/api/admin/countries', {
      data: {
        name: 'TestCountryStepRule',
        isoCode: 'TCSR',
        region: 'europe',
        hasDestinationProfile: true,
        hasOriginProfile: false
      }
    })
    const countryData = await country.json()
    if (countryData.error) {
      console.error('FAILED TO CREATE COUNTRY:', countryData)
      throw new Error('Failed to create test country')
    }
    destinationProfileId = countryData.destinationProfile.id

    const pathway = await request.post('/api/admin/pathways', {
      data: {
        name: 'TestPathwaySteps',
        destinationProfileId,
        pathwayType: 'work'
      }
    })
    const pathwayData = await pathway.json()
    pathwayId = pathwayData.id
  })

  test.afterAll(async ({ request }) => {
    if (pathwayId) {
      await request.delete(`/api/admin/pathways/${pathwayId}`)
    }
    // Cleanup country - assume it's deleted with pathway if relations are cascaded,
    // but the deleteCountry endpoint should handle it.
    // Fetch country id first if possible or just rely on pathway delete for now if it works.
  })

  test('can create, update, and delete a step', async ({ request }) => {
    // Create
    const createRes = await request.post('/api/admin/steps', {
      data: {
        pathwayId,
        title: 'Initial Step',
        orderIndex: 0,
        category: 'document_gathering'
      }
    })
    expect(createRes.ok()).toBe(true)
    const step = await createRes.json()
    stepId = step.id
    expect(step.title).toBe('Initial Step')

    // Update
    const updateRes = await request.patch(`/api/admin/steps/${stepId}`, {
      data: {
        title: 'Updated Step'
      }
    })
    expect(updateRes.ok()).toBe(true)
    const updatedStep = await updateRes.json()
    expect(updatedStep.title).toBe('Updated Step')

    // Delete
    const deleteRes = await request.delete(`/api/admin/steps/${stepId}`)
    expect(deleteRes.ok()).toBe(true)
  })

  test('can create, update, and delete an eligibility rule', async ({ request }) => {
    // Create
    const createRes = await request.post('/api/admin/eligibility-rules', {
      data: {
        pathwayId,
        ruleType: 'income',
        operator: 'gte',
        valueInt: 50000,
        displayLabel: 'Min Income'
      }
    })
    expect(createRes.ok()).toBe(true)
    const rule = await createRes.json()
    ruleId = rule.id
    expect(rule.displayLabel).toBe('Min Income')

    // Update
    const updateRes = await request.patch(`/api/admin/eligibility-rules/${ruleId}`, {
      data: {
        displayLabel: 'Updated Min Income'
      }
    })
    expect(updateRes.ok()).toBe(true)
    const updatedRule = await updateRes.json()
    expect(updatedRule.displayLabel).toBe('Updated Min Income')

    // Delete
    const deleteRes = await request.delete(`/api/admin/eligibility-rules/${ruleId}`)
    expect(deleteRes.ok()).toBe(true)
  })
})
