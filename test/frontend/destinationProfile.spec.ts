import { expect, test } from '../baseFixtures'
import * as allure from 'allure-js-commons'

test.describe('Destination profile page', () => {
  test.beforeEach(async ({ destinationProfilePage }) => {
    await allure.parentSuite('Frontend')
    await allure.suite('Destination profile')
    await destinationProfilePage.navigate('mauritius')
  })

  test('displays Mauritius heading', async ({ destinationProfilePage }) => {
    await expect(destinationProfilePage.pageHeading).toContainText('Mauritius')
  })

  test('displays all info sections', async ({ destinationProfilePage }) => {
    await expect(destinationProfilePage.sections.healthcare).toBeVisible()
    await expect(destinationProfilePage.sections.cost).toBeVisible()
    await expect(destinationProfilePage.sections.banking).toBeVisible()
    await expect(destinationProfilePage.sections.tax).toBeVisible()
    await expect(destinationProfilePage.sections.friction).toBeVisible()
  })

  test('displays available pathways', async ({ destinationProfilePage }) => {
    await expect(destinationProfilePage.getPathwayCard('Retired Non-Citizen Permit')).toBeVisible()
  })

  test('can see pathway details', async ({ destinationProfilePage }) => {
    const card = destinationProfilePage.getPathwayCard('Retired Non-Citizen Permit')
    await expect(card.getByText('Eligibility requirements')).toBeVisible()
    await expect(card.getByText('Steps')).toBeVisible()
  })
})
