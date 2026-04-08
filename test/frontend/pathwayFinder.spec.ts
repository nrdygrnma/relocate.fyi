import { expect, test } from '../baseFixtures'
import * as allure from 'allure-js-commons'

test.describe('Pathway finder', () => {
  test.beforeEach(async ({ pathwayFinderPage }) => {
    await allure.parentSuite('Frontend')
    await allure.suite('Pathway finder')
    await pathwayFinderPage.navigate()
  })

  test('displays the pathway finder heading', async ({ pathwayFinderPage }) => {
    await expect(pathwayFinderPage.heading).toBeVisible()
  })

  test('shows step 1 of 6 on load', async ({ pathwayFinderPage }) => {
    await expect(pathwayFinderPage.stepCounter).toHaveText('Step 1 of 6')
  })

  test('continue button is disabled until nationality is selected', async ({
    pathwayFinderPage
  }) => {
    await expect(pathwayFinderPage.continueButton).toBeDisabled()
  })

  test('can select nationality and proceed to step 2', async ({ pathwayFinderPage }) => {
    await pathwayFinderPage.waitForNetworkIdle()
    await pathwayFinderPage.selectNationality('Austria')
    await pathwayFinderPage.clickContinue()
    await expect(pathwayFinderPage.stepCounter).toHaveText('Step 2 of 6')
  })

  test('can complete full flow and see results', async ({ pathwayFinderPage, page }) => {
    await pathwayFinderPage.waitForNetworkIdle()
    await pathwayFinderPage.selectNationality('Austria')
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.fillAge('52')
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.fillIncome('2000')
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.employmentStatus.retired.click()
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.clickContinue() // Dependents step

    await pathwayFinderPage.healthInsurance.yes.click()
    await pathwayFinderPage.clickFindPathways()

    await expect(page.getByRole('heading', { name: /pathway(s)? found/i })).toBeVisible()
    await expect(page.getByText('Retired Non-Citizen Permit')).toBeVisible()
  })

  test('can see ineligible results when criteria are not met', async ({
    pathwayFinderPage,
    page
  }) => {
    await pathwayFinderPage.waitForNetworkIdle()
    await pathwayFinderPage.selectNationality('Austria')
    await pathwayFinderPage.clickContinue()

    // Too young for the retired permit (which usually requires 50+)
    await pathwayFinderPage.fillAge('25')
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.fillIncome('1000')
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.employmentStatus.retired.click()
    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.clickContinue()

    await pathwayFinderPage.healthInsurance.yes.click()
    await pathwayFinderPage.clickFindPathways()

    await expect(page.getByRole('heading', { name: /pathway(s)? found/i })).toBeVisible()
    await expect(page.getByText('Not eligible')).toBeVisible()
    await expect(page.getByText('Requirements not met')).toBeVisible()
  })
})
