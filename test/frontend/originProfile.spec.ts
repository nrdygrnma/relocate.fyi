import { expect, test } from '../baseFixtures'
import * as allure from 'allure-js-commons'

test.describe('Origin profile page', () => {
  test.beforeEach(async ({ originProfilePage }) => {
    await allure.parentSuite('Frontend')
    await allure.suite('Origin profile')
    await originProfilePage.navigate('austria')
  })

  test('displays Austria heading', async ({ originProfilePage }) => {
    await expect(originProfilePage.pageHeading).toContainText('Austria')
  })

  test('displays all origin info sections', async ({ originProfilePage }) => {
    await expect(originProfilePage.sections.taxExit).toBeVisible()
    await expect(originProfilePage.sections.deregistration).toBeVisible()
    await expect(originProfilePage.sections.financial).toBeVisible()
    await expect(originProfilePage.sections.documents).toBeVisible()
  })

  test('displays tax exit details', async ({ originProfilePage }) => {
    await expect(originProfilePage.page.getByText('Zweitwohnsitz rule')).toBeVisible()
    await expect(originProfilePage.page.getByText('183 days')).toBeVisible()
  })
})
