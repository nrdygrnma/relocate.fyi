import { expect, test } from '../baseFixtures'
import * as allure from 'allure-js-commons'

test.describe('Home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await allure.parentSuite('Frontend')
    await allure.suite('Home')
    await homePage.navigate()
  })

  test('displays the hero heading', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible()
  })

  test('displays destination countries section', async ({ homePage }) => {
    await expect(homePage.destinationSection).toBeVisible()
  })

  test('displays origin countries section', async ({ homePage }) => {
    await expect(homePage.originSection).toBeVisible()
  })

  test('shows Mauritius as a destination', async ({ homePage }) => {
    await expect(homePage.getCountryCard('Mauritius')).toBeVisible()
  })

  test('shows Austria as an origin country', async ({ homePage }) => {
    await expect(homePage.getCountryCard('Austria')).toBeVisible()
  })

  test('navigates to Mauritius destination profile on click', async ({ homePage, page }) => {
    await homePage.waitForNetworkIdle()
    await homePage.clickCountry('Mauritius')
    await expect(page).toHaveURL('/destination/mauritius')
  })

  test('navigates to Austria origin profile on click', async ({ homePage, page }) => {
    await homePage.waitForNetworkIdle()
    await homePage.clickCountry('Austria')
    await expect(page).toHaveURL('/origin/austria')
  })
})
